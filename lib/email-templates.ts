import { Order } from '@/lib/firebase/orders'; // Assuming Order interface is exported from here or similar

// Re-using the logic from app/master/page.tsx
export const generateCustomerEmailContent = (order: any) => {
   return `Dear ${order.customerDetails.name},

Thank you for shopping with Hezal Accessories! 🐾

We're delighted to inform you that your order is currently being processed with care. Your furry baby is going to look absolutely pawsome with our premium pet accessories!

Order Details:
━━━━━━━━━━━━━━━━━━━━
Order ID: ${order.orderId}
Order Date: ${new Date(order.timestamp || Date.now()).toLocaleDateString()}
Total Amount: ₹${order.orderSummary?.total || order.amount}

Items Ordered:
${order.items.map((item: any) => `• ${item.title} (Size: ${item.size}) - Qty: ${item.quantity} - ₹${item.price}${item.customName ? ` (Custom Name: ${item.customName})` : ''}`).join('\n')}

Shipping Address:
${order.customerDetails.address}
${order.customerDetails.landmark ? order.customerDetails.landmark + '\n' : ''}${order.customerDetails.city}, ${order.customerDetails.state}
${order.customerDetails.pincode}

Current Status: Processing
━━━━━━━━━━━━━━━━━━━━

We take great pride in crafting each accessory with love and attention to detail. Your order will be carefully packaged and dispatched soon.

📦 Important Note: You will receive separate tracking notifications from ShipRocket when your product is dispatched for delivery. Please keep an eye on your email and SMS for delivery updates.

You'll receive tracking details once your order is shipped. In the meantime, feel free to check out our latest collections on Instagram @hezal_accessories.

Thank you for choosing Hezal Accessories for your pet's style needs. We look forward to serving you again soon!

With love and wags,
Team Hezal Accessories 💜

━━━━━━━━━━━━━━━━━━━━
📞 Contact: +91-7060266900
📧 Email: hezal.accessories@gmail.com
🌐 Instagram: @hezal_accessories
━━━━━━━━━━━━━━━━━━━━`;
};

export const generateOwnerEmailContent = (order: any) => {
   const itemsList = order.items.map((item: any) => 
      `• ${item.title} | Size: ${item.size} | Qty: ${item.quantity} | ₹${item.price}${item.customName ? ` | Custom Name: ${item.customName}` : ''}`
   ).join('\n');

   return `NEW ORDER ALERT! 🚨

Order Details:
----------------------------------------
Order ID:      ${order.orderId}
Order Date:    ${new Date(order.timestamp || Date.now()).toLocaleString()}
Total Amount:  ₹${order.orderSummary?.total || order.amount}
Payment ID:    ${order.paymentId || 'N/A'}

Customer Details:
----------------------------------------
Name:    ${order.customerDetails.name}
Email:   ${order.customerDetails.email}
Phone:   ${order.customerDetails.phone}
Address: ${order.customerDetails.address}
         ${order.customerDetails.city}, ${order.customerDetails.state} - ${order.customerDetails.pincode}

Items Ordered:
----------------------------------------
${itemsList}

----------------------------------------
Check the Admin Dashboard for more actions.
`;
};
