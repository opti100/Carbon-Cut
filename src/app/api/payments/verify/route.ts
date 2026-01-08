import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PdfReportService } from '@/services/pdf-report-service'
import { EmailService } from '@/services/email-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId, reportId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    console.log('Verifying payment for session:', sessionId)

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    console.log('Session retrieved:', {
      id: session.id,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    })

    const reportIdFromSession = session.metadata?.reportId || reportId

    if (!reportIdFromSession) {
      return NextResponse.json({ error: 'Report ID not found' }, { status: 400 })
    }

    // Get current report status
    const currentReport = await PdfReportService.getReportById(reportIdFromSession)

    if (!currentReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    console.log('Current report status:', {
      reportId: currentReport.id,
      paymentStatus: currentReport.paymentStatus,
      isCertified: currentReport.isCertified,
    })

    // Check if payment was completed and update if necessary
    if (
      session.payment_status === 'paid' &&
      currentReport.paymentStatus !== 'COMPLETED'
    ) {
      console.log('Payment was completed, updating status...')

      // Update payment status
      const updatedReport = await PdfReportService.updatePaymentStatus(
        reportIdFromSession,
        'COMPLETED',
        session.payment_intent as string
      )

      console.log('Payment status updated to COMPLETED')

      // Send certified PDF via email
      if (session.customer_details?.email) {
        try {
          console.log('Sending certified PDF email...')
          const emailSent = await EmailService.sendCertifiedPDF(
            session.customer_details.email,
            updatedReport
          )

          if (emailSent) {
            console.log('✅ Certified PDF sent successfully')
          } else {
            console.error('❌ Failed to send certified PDF')
          }
        } catch (emailError) {
          console.error('Error sending email:', emailError)
        }
      }

      return NextResponse.json({
        success: true,
        paymentStatus: 'COMPLETED',
        message: 'Payment verified and status updated',
        report: {
          id: updatedReport.id,
          paymentStatus: updatedReport.paymentStatus,
          paymentDate: updatedReport.paymentDate,
        },
      })
    } else if (session.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        paymentStatus: 'COMPLETED',
        message: 'Payment already processed',
        report: {
          id: currentReport.id,
          paymentStatus: currentReport.paymentStatus,
          paymentDate: currentReport.paymentDate,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        paymentStatus: session.payment_status,
        message: 'Payment not completed',
        report: {
          id: currentReport.id,
          paymentStatus: currentReport.paymentStatus,
        },
      })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
