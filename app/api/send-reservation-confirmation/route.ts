/**
 * API Route: Send Reservation Confirmation Email
 * 
 * This API route sends confirmation emails for restaurant reservations.
 * Called after successful reservation insert in the database.
 * 
 * @route POST /api/send-reservation-confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmails, ReservationEmailData } from '@/lib/email';

// CRITICAL: Must use  Node runtime for nodemailer
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reservationId,
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests
    } = body;

    // Validate required fields
    if (!reservationId || !name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare email data
    const emailData: ReservationEmailData = {
      reservationNumber: reservationId.toString(),
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      date: date,
      time: time,
      guests: guests,
      specialRequests: specialRequests || undefined,
    };

    // Send confirmation emails (customer + admin)
    console.log('📧 Sending reservation confirmation emails...');
    const emailResults = await sendConfirmationEmails('reservation', emailData);

    // Log results
    if (emailResults.customerEmail.success) {
      console.log('✅ Customer reservation email sent successfully');
    } else {
      console.error('❌ Customer reservation email failed:', emailResults.customerEmail.error);
    }

    if (emailResults.adminEmail.success) {
      console.log('✅ Admin reservation notification sent');
    } else {
      console.error('❌ Admin reservation email failed:', emailResults.adminEmail.error);
    }

    // Return status (success even if emails failed)
    return NextResponse.json({
      success: true,
      message: 'Reservation confirmation emails processed',
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
