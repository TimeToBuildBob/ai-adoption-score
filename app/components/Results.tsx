'use client';

import { Result } from '@/app/lib/types';
import { archetypeProfiles } from '@/app/lib/scoring';
import { Button } from './ui/button';
import { Twitter, Linkedin, Mail, RotateCcw, CheckCircle2, Shield } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { createClient } from '@/app/lib/supabase/client';
import { isSupabaseConfigured } from '@/app/lib/supabase/config';
import { useState, useEffect } from 'react';

interface ResultsProps {
  result: Result;
  onRestart: () => void;
}

export function Results({ result, onRestart }: ResultsProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [realPercentile, setRealPercentile] = useState(result.percentile);
  const [stats, setStats] = useState<{
    totalVerified: number;
    averageScore: number;
    archetypeCounts: Record<string, number>;
    scoreDistribution: number[];
  } | null>(null);

  // Submit results and get real percentile
  useEffect(() => {
    async function submitResults() {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        return; // Skip backend submission if Supabase not configured
      }
      
      try {
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            overallScore: result.overallScore,
            percentile: result.percentile,
            archetype: result.archetype,
            categoryScores: result.categoryScores,
            answers: result.answers
          })
        });
        
        const data = await response.json();
        if (data.percentile !== undefined) {
          setRealPercentile(data.percentile);
        }
        setIsVerified(data.isVerified || false);
      } catch (error) {
        console.error('Failed to submit results:', error);
      }
    }
    
    async function fetchStats() {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        return; // Skip stats fetching if Supabase not configured
      }
      
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    
    submitResults();
    fetchStats();
  }, [result]);

  async function handleAuth(provider: 'google' | 'github') {
    if (!isSupabaseConfigured()) {
      console.error('Cannot authenticate: Supabase is not configured');
      return;
    }
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Auth error:', error);
    }
  }
  const profile = archetypeProfiles[result.archetype];
  
  const radarData = result.categoryScores.map(cat => ({
    category: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    score: Math.round(cat.percentage)
  }));

  const shareText = `I scored ${result.overallScore}/100 on the AI Adoption Score! I'm an "${result.archetype}". Find out your AI adoption level:`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=My AI Adoption Score&body=${encodedText} ${shareUrl}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Your AI Adoption Results</h1>
          <p className="text-xl text-gray-600">Discover where you stand in the AI revolution</p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <span className="text-5xl font-bold">{result.overallScore}</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {result.archetype}
              </h2>
              <p className="text-lg text-gray-600">
                {isVerified ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Top {100 - realPercentile}% of verified AI users
                  </span>
                ) : (
                  <span>
                    Top {100 - realPercentile}% of AI users
                    {stats && stats.totalVerified > 0 ? (
                      <span className="text-sm block mt-1">
                        Based on {stats.totalVerified} verified users
                      </span>
                    ) : !isSupabaseConfigured() ? (
                      <span className="text-sm block mt-1 text-gray-500">
                        Estimated percentile (enable backend for real rankings)
                      </span>
                    ) : null}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Archetype Profile */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h3>
          <p className="text-lg text-gray-700 mb-6">{profile.description}</p>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Traits:</h4>
              <ul className="space-y-2">
                {profile.traits.map((trait, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{trait}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        {!isVerified && isSupabaseConfigured() && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Verify Your Results
                </h3>
                <p className="text-gray-700 mb-4">
                  Get a more accurate percentile ranking and help improve the data for everyone! 
                  {stats && stats.totalVerified > 0 && (
                    <span className="block mt-2 text-sm text-gray-600">
                      Join {stats.totalVerified} verified users contributing to better AI adoption insights.
                    </span>
                  )}
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAuth('google')}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    onClick={() => handleAuth('github')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  We only use your account to verify you&apos;re a real person. Your data remains anonymous in our statistics.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdown</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#2563eb" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {result.categoryScores.map(cat => (
                <div key={cat.category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {cat.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(cat.percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Growth Path</h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA for gptme.ai */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Level Up?</h3>
          <p className="text-lg mb-6 opacity-90">
            Build your own AI agents with gptme - the tool for AI natives
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => window.open('https://gptme.ai', '_blank')}
          >
            Explore gptme.ai
          </Button>
        </div>

        {/* Share */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Share Your Results
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-2"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleShare('email')}
              className="flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email
            </Button>
          </div>
        </div>

        {/* Restart */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onRestart}
            className="flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
