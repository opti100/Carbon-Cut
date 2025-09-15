import { NextResponse } from 'next/server';
import GHGProtocolCarbonCalculator from '../../../lib/ghgProtocolCalculator';

// Initialize the calculator once
const calculator = new GHGProtocolCarbonCalculator();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userInput} = body;

    if (!userInput) {
      return NextResponse.json({ success: false, message: 'Missing userInput in request body' }, { status: 400 });
    }

    console.log('API received userInput:', userInput);

    const result = calculator.calculateWithGHGProtocol(userInput);

    return NextResponse.json(result);

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}