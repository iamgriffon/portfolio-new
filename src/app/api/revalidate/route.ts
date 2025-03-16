import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { secret, tag } = data;
    
    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    if (!tag) {
      return NextResponse.json(
        { message: 'No tag provided' },
        { status: 400 }
      );
    }
    revalidateTag(tag);
    
    return NextResponse.json(
      { 
        revalidated: true,
        message: `Revalidated cache for tag: ${tag}`,
        timestamp: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { 
        revalidated: false,
        message: 'Error revalidating cache',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const secret = searchParams.get('secret');
  
  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
  
  if (!tag) {
    return NextResponse.json(
      { message: 'No tag provided' },
      { status: 400 }
    );
  }
  
  try {
    revalidateTag(tag);
    
    return NextResponse.json({
      revalidated: true,
      message: `Revalidated cache for tag: ${tag}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        revalidated: false,
        message: 'Error revalidating cache',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 