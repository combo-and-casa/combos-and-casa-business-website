import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// PUT update fitness plan
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
    const { name, description, price, duration_months, is_popular, is_active, features } = body;

    // Validate required fields
    if (!name || !description || !price || !duration_months) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update fitness plan
    const { data: planData, error: planError } = await supabase
      .from('fitness_plans')
      .update({
        name,
        description,
        price,
        duration_months,
        is_popular,
        is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (planError) {
      console.error('Error updating fitness plan:', planError);
      return NextResponse.json({ error: 'Failed to update fitness plan' }, { status: 500 });
    }

    // Delete existing features
    await supabase
      .from('fitness_plan_features')
      .delete()
      .eq('fitness_plan_id', id);

    // Insert new features if provided
    if (features && features.length > 0) {
      const featureInserts = features.map((feature: string) => ({
        fitness_plan_id: id,
        feature,
      }));

      const { error: featuresError } = await supabase
        .from('fitness_plan_features')
        .insert(featureInserts);

      if (featuresError) {
        console.error('Error updating features:', featuresError);
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({ success: true, data: planData });
  } catch (error) {
    console.error('Error in PUT /api/admin/fitness-plans/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE fitness plan
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

    // Delete features first (cascade should handle this, but being explicit)
    await supabase
      .from('fitness_plan_features')
      .delete()
      .eq('fitness_plan_id', id);

    // Delete fitness plan
    const { error } = await supabase
      .from('fitness_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting fitness plan:', error);
      return NextResponse.json({ error: 'Failed to delete fitness plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/fitness-plans/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
