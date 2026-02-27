/**
 * API Route: Send Membership Activation Email
 * 
 * This API route sends confirmation emails for fitness memberships.
 * Called after successful membership activation in the database.
 * 
 * @route POST /api/send-membership-confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmails, MembershipEmailData } from '@/lib/email';

// CRITICAL: Must use Node runtime for nodemailer
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      membershipId,
      name,
      email,
      phone,
      planName,
      duration,
      price,
      startDate,
      endDate,
      paymentMethod,
      paymentReference
    } = body;

    // Validate required fields
    if (!membershipId || !name || !email || !planName || !duration || !price || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare email data
    const emailData: MembershipEmailData = {
      membershipNumber: membershipId.toString(),
      customerName: name,
      customerEmail: email,
      customerPhone: phone || undefined,
      planName: planName,
      duration: duration,
      price: price,
      startDate: startDate,
      endDate: endDate,
      paymentMethod: paymentMethod || undefined,
      paymentReference: paymentReference || undefined,
    };

    // Send confirmation emails (customer + admin)
    console.log('📧 Sending membership confirmation emails...');
    const emailResults = await sendConfirmationEmails('membership', emailData);

    // Log results
    if (emailResults.customerEmail.success) {
      console.log('✅ Customer membership email sent successfully');       
    } else {
      console.error('❌ Customer membership email failed:', emailResults.customerEmail.error);
    }

    if (emailResults.adminEmail.success) {
      console.log('✅ Admin membership notification sent');
    } else {
      console.error('❌ Admin membership email failed:', emailResults.adminEmail.error);
    }

    // Return status (success even if emails failed)
    return NextResponse.json({
      success: true,
      message: 'Membership confirmation emails processed',
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
