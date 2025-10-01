'use client';

import { useState, useMemo } from 'react';
import { questions } from '@/app/lib/questions';
import { Question } from '@/app/lib/types';
import { QuestionRenderer } from './QuestionRenderer';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface QuizProps {
  onComplete: (answers: Record<string, any>) => void;
}

export function Quiz({ onComplete }: QuizProps) {
  // Load saved state from localStorage
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai-adoption-answers');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai-adoption-progress');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Filter questions based on skipIf/showIf logic
  const availableQuestions = useMemo(() => {
    return questions.filter(q => {
      if (q.skipIf && q.skipIf(answers)) return false;
      if (q.showIf && !q.showIf(answers)) return false;
      return true;
    });
  }, [answers]);

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / availableQuestions.length) * 100;

  const handleAnswer = (value: any, autoAdvance: boolean = false) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    };
    setAnswers(newAnswers);
    
    // Store in localStorage
    localStorage.setItem('ai-adoption-answers', JSON.stringify(newAnswers));
    localStorage.setItem('ai-adoption-progress', String(currentQuestionIndex));
    
    // Auto-advance for binary/multiple choice
    if (autoAdvance) {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < availableQuestions.length - 1) {
      setCurrentQuestionIndex(prev => {
        const newIndex = prev + 1;
        localStorage.setItem('ai-adoption-progress', String(newIndex));
        return newIndex;
      });
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">AI Adoption Score</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {availableQuestions.length}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={handleAnswer}
            onNext={handleNext}
          />
        </div>

        {/* Back button */}
        {currentQuestionIndex > 0 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
