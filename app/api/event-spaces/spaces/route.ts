import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: spaces, error } = await supabase
      .from("event_spaces")
      .select(`
            id,
            name,
            capacity,
            description,
            features,
            image,
            price
        `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching event spaces:', error);
      return NextResponse.json(
        { error: 'Failed to fetch event spaces', details: error.message },
        { status: 500 }
      );
    }

    const transformedSpaces = spaces?.map(space => ({
      id: space.id,
      name: space.name,
      capacity: space.capacity,
      description: space.description,
      features: Array.isArray(space.features) ? space.features : [],
      image: space.image,
      price: space.price,
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedSpaces
    });
  }
  catch (error) {
    console.error('Error fetching event spaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event spaces', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}