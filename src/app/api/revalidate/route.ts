import { NextRequest, NextResponse } from 'next/server';

// Add static export configuration
export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      revalidated: false,
      message: 'API routes are not available in static exports. Please use ISR or a webhook for revalidation.',
    },
    { status: 404 }
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      revalidated: false,
      message: 'API routes are not available in static exports. Please use ISR or a webhook for revalidation.',
    },
    { status: 404 }
  );
} 