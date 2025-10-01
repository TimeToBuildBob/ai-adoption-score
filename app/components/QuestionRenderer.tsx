'use client';

import { Question } from '@/app/lib/types';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any, autoAdvance?: boolean) => void;
  onNext: () => void;
}

export function QuestionRenderer({ question, value, onChange, onNext }: QuestionRendererProps) {
  const autoAdvance = question.type === 'binary' || question.type === 'multiple';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value !== undefined && value !== null && value !== '') {
      onNext();
    }
  };

  const canProceed = value !== undefined && value !== null && value !== '';

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">{question.text}</h2>
        
        {question.type === 'binary' && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={value === true ? 'default' : 'outline'}
              size="lg"
              onClick={() => onChange(true, true)}
              className="h-20 text-lg"
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={value === false ? 'default' : 'outline'}
              size="lg"
              onClick={() => onChange(false, true)}
              className="h-20 text-lg"
            >
              No
            </Button>
          </div>
        )}

        {question.type === 'multiple' && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <Button
                key={option}
                type="button"
                variant={value === option ? 'default' : 'outline'}
                size="lg"
                onClick={() => onChange(option, true)}
                className="w-full h-auto py-4 text-left justify-start whitespace-normal"
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {question.type === 'slider' && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.min || 0}</span>
              <span className="font-semibold text-lg text-gray-900">{value || question.min || 0}</span>
              <span>{question.max || 100}</span>
            </div>
            <input
              type="range"
              min={question.min || 0}
              max={question.max || 100}
              value={value || question.min || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}

        {question.type === 'scale' && (
          <div className="flex justify-between gap-2">
            {Array.from({ length: (question.max || 5) - (question.min || 1) + 1 }, (_, i) => {
              const scaleValue = (question.min || 1) + i;
              return (
                <Button
                  key={scaleValue}
                  type="button"
                  variant={value === scaleValue ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => onChange(scaleValue)}
                  className="flex-1 h-16 text-xl"
                >
                  {scaleValue}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {!autoAdvance && (
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!canProceed}
            className="px-8"
          >
            Continue
          </Button>
        </div>
      )}
    </motion.form>
  );
}
