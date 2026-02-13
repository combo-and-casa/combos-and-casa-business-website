import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: plans, error } = await supabase
      .from("fitness_plans")
      .select(`
        id,
        name,
        price,
        duration_months,
        is_popular,
        fitness_plan_features (
          id,
          feature
        )
      `)
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) {
      console.error('Error fetching fitness plans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch fitness plans', details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to match the frontend interface
    const transformedPlans = plans?.map(plan => {
      // Convert duration_months to duration string
      let duration = 'month';
      if (plan.duration_months === 3) duration = 'quarter';
      else if (plan.duration_months === 12) duration = 'year';
      else if (plan.duration_months === 1) duration = 'month';

      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        duration,
        is_popular: plan.is_popular || false,
        features: Array.isArray(plan.fitness_plan_features) 
          ? plan.fitness_plan_features.map((f: { feature: string }) => f.feature)
          : []
      };
    }) || [];

    return NextResponse.json({
      success: true,
      data: transformedPlans
    });
  } catch (error) {
    console.error('Unexpected error fetching fitness plans:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
