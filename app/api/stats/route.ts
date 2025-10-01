import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Get verified results statistics
    const { data: results, error } = await supabase
      .from('results')
      .select('overall_score, archetype')
      .eq('is_verified', true);
    
    if (error) {
      console.error('Error fetching stats:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Calculate statistics
    const totalVerified = results?.length || 0;
    const averageScore = totalVerified > 0
      ? Math.round(results.reduce((sum, r) => sum + r.overall_score, 0) / totalVerified)
      : 0;
    
    // Count by archetype
    const archetypeCounts = results?.reduce((acc, r) => {
      acc[r.archetype] = (acc[r.archetype] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Score distribution (for percentile calculation)
    const scoreDistribution = results?.map(r => r.overall_score).sort((a, b) => a - b) || [];
    
    return NextResponse.json({
      totalVerified,
      averageScore,
      archetypeCounts,
      scoreDistribution
    });
    
  } catch (error) {
    console.error('Error in GET /api/stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
