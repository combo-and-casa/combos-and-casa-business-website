import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// PUT update event space
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update event space
    const { data, error } = await supabase
      .from('event_spaces')
      .update({
        name,
        description,
        capacity,
        price_per_hour,
        features: features || [],
        image_url,
        is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event space:', error);
      return NextResponse.json({ error: 'Failed to update event space' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PUT /api/admin/event-spaces/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE event space
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Delete event space
    const { error } = await supabase
      .from('event_spaces')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event space:', error);
      return NextResponse.json({ error: 'Failed to delete event space' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/event-spaces/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
