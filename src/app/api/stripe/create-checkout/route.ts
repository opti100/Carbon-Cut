import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getBaseUrl } from '@/lib/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { reportId, email, companyName, amount = 19900 } = await req.json();

    if (!reportId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get base URL using utility function
    const baseUrl = getBaseUrl(req).replace(/\/$/, ''); // Remove trailing slash
    
    console.log('Creating Stripe session with base URL:', baseUrl);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: {
        reportId,
        email,
        companyName: companyName || 'Unknown Company'
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Carbon Offset Report Certification',
              description: `Certified carbon Offset report for ${companyName}`,
              metadata: {
                reportId,
                companyName
              }
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?email=${encodeURIComponent(email)}&payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard?email=${encodeURIComponent(email)}&payment=cancelled`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: 'Your certified carbon Offset report will be emailed to you after payment confirmation.'
        }
      }
    });

    console.log('Stripe session created successfully:', session.id);

    return NextResponse.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      });
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}