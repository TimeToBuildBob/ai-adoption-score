'use client';

import { useState, useEffect } from 'react';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Button } from './components/ui/button';
import { calculateResults } from './lib/scoring';
import { Result, AnswerValue } from './lib/types';
import { Brain, Zap, Users, TrendingUp } from 'lucide-react';

type AppState = 'landing' | 'quiz' | 'results';

export default function Home() {
  const [state, setState] = useState<AppState>('landing');
  const [result, setResult] = useState<Result | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  // Check for saved progress on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('ai-adoption-answers');
      setHasSavedProgress(!!savedAnswers);
    }
  }, []);

  const handleStart = () => {
    setState('quiz');
  };

  const handleComplete = (answers: Record<string, AnswerValue>) => {
    const calculatedResult = calculateResults(answers);
    setResult(calculatedResult);
    setState('results');
    // Clear quiz progress from localStorage
    localStorage.removeItem('ai-adoption-answers');
    localStorage.removeItem('ai-adoption-progress');
  };

  const handleRestart = () => {
    setResult(null);
    setState('landing');
    // Clear saved state
    localStorage.removeItem('ai-adoption-answers');
    localStorage.removeItem('ai-adoption-progress');
  };

  if (state === 'quiz') {
    return <Quiz onComplete={handleComplete} />;
  }

  if (state === 'results' && result) {
    return <Results result={result} onRestart={handleRestart} />;
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
              What&apos;s Your AI Adoption Score?
            </h1>
            <p className="text-2xl text-gray-600">
              Discover how deeply you&apos;ve integrated AI into your life and work
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            {hasSavedProgress ? (
              <>
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="text-xl px-12 py-6 h-auto"
                >
                  Resume Assessment
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleRestart}
                  className="text-xl px-12 py-6 h-auto"
                >
                  Start Over
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={handleStart}
                className="text-xl px-12 py-6 h-auto"
              >
                Start Assessment
              </Button>
            )}
          </div>

          <p className="text-gray-500">5-7 minutes • Free • No signup required</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-20">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Adaptive Questions
            </h3>
            <p className="text-gray-600">
              Questions adapt based on your answers for personalized insights
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Detailed Breakdown
            </h3>
            <p className="text-gray-600">
              See how you score across privacy, autonomy, and sophistication
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compare Yourself
            </h3>
            <p className="text-gray-600">
              Find out how you rank compared to other AI users
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Growth Recommendations
            </h3>
            <p className="text-gray-600">
              Get personalized advice on how to level up your AI game
            </p>
          </div>
        </div>

        {/* Example Results Preview */}
        <div className="max-w-3xl mx-auto mt-20 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Discover Your AI Archetype
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold text-gray-900">AI Native</h3>
              <p className="text-sm text-gray-600 mt-1">Building the future</p>
            </div>
            <div className="text-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900">Power User</h3>
              <p className="text-sm text-gray-600 mt-1">Maximizing productivity</p>
            </div>
            <div className="text-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900">Pragmatic Adopter</h3>
              <p className="text-sm text-gray-600 mt-1">Strategic integration</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button onClick={handleStart}>
              Find Your Archetype
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-gray-600">
          <p>
            Built with ❤️ by the team at{' '}
            <a 
              href="https://gptme.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              gptme.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
