import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { overallScore, percentile, archetype, categoryScores, answers } = body;
    
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Insert result
    const { data, error } = await supabase
      .from('results')
      .insert({
        user_id: user?.id || null,
        overall_score: overallScore,
        percentile: percentile,
        archetype: archetype,
        category_scores: categoryScores,
        answers: answers,
        is_verified: !!user // Mark as verified if user is authenticated
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting result:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Calculate real percentile from verified results
    const { data: percentileData, error: percentileError } = await supabase
      .rpc('calculate_percentile', { score: overallScore });
    
    if (percentileError) {
      console.error('Error calculating percentile:', percentileError);
    }
    
    return NextResponse.json({
      id: data.id,
      percentile: percentileData || percentile,
      isVerified: !!user
    });
    
  } catch (error) {
    console.error('Error in POST /api/results:', error);
    return NextResponse.json(
      { error: 'Failed to submit results' },
      { status: 500 }
    );
  }
}
