import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// GET all fitness plans
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('fitness_plans')
      .select(`
        *,
        fitness_plan_features (
          id,
          feature
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/admin/fitness-plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create fitness plan
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
    const { name, description, price, duration_months, is_popular, is_active, features } = body;

    // Validate required fields
    if (!name || !description || !price || !duration_months) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert fitness plan
    const { data: planData, error: planError } = await supabase
      .from('fitness_plans')
      .insert({
        name,
        description,
        price,
        duration_months,
        is_popular: is_popular ?? false,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (planError) {
      console.error('Error creating fitness plan:', planError);
      return NextResponse.json({ error: 'Failed to create fitness plan' }, { status: 500 });
    }

    // Insert features if provided
    if (features && features.length > 0) {
      const featureInserts = features.map((feature: string) => ({
        fitness_plan_id: planData.id,
        feature,
      }));

      const { error: featuresError } = await supabase
        .from('fitness_plan_features')
        .insert(featureInserts);

      if (featuresError) {
        console.error('Error creating features:', featuresError);
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({ success: true, data: planData });
  } catch (error) {
    console.error('Error in POST /api/admin/fitness-plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
