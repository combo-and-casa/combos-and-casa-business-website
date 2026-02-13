import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();

    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      event_space_id,
      event_date,
      start_time,
      end_time,
      guests,
      purpose,
      special_requests,
      payment_method,
      payment_reference,
      payment_status
    } = body;

    // Validate required fields
    if (!customer_name || !customer_phone || !event_space_id || !event_date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!['cash', 'momo', 'card'].includes(payment_method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // For cash payments, booking can proceed without payment reference
    // For momo/card, payment reference must be provided and verified
    if (payment_method !== 'cash' && !payment_reference) {
      return NextResponse.json(
        { error: 'Payment reference required for non-cash payments' },
        { status: 400 }
      );
    }

    // Determine initial status based on payment method
    let bookingStatus = 'pending';
    let finalPaymentStatus = payment_status || 'pending';

    if (payment_method === 'cash') {
      // Cash bookings are approved but payment is pending
      bookingStatus = 'approved';
      finalPaymentStatus = 'pending';
    } else if (payment_reference && payment_status === 'paid') {
      // Paid bookings with momo/card are immediately confirmed
      bookingStatus = 'paid';
      finalPaymentStatus = 'paid';
    }

    // Insert booking into database
    const { data: booking, error: bookingError } = await supabase
      .from('event_bookings')
      .insert({
        user_id: user_id || null,
        customer_name,
        customer_email,
        customer_phone,
        event_space_id,
        event_date,
        start_time,
        end_time,
        guests,
        purpose,
        special_requests,
        payment_method,
        payment_reference: payment_reference || null,
        payment_status: finalPaymentStatus,
        status: bookingStatus
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking', details: bookingError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: payment_method === 'cash' 
        ? 'Booking confirmed! Payment can be made on arrival.' 
        : 'Booking confirmed and payment received!'
    });

  } catch (error) {
    console.error('Unexpected error creating booking:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
