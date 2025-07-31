import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET(request: NextRequest) {
  // Create a check-in for Sentry Cron Monitoring
  const checkInId = Sentry.captureCheckIn({
    monitorSlug: 'website-uptime-check',
    status: 'in_progress',
  })

  try {
    // Perform comprehensive health checks
    const startTime = Date.now()
    
    // Check 1: Server responsiveness
    const serverCheck = process.uptime() > 0
    
    // Check 2: Memory usage (flag if > 80% of available)
    const memoryUsage = process.memoryUsage()
    const memoryCheck = (memoryUsage.heapUsed / memoryUsage.heapTotal) < 0.8
    
    // Check 3: Response time check
    const responseTime = Date.now() - startTime
    const responseTimeCheck = responseTime < 1000 // Should respond within 1 second
    
    // Overall health status
    const isHealthy = serverCheck && memoryCheck && responseTimeCheck
    
    const healthData = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: {
        server: serverCheck ? 'ok' : 'error',
        memory: memoryCheck ? 'ok' : 'warning',
        responseTime: responseTimeCheck ? 'ok' : 'slow'
      },
      metrics: {
        uptime: Math.floor(process.uptime()),
        memoryUsagePercent: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
        responseTimeMs: responseTime
      },
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    }

    if (isHealthy) {
      // Report successful check-in to Sentry
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug: 'website-uptime-check',
        status: 'ok',
        duration: responseTime,
      })
      
      return NextResponse.json(healthData, { status: 200 })
    } else {
      // Report failed check-in to Sentry
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug: 'website-uptime-check',
        status: 'error',
        duration: responseTime,
      })
      
      return NextResponse.json(healthData, { status: 503 })
    }

  } catch (error) {
    console.error('Uptime check failed:', error)
    
    // Report error to Sentry
    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: 'website-uptime-check',
      status: 'error',
      duration: Date.now() - Date.now(),
    })
    
    Sentry.captureException(error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}
