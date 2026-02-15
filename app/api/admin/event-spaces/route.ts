import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// GET all event spaces
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('event_spaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/admin/event-spaces:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create event space
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Check admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !isAdminData) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, capacity, price_per_hour, features, image_url, is_active } = body;

    // Validate required fields
    if (!name || !description || !capacity || !price_per_hour) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert event space
    const { data, error } = await supabase
      .from('event_spaces')
      .insert({
        name,
        description,
        capacity,
        price_per_hour,
        features: features || [],
        image_url,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event space:', error);
      return NextResponse.json({ error: 'Failed to create event space' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/event-spaces:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
