import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { PdfReportService } from '@/services/pdf-report-service'
import { EmailService } from '@/services/email-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  console.log('Stripe webhook received')

  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    console.log('Webhook signature verified successfully')
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Processing webhook event:', event.type)

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      try {
        console.log('Processing checkout.session.completed:', session.id)
        console.log('Session metadata:', session.metadata)

        // Extract report ID from metadata
        const reportId = session.metadata?.reportId
        const userEmail = session.customer_details?.email

        if (!reportId) {
          console.error('No report ID found in session metadata')
          return NextResponse.json({ error: 'No report ID' }, { status: 400 })
        }

        console.log(
          `Processing payment completion for report: ${reportId}, email: ${userEmail}`
        )

        // Update payment status
        const updatedReport = await PdfReportService.updatePaymentStatus(
          reportId,
          'COMPLETED',
          session.payment_intent as string
        )

        console.log('Payment status updated successfully:', {
          reportId: updatedReport.id,
          paymentStatus: updatedReport.paymentStatus,
          paymentDate: updatedReport.paymentDate,
        })

        // Get the updated report with all details
        const report = await PdfReportService.getReportById(reportId)

        if (report && userEmail) {
          try {
            // Send certified PDF via email
            console.log(`Sending certified PDF to ${userEmail}`)
            const emailSent = await EmailService.sendCertifiedPDF(userEmail, report)

            if (emailSent) {
              console.log(
                `✅ Certified PDF sent successfully to ${userEmail} for report ${reportId}`
              )
            } else {
              console.error(`❌ Failed to send certified PDF to ${userEmail}`)
            }
          } catch (emailError) {
            console.error('Error sending certified PDF email:', emailError)
            // Don't fail the webhook if email fails
          }
        } else {
          console.error('Report or email not found:', {
            reportExists: !!report,
            userEmail,
          })
        }

        console.log(`✅ Payment completed successfully for report ${reportId}`)

        return NextResponse.json({
          received: true,
          processed: true,
          reportId,
          paymentStatus: 'COMPLETED',
        })
      } catch (error) {
        console.error('Error processing payment completion:', error)
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
      }

    case 'checkout.session.expired':
      const expiredSession = event.data.object as Stripe.Checkout.Session
      const expiredReportId = expiredSession.metadata?.reportId

      console.log('Processing checkout.session.expired for report:', expiredReportId)

      if (expiredReportId) {
        try {
          await PdfReportService.updatePaymentStatus(expiredReportId, 'FAILED')
          console.log(`Payment expired for report ${expiredReportId}`)
        } catch (error) {
          console.error('Error updating expired payment:', error)
        }
      }
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      // Try to find the report from the payment intent metadata
      const failedReportId = failedPayment.metadata?.reportId

      console.log('Processing payment_intent.payment_failed for report:', failedReportId)

      if (failedReportId) {
        try {
          await PdfReportService.updatePaymentStatus(failedReportId, 'FAILED')
          console.log(`Payment failed for report ${failedReportId}`)
        } catch (error) {
          console.error('Error updating failed payment:', error)
        }
      }
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
