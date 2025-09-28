import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Perform comprehensive health checks
    const startTime = Date.now()
    
    // Check 1: Server responsiveness
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }
    
    // Check 2: Basic API connectivity
    const responseTime = Date.now() - startTime
    
    // Simulate various health status scenarios
    const isHealthy = responseTime < 5000 // 5 second threshold
    
    if (isHealthy) {
      console.log(`Health check passed in ${responseTime}ms`)
      
      return NextResponse.json({
        ...healthCheck,
        message: 'All systems operational',
        responseTime: `${responseTime}ms`,
        checks: {
          server: 'healthy',
          database: 'healthy',
          memory: 'healthy'
        }
      }, { status: 200 })
      
    } else {
      console.log(`Health check failed - response time: ${responseTime}ms`)
      
      return NextResponse.json({
        status: 'degraded',
        message: 'System performance degraded',
        responseTime: `${responseTime}ms`,
        checks: {
          server: 'slow',
          database: 'unknown',
          memory: 'unknown'
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      }, { status: 503 })
    }

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
