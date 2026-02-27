# Email Integration Guide

## 📧 How to Integrate Email Sending in Your Application

This guide shows you how to add transactional emails to your existing database operations.

---

## 🔑 Prerequisites

### 1. Install Dependencies
```bash
npm install nodemailer @types/nodemailer
```

### 2. Configure Environment Variables

Add to your `.env.local` file:

```env
# SMTP Configuration (Use your email provider's settings)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_smtp_password_here
SMTP_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Test SMTP Connection

Create a test API route:

```typescript
// app/api/test-email/route.ts
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function GET() {
  const result = await sendEmail({
    to: 'yourtestemail@example.com',
    subject: 'Test Email - Your Business Name',
    html: '<h1>Email works!</h1>',
  });

  return Response.json(result);
}
```

Visit `/api/test-email` to test.

---

## 🛠️ Integration Examples

### Example 1: Order Confirmation (Checkout Page)

**Location:** `app/checkout/page.tsx` or `app/api/orders/create/route.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { sendConfirmationEmails, OrderEmailData } from '@/lib/email';

export async function createOrder(formData: FormData) {
  const supabase = await createServerClient();

  // 1. Insert order into database
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_name: formData.get('name'),
      customer_email: formData.get('email'),
      customer_phone: formData.get('phone'),
      order_type: formData.get('orderType'),
      total_amount: calculatedTotal,
      status: 'confirmed',
      payment_reference: paymentRef,
    })
    .select()
    .single();

  if (error) {
    console.error('Order creation failed:', error);
    return { error: 'Failed to create order' };
  }

  // 2. Insert order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items insert failed:', itemsError);
    return { error: 'Failed to save order items' };
  }

  // 3. Send confirmation emails (failures won't affect order)
  try {
    const emailData: OrderEmailData = {
      orderNumber: order.id.toString(),
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      orderType: order.order_type,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.total_amount,
      total: order.total_amount,
      pickupTime: order.pickup_time,
      deliveryAddress: order.delivery_address,
      paymentMethod: order.payment_method,
      paymentReference: order.payment_reference,
    };

    // Send both customer and admin emails
    const emailResults = await sendConfirmationEmails('order', emailData);
    
    console.log('Email Results:', {
      customer: emailResults.customerEmail.success,
      admin: emailResults.adminEmail.success,
    });
  } catch (emailError) {
    // Log but don't fail the order
    console.error('Email sending failed:', emailError);
  }

  // 4. Return success
  return { success: true, orderId: order.id };
}
```

---

### Example 2: Reservation Confirmation

**Location:** `app/nankwaase-bar-and-restaurant/reservations/actions.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { sendConfirmationEmails, ReservationEmailData } from '@/lib/email';

export async function createReservation(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}) {
  const supabase = await createServerClient();

  // 1. Insert reservation
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      reservation_date: data.date,
      reservation_time: data.time,
      number_of_guests: data.guests,
      special_requests: data.specialRequests,
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to create reservation' };
  }

  // 2. Send confirmation emails
  try {
    const emailData: ReservationEmailData = {
      reservationNumber: reservation.id.toString(),
      customerName: reservation.customer_name,
      customerEmail: reservation.customer_email,
      customerPhone: reservation.customer_phone,
      date: new Date(reservation.reservation_date).toLocaleDateString(),
      time: reservation.reservation_time,
      guests: reservation.number_of_guests,
      specialRequests: reservation.special_requests,
    };

    await sendConfirmationEmails('reservation', emailData);
  } catch (emailError) {
    console.error('Email failed:', emailError);
  }

  return { success: true, reservationId: reservation.id };
}
```

---

### Example 3: Event Space Booking

**Location:** `app/event-space/actions.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { sendConfirmationEmails, EventBookingEmailData } from '@/lib/email';

