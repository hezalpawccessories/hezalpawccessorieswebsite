import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Basic health checks
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        server: 'ok',
        database: 'ok', // You can add actual Firebase connectivity check here
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
          unit: 'MB'
        }
      }
    }

    // Optional: Add Firebase connectivity check
    // This ensures your database connection is working
    try {
      // You can uncomment this when you want to test Firebase connectivity
      // const { getOrders } = await import('@/lib/firebase/orders')
      // await getOrders()
      // healthStatus.checks.database = 'ok'
    } catch (dbError) {
      healthStatus.checks.database = 'error'
      healthStatus.status = 'degraded'
    }

    // Return 200 for healthy, 503 for unhealthy
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503
    
    return NextResponse.json(healthStatus, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        server: 'error',
        database: 'unknown',
        memory: 'unknown'
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

// Optional: Add a simple HEAD request for basic uptime checks
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}
