/**
 * Email Utility with Nodemailer and Handlebars Templates
 * 
 * This module handles all transactional email sending using SMTP with HBS templates.
 * CRITICAL: This file should ONLY be imported in server-side code (API routes, server actions).
 * Never import this in client components as it contains server-only logic.
 * 
 * @module lib/email
 */

import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// ============================================================================
// SMTP Configuration
// ============================================================================

/**
 * Create and configure SMTP transporter
 * Uses environment variables for secure credential management
 */
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  };

  if (!config.host || !config.auth.user || !config.auth.pass) {
    console.error('❌ SMTP configuration is incomplete. Check your .env.local file.');
    throw new Error('SMTP configuration missing');
  }

  return nodemailer.createTransport(config);
};

// ============================================================================
// Handlebars Template Helpers
// ============================================================================

// Register custom Handlebars helpers
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('formatDate', function(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
});

/**
 * Load and compile a Handlebars template
 */
function loadTemplate(templateName: string): HandlebarsTemplateDelegate {
  const templatePath = path.join(process.cwd(), 'lib', 'email-templates', `${templateName}.hbs`);
  
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(templateContent);
  } catch (error) {
    console.error(`❌ Failed to load template: ${templateName}`, error);
    throw new Error(`Template ${templateName} not found`);
  }
}

// ============================================================================
// Email Sending Function
// ============================================================================

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/**
 * Send email using configured SMTP transporter
 */
export async function sendEmail(options: EmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error: string;
}> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Combos & Casa',
        address: process.env.SMTP_FROM || process.env.SMTP_USER || '',
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
      ...(options.cc && { cc: options.cc }),
      ...(options.bcc && { bcc: options.bcc }),
    };

    console.log('📧 Sending email to:', options.to);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      error: '',
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Email Data Interfaces
// ============================================================================

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@combosandcasagh.com';

// Restaurant Order Email Data
export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'pickup' | 'delivery';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  total: number;
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryNotes?: string;
  paymentMethod: string;
  paymentReference?: string;
}

// Restaurant Reservation Email Data
export interface ReservationEmailData {
  reservationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

// Event Booking Email Data
export interface EventBookingEmailData {
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  specialRequests?: string;
}

// Fitness Membership Email Data
export interface MembershipEmailData {
  membershipNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planName: string;
  duration: string;
  price: number;
  startDate: string;
  endDate: string;
  paymentMethod?: string;
  paymentReference?: string;
}

// Contact Enquiry Email Data
export interface EnquiryEmailData {
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  section: 'restaurant' | 'gym' | 'events' | 'general';
  subject: string;
  message: string;
  businessUnit: string;
  submittedAt: string;
}

// ============================================================================
// Email Template Generators
// ============================================================================

/**
 * Generate customer order confirmation email
 */
export function generateCustomerOrderEmail(data: OrderEmailData): string {
  const template = loadTemplate('customer-order');
  return template(data);
}

/**
 * Generate admin order notification email
 */
export function generateAdminOrderEmail(data: OrderEmailData): string {
  const template = loadTemplate('admin-order');
  return template(data);
}

/**
 * Generate customer reservation confirmation email
 */
export function generateCustomerReservationEmail(data: ReservationEmailData): string {
  const template = loadTemplate('customer-reservation');
  return template(data);
}

/**
 * Generate admin reservation notification email
 */
export function generateAdminReservationEmail(data: ReservationEmailData): string {
  const template = loadTemplate('admin-reservation');
  return template(data);
}

/**
 * Generate customer event booking confirmation email
 */
export function generateCustomerEventBookingEmail(data: EventBookingEmailData): string {
  const template = loadTemplate('customer-event');
  return template(data);
}

/**
 * Generate admin event booking notification email
 */
export function generateAdminEventBookingEmail(data: EventBookingEmailData): string {
  const template = loadTemplate('admin-event');
  return template(data);
}

/**
 * Generate customer membership activation email
 */
export function generateCustomerMembershipEmail(data: MembershipEmailData): string {
  const template = loadTemplate('customer-membership');
  return template(data);
}

/**
 * Generate admin membership notification email
 */
export function generateAdminMembershipEmail(data: MembershipEmailData): string {
  const template = loadTemplate('admin-membership');
  return template(data);
}

/**
 * Generate customer enquiry confirmation email
 */
export function generateCustomerEnquiryEmail(data: EnquiryEmailData): string {
  const template = loadTemplate('customer-enquiry');
  return template(data);
}

/**
 * Generate admin enquiry notification email
 */
export function generateAdminEnquiryEmail(data: EnquiryEmailData): string {
  const template = loadTemplate('admin-enquiry');
  return template(data);
}

// ============================================================================
// Helper Function: Send Both Customer and Admin Emails
// ============================================================================

/**
 * Send confirmation email to customer and notification to admin
 */
export async function sendConfirmationEmails(
  type: 'order' | 'reservation' | 'event' | 'membership' | 'enquiry',
  data: OrderEmailData | ReservationEmailData | EventBookingEmailData | MembershipEmailData | EnquiryEmailData
): Promise<{
  customerEmail: { success: boolean; error: string };
  adminEmail: { success: boolean; error: string };
}> {
  const results = {
    customerEmail: { success: false, error: '' },
    adminEmail: { success: false, error: '' },
  };

  try {
    let customerHtml = '';
    let adminHtml = '';
    let subject = '';

    switch (type) {
      case 'order':
        const orderData = data as OrderEmailData;
        customerHtml = generateCustomerOrderEmail(orderData);
        adminHtml = generateAdminOrderEmail(orderData);
        subject = `Order Confirmation #${orderData.orderNumber}`;
        break;
      
      case 'reservation':
        const reservationData = data as ReservationEmailData;
        customerHtml = generateCustomerReservationEmail(reservationData);
        adminHtml = generateAdminReservationEmail(reservationData);
        subject = `Reservation Confirmed #${reservationData.reservationNumber}`;
        break;
      
      case 'event':
        const eventData = data as EventBookingEmailData;
        customerHtml = generateCustomerEventBookingEmail(eventData);
        adminHtml = generateAdminEventBookingEmail(eventData);
        subject = `Event Booking Confirmed #${eventData.bookingNumber}`;
        break;
      
      case 'membership':
        const membershipData = data as MembershipEmailData;
        customerHtml = generateCustomerMembershipEmail(membershipData);
        adminHtml = generateAdminMembershipEmail(membershipData);
        subject = `Membership Activated #${membershipData.membershipNumber}`;
        break;
      
      case 'enquiry':
        const enquiryData = data as EnquiryEmailData;
        customerHtml = generateCustomerEnquiryEmail(enquiryData);
        adminHtml = generateAdminEnquiryEmail(enquiryData);
        subject = `${enquiryData.businessUnit} - ${enquiryData.subject}`;
        break;
    }

    // Send customer email
    const customerResult = await sendEmail({
      to: data.customerEmail,
      subject: subject,
      html: customerHtml,
    });
    results.customerEmail = customerResult;

    // Send admin email
    const adminResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `[ADMIN] ${subject}`,
      html: adminHtml,
    });
    results.adminEmail = adminResult;

  } catch (error) {
    console.error('Error in sendConfirmationEmails:', error);
    results.customerEmail.error = error instanceof Error ? error.message : 'Unknown error';
    results.adminEmail.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return results;
}
