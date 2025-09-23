import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const baseUrl = getBaseUrl(req);
    
    return NextResponse.json({
      success: true,
      baseUrl,
      environment: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        VERCEL_URL: process.env.VERCEL_URL,
        NODE_ENV: process.env.NODE_ENV
      },
      headers: {
        host: req.headers.get('host'),
        'x-forwarded-proto': req.headers.get('x-forwarded-proto'),
        'x-forwarded-protocol': req.headers.get('x-forwarded-protocol')
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}