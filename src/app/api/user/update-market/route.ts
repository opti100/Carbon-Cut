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

    const { market } = await request.json();

    if (!market || !['COMPLIANCE', 'VOLUNTARY'].includes(market)) {
      return NextResponse.json(
        { success: false, message: 'Invalid market selection' },
        { status: 400 }
      );
    }

    // Update user's market selection
    await prisma.user.update({
      where: { email: user.email },
      data: { market }
    });

    return NextResponse.json({
      success: true,
      message: 'Market selection updated successfully'
    });

  } catch (error) {
    console.error('Update market error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update market selection' },
      { status: 500 }
    );
  }
}