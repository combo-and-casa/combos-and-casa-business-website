import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Fetch upcoming events (max 3, ordered by event_date)
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(3);

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
