'use client';

import { Result } from '@/app/lib/types';
import { archetypeProfiles } from '@/app/lib/scoring';
import { Button } from './ui/button';
import { Share2, Twitter, Linkedin, Mail, RotateCcw } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ResultsProps {
  result: Result;
  onRestart: () => void;
}

export function Results({ result, onRestart }: ResultsProps) {
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
                Top {100 - result.percentile}% of AI users
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
