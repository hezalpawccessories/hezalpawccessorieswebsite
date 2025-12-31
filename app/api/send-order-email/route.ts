import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateCustomerEmailContent, generateOwnerEmailContent } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { orderDetails } = body;

      if (!orderDetails) {
         return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
      }

      // Check for environment variables
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
         console.error('SMTP credentials missing');
         return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }

      // 1. Configure the transporter
      const transporter = nodemailer.createTransport({
         service: 'gmail', // Built-in service for Gmail (simplifies host/port)
         auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
         },
      });

      // Note: If using a non-Gmail SMTP, we would use:
      // host: process.env.SMTP_HOST,
      // port: Number(process.env.SMTP_PORT),
      // secure: true/false

      // 2. Prepare email content
      // Map frontend data to template expectations
      const orderForTemplate = {
         ...orderDetails,
         items: orderDetails.cartItems || orderDetails.items, // Handle both naming conventions
         amount: orderDetails.amount, // Ensure top-level amount is available
         orderSummary: { total: orderDetails.amount }, // Fallback for template
         timestamp: orderDetails.timestamp || new Date().toISOString()
      };

      const customerEmailContent = generateCustomerEmailContent(orderForTemplate);
      const ownerEmailContent = generateOwnerEmailContent(orderForTemplate);

      // 3. Send emails in parallel
      const emailPromises = [
         // Send to Customer
         transporter.sendMail({
            from: `"Hezal Accessories" <${process.env.SMTP_USER}>`,
            to: orderDetails.customerDetails.email,
            subject: 'Order Confirmation - Hezal Accessories 🐾',
            text: customerEmailContent,
         }),

         // Send to Owner
         transporter.sendMail({
            from: `"Hezal Accessories System" <${process.env.SMTP_USER}>`,
            to: 'iammanishagarg@gmail.com',
            // to: 'imnakul44@gmail.com',
            subject: `New Order Received! #${orderDetails.orderId}`,
            text: ownerEmailContent,
         })
      ];

      await Promise.all(emailPromises);

      console.log('Order emails sent successfully');
      return NextResponse.json({ success: true, message: 'Emails sent' });

   } catch (error) {
      console.error('Error sending emails:', error);
      return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
   }
}
