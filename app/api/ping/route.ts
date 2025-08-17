import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simple ping response for uptime monitors
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'Hezal Accessories Website is running'
    }

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Ping endpoint failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Service temporarily unavailable'
    }, { status: 503 })
  }
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}