export async function createEventBooking(data: any) {
  const supabase = await createServerClient();

  // 1. Insert booking
  const { data: booking, error } = await supabase
    .from('event_bookings')
    .insert({
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      event_type: data.eventType,
      event_date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      expected_guests: data.guests,
      special_requests: data.requests,
      total_amount: data.amount,
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to create booking' };
  }

  // 2. Send emails
  try {
    const emailData: EventBookingEmailData = {
      bookingNumber: booking.id.toString(),
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      eventType: booking.event_type,
      eventDate: new Date(booking.event_date).toLocaleDateString(),
      startTime: booking.start_time,
      endTime: booking.end_time,
      guests: booking.expected_guests,
      specialRequests: booking.special_requests,
      totalAmount: booking.total_amount,
    };

    await sendConfirmationEmails('event', emailData);
  } catch (emailError) {
    console.error('Email failed:', emailError);
  }

  return { success: true, bookingId: booking.id };
}
```

---

### Example 4: Fitness Membership Registration

**Location:** `app/fresh&fit/actions.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { sendConfirmationEmails, MembershipEmailData } from '@/lib/email';
import { addMonths, format } from 'date-fns';

export async function createMembership(data: any) {
  const supabase = await createServerClient();

  const startDate = new Date();
  const endDate = addMonths(startDate, data.durationMonths);

  // 1. Insert membership
  const { data: membership, error } = await supabase
    .from('memberships')
    .insert({
      user_id: data.userId,
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      plan_name: data.planName,
      plan_duration: `${data.durationMonths} months`,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_amount: data.amount,
      payment_reference: data.paymentRef,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to create membership' };
  }

  // 2. Send emails
  try {
    const emailData: MembershipEmailData = {
      membershipNumber: membership.id.toString(),
      customerName: membership.customer_name,
      customerEmail: membership.customer_email,
      customerPhone: membership.customer_phone,
      planName: membership.plan_name,
      planDuration: membership.plan_duration,
      startDate: format(new Date(membership.start_date), 'PPP'),
      endDate: format(new Date(membership.end_date), 'PPP'),
      totalAmount: membership.total_amount,
      paymentReference: membership.payment_reference,
    };

    await sendConfirmationEmails('membership', emailData);
  } catch (emailError) {
    console.error('Email failed:', emailError);
  }

  return { success: true, membershipId: membership.id };
}
```

---

## 🎨 Email Templates

All email templates are pre-built in `lib/email.ts`:

### Customer Templates:
- ✅ `generateCustomerOrderEmail()` - Order confirmation
- ✅ `generateCustomerReservationEmail()` - Reservation confirmation
- ✅ `generateCustomerEventBookingEmail()` - Event booking confirmation
- ✅ `generateCustomerMembershipEmail()` - Membership activation

### Admin Templates:
- ✅ `generateAdminOrderEmail()` - New order notification
- ✅ `generateAdminReservationEmail()` - New reservation notification
- ✅ `generateAdminEventBookingEmail()` - New event booking notification
- ✅ `generateAdminMembershipEmail()` - New membership notification

### Template Features:
- Professional HTML design with gold (#D4AF37) branding
- Responsive mobile-friendly layout
- Branded header and footer
- Call-to-action buttons
- Order/booking details in styled boxes
- Plain text fallback for all emails

---

## 🚨 Error Handling Best Practices

### 1. Never Block Database Operations

```typescript
// ✅ GOOD: Email failure doesn't affect order
try {
  const order = await createOrderInDB(data);
  await sendEmails(order);  // Fails silently
  return { success: true };
} catch (error) {
  if (emailError) {
    console.error('Email failed, but order succeeded');
  }
}
```

```typescript
// ❌ BAD: Email failure prevents order
const order = await createOrderInDB(data);
await sendEmails(order);  // If this fails, order rollback would be needed
```

### 2. Log All Email Attempts

```typescript
const emailResults = await sendConfirmationEmails('order', data);

console.log('Email Status:', {
  customer: {
    sent: emailResults.customerEmail.success,
    error: emailResults.customerEmail.error,
  },
  admin: {
    sent: emailResults.adminEmail.success,
    error: emailResults.adminEmail.error,
  },
});
```

### 3. Set Up Email Monitoring

Consider adding email status to your database:

```sql
-- Add to orders table
ALTER TABLE orders ADD COLUMN email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN email_sent_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN email_error TEXT;
```

Then update after sending:

```typescript
if (emailResults.customerEmail.success) {
  await supabase
    .from('orders')
    .update({
      email_sent: true,
      email_sent_at: new Date().toISOString(),
    })
    .eq('id', orderId);
}
```

---

## 🧪 Testing Emails

### 1. Development Testing

Use a test email service like [Mailtrap](https://mailtrap.io/) or [Ethereal](https://ethereal.email/):

```typescript
// .env.development.local
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```

### 2. Production Testing

Before going live:

1. Send test emails to yourself
2. Check spam folder placement
3. Verify all links work
4. Test on multiple email clients (Gmail, Outlook, Apple Mail)
5. Verify mobile responsiveness

### 3. Test Email Template

Create a test API route:

```typescript
// app/api/test-template/route.ts
import { generateCustomerOrderEmail } from '@/lib/email';

export async function GET() {
  const html = generateCustomerOrderEmail({
    orderNumber: 'TEST-123',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+233123456789',
    orderType: 'delivery',
    items: [
      { name: 'Jollof Rice', quantity: 2, price: 45 },
      { name: 'Grilled Chicken', quantity: 1, price: 60 },
    ],
    subtotal: 150,
    total: 150,
    deliveryAddress: '123 Main St, Accra',
    paymentMethod: 'Paystack',
    paymentReference: 'PAY-TEST-123',
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
```

Visit `/api/test-template` to preview.

---

## ⚙️ Advanced Configuration

### Custom Email Templates

To customize templates, edit functions in `lib/email.ts`:

```typescript
// Add your own styles
const emailStyles = `
  <style>
    /* Add custom CSS here */
    .my-custom-class { color: #custom; }
  </style>
`;
```

### Multiple Admin Recipients

```typescript
// Send to multiple admins
await sendEmail({
  to: 'admin@yourdomain.com',
  cc: ['manager@yourdomain.com', 'operations@yourdomain.com'],
  subject: 'New Order',
  html: adminHtml,
});
```

### Attachments (Invoices, Receipts)

```typescript
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: customer.email,
  subject: 'Your Invoice',
  html: emailHtml,
  attachments: [
    {
      filename: `invoice-${orderId}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    },
  ],
});
```

---

## 📋 Checklist

Before deploying:

- [ ] SMTP credentials in `.env.local` (not committed)
- [ ] All email templates tested
- [ ] Admin email configured correctly
- [ ] Test emails sent successfully
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Email doesn't block DB operations
- [ ] Node runtime specified in API routes
- [ ] Production SMTP credentials set in hosting platform
- [ ] Spam filter testing completed

---

## 🔗 Related Files

- `lib/email.ts` - Main email utility
- `.env.example` - Environment variable template
- `app/api/send-order-confirmation/route.ts` - Example API route

---

## 🆘 Troubleshooting

### Issue: Emails not sending

**Check:**
1. SMTP credentials are correct
2. Port 587 is not blocked by firewall
3. Use `console.log` to verify function is called
4. Check server logs for errors

### Issue: Emails go to spam

**Solutions:**
1. Verify SPF/DKIM records in Porkbun DNS
2. Use proper From address (noreply@yourdomain.com)
3. Avoid spam trigger words
4. Warm up email domain gradually

### Issue: "SMTP configuration missing"

Verify these variables exist:
```typescript
console.log({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? '***' : 'missing',
});
```

---

**Need Help?** Check the [nodemailer documentation](https://nodemailer.com/) or review `lib/email.ts` for more details.
