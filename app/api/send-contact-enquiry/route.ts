/**
 * API Route: Send Contact Enquiry Email
 * 
 * Handles contact form submissions and sends confirmation emails to both
 * the customer and admin with business unit-specific subjects.
 * 
 * @route POST /api/send-contact-enquiry
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmails, EnquiryEmailData } from '@/lib/email';

// CRITICAL: Must use Node runtime for nodemailer
export const runtime = 'nodejs';

// Business unit mapping for email subjects
const BUSINESS_UNITS = {
  restaurant: 'Nankwaase Bar & Restaurant',
  gym: 'Fresh & Fit Fitness Center',
  events: 'Event Spaces',
  general: 'General Enquiry',
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, section, subject, message } = body;

    // Validation
    if (!name || !email || !section || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate section
    if (!['restaurant', 'gym', 'events', 'general'].includes(section)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      );
    }

    // Generate reference number
    const referenceNumber = `ENQ${Date.now().toString().slice(-8)}`;
    
    // Get business unit name
    const businessUnit = BUSINESS_UNITS[section as keyof typeof BUSINESS_UNITS];

    // Get current timestamp
    const submittedAt = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Prepare email data
    const enquiryData: EnquiryEmailData = {
      referenceNumber,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || undefined,
      section: section as 'restaurant' | 'gym' | 'events' | 'general',
      subject,
      message,
      businessUnit,
      submittedAt,
    };

    // Send confirmation emails
    console.log('📧 Sending enquiry emails for:', referenceNumber);
    
    const emailResults = await sendConfirmationEmails('enquiry', enquiryData);

    // Check if at least one email was sent successfully
    const customerEmailSent = emailResults.customerEmail.success;
    const adminEmailSent = emailResults.adminEmail.success;

    if (!customerEmailSent && !adminEmailSent) {
      console.error('❌ Both emails failed to send');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send confirmation emails',
          details: {
            customer: emailResults.customerEmail.error,
            admin: emailResults.adminEmail.error,
          },
        },
        { status: 500 }
      );
    }

    // Log email results
    if (customerEmailSent) {
      console.log('✅ Customer email sent successfully');
    } else {
      console.warn('⚠️ Customer email failed:', emailResults.customerEmail.error);
    }

    if (adminEmailSent) {
      console.log('✅ Admin email sent successfully');
    } else {
      console.warn('⚠️ Admin email failed:', emailResults.adminEmail.error);
    }

    return NextResponse.json({
      success: true,
      referenceNumber,
      message: 'Enquiry submitted successfully',
      emailResults: {
        customerEmail: customerEmailSent,
        adminEmail: adminEmailSent,
      },
    });

  } catch (error) {
    console.error('❌ Contact enquiry API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
