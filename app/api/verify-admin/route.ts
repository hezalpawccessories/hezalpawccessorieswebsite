import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
   try {
      const { password } = await request.json()

      if (!password) {
         return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 })
      }

      // Check against environment variable
      const adminPassword = process.env.ADMIN_PASSWORD

      if (!adminPassword) {
         console.error('ADMIN_PASSWORD environment variable is not set')
         return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 })
      }

      if (password === adminPassword) {
         return NextResponse.json({ success: true })
      } else {
         return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 })
      }
   } catch (error) {
      console.error('Error verifying admin password:', error)
      return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
   }
}
