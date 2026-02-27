import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET all upcoming events
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch upcoming events' },
        { status: 500 }
      );
    }

    return NextResponse.json({ events: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { title, description, event_date, image_url } = body;

    if (!title || !event_date) {
      return NextResponse.json(
        { error: 'Title and event date are required' },
        { status: 400 }
      );
    }

    // Check if there are already 3 upcoming events
    const { data: existingEvents, error: countError } = await supabase
      .from('upcoming_events')
      .select('id')
      .gte('event_date', new Date().toISOString().split('T')[0]);

    if (countError) {
      console.error('Error checking event count:', countError);
      return NextResponse.json(
        { error: 'Failed to check event count' },
        { status: 500 }
      );
    }

    if (existingEvents && existingEvents.length >= 3) {
      return NextResponse.json(
        { error: 'Maximum of 3 upcoming events allowed. Please delete an event first.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('upcoming_events')
      .insert({
        title,
        description,
        event_date,
        image_url,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { id, title, description, event_date, image_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('upcoming_events')
      .update({
        title,
        description,
        event_date,
        image_url,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ event: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('upcoming_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
