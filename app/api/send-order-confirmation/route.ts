/**
 * Example API Route: Send Order Confirmation Email
 * 
 * This is a reference implementation showing how to integrate email sending
 * after successful database operations.
 * 
 * Key Points:
 * 1. Must use Node runtime (not Edge runtime)
 * 2. Only call email functions after successful DB insert
 * 3. Email failures should NOT roll back database operations
 * 4. Always log email results for debugging
 * 
 * @route POST /api/send-order-confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { sendConfirmationEmails, OrderEmailData } from '@/lib/email';

// CRITICAL: Must use Node runtime for nodemailer
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 1. Get order details from database
    const supabase = await createSupabaseServerClient();
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          menu_item:menu_items (
            name,
            price
          ),
          quantity,
          price
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // 2. Prepare email data
    interface OrderItem {
      menu_item: {
        name: string;
        price: number;
      };
      quantity: number;
      price: number;
    }

    const items = order.order_items.map((item: OrderItem) => ({
      name: item.menu_item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const emailData: OrderEmailData = {
      orderNumber: order.id.toString(),
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      orderType: order.order_type,
      items: items,
      subtotal: order.total_amount,
      total: order.total_amount,
      pickupTime: order.pickup_time,
      deliveryAddress: order.delivery_address,
      deliveryNotes: order.delivery_notes,
      paymentMethod: order.payment_method,
      paymentReference: order.payment_reference,
    };

    // 3. Send emails (failures won't affect order)
    console.log('📧 Sending order confirmation emails...');
    const emailResults = await sendConfirmationEmails('order', emailData);

    // 4. Log results
    if (emailResults.customerEmail.success) {
      console.log('✅ Customer email sent successfully');
    } else {
      console.error('❌ Customer email failed:', emailResults.customerEmail.error);
    }

    if (emailResults.adminEmail.success) {
      console.log('✅ Admin email sent successfully');
    } else {
      console.error('❌ Admin email failed:', emailResults.adminEmail.error);
    }

    // 5. Return success even if emails failed
    return NextResponse.json({
      success: true,
      message: 'Order retrieved',
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
