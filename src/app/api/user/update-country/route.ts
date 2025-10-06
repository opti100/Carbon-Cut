import { NextRequest, NextResponse } from 'next/server';
import { getServerSideUser } from '@/utils/server-auth';
import { prisma } from '@/utils/prisma';

export async function POST(request: NextRequest) {
  try {
    const { user, isAuthenticated } = await getServerSideUser();
    
    if (!isAuthenticated || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { country } = await request.json();

    if (!country) {
      return NextResponse.json(
        { success: false, message: 'Country is required' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email: user.email },
      data: { complianceMarketCountry: country }
    });

    return NextResponse.json({
      success: true,
      message: 'Country selection updated successfully'
    });

  } catch (error) {
    console.error('Update country error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update country selection' },
      { status: 500 }
    );
  }
}