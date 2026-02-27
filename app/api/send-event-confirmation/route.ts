/**
 * API Route: Send Event Booking Confirmation Email
 * 
 * This API route sends confirmation emails for event space bookings.
 * Called after successful booking insert in the database.
 * 
 * @route POST /api/send-event-confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmails, EventBookingEmailData } from '@/lib/email';

// CRITICAL: Must use Node runtime for nodemailer
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      contactName,
      contactEmail,
      contactPhone,
      eventType,
      eventDate,
      startTime,
      endTime,
      guestCount,
      specialRequests
    } = body;

    // Validate required fields
    if (!bookingId || !contactName || !contactEmail || !contactPhone || !eventType || !eventDate || !startTime || !endTime || !guestCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare email data
    const emailData: EventBookingEmailData = {
      bookingNumber: bookingId.toString(),
      customerName: contactName,
      customerEmail: contactEmail,
      customerPhone: contactPhone,
      eventType: eventType,
      eventDate: eventDate,
      startTime: startTime,
      endTime: endTime,
      guestCount: parseInt(guestCount),
      specialRequests: specialRequests || undefined,
    };

    // Send confirmation emails (customer + admin)
    console.log('📧 Sending event booking confirmation emails...');
    const emailResults = await sendConfirmationEmails('event', emailData);

    // Log results
    if (emailResults.customerEmail.success) {
      console.log('✅ Customer event email sent successfully');
    } else {
      console.error('❌ Customer event email failed:', emailResults.customerEmail.error);
    }

    if (emailResults.adminEmail.success) {
      console.log('✅ Admin event notification sent');
    } else {
      console.error('❌ Admin event email failed:', emailResults.adminEmail.error);
    }

    // Return status (success even if emails failed)
    return NextResponse.json({
      success: true,
      message: 'Event booking confirmation emails processed',
      emailStatus: {
        customer: emailResults.customerEmail.success,
        admin: emailResults.adminEmail.success,
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
