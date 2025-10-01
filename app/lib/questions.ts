import { Question } from './types';

export const questions: Question[] = [
  // Initial profiling
  {
    id: 'user_type',
    text: 'Which best describes your relationship with code?',
    type: 'multiple',
    category: 'habits',
    options: [
      'I write code professionally',
      'I code as a hobby or for personal projects',
      'I can read code but rarely write it',
      'Code is alien to me'
    ],
    weight: 0
  },
  
  // Daily Habits
  {
    id: 'search_behavior',
    text: 'When you need information, your first instinct is to:',
    type: 'multiple',
    category: 'habits',
    options: [
      'Ask an AI (ChatGPT, Claude, etc)',
      'Google it (traditional search)',
      'Check documentation/books',
      'Ask a human'
    ],
    weight: 1
  },
  
  {
    id: 'ai_tools_count',
    text: 'How many different AI tools do you actively use?',
    type: 'slider',
    category: 'habits',
    min: 0,
    max: 20,
    weight: 1.5
  },
  
  {
    id: 'daily_ai_time',
    text: 'How many hours per day do you interact with AI?',
    type: 'slider',
    category: 'habits',
    min: 0,
    max: 16,
    weight: 1.2
  },
  
  // Work Integration - Coder specific
  {
    id: 'code_generation',
    text: 'What percentage of your code is AI-generated?',
    type: 'slider',
    category: 'work',
    min: 0,
    max: 100,
    showIf: (answers) => answers.user_type === 'I write code professionally' || answers.user_type === 'I code as a hobby or for personal projects',
    weight: 2
  },
  
  {
    id: 'terminal_ai',
    text: 'Do you have AI integrated into your terminal/CLI?',
    type: 'binary',
    category: 'work',
    showIf: (answers) => answers.user_type === 'I write code professionally' || answers.user_type === 'I code as a hobby or for personal projects',
    weight: 1.5
  },
  
  {
    id: 'ide_copilot',
    text: 'Do you use AI pair programming tools (Copilot, Cursor, etc)?',
    type: 'binary',
    category: 'work',
    showIf: (answers) => answers.user_type === 'I write code professionally' || answers.user_type === 'I code as a hobby or for personal projects',
    weight: 1.3
  },
  
  // Work Integration - General
  {
    id: 'work_email_ai',
    text: 'Do you use AI to help with emails?',
    type: 'multiple',
    category: 'work',
    options: [
      'Yes, it drafts most of my emails',
      'Yes, occasionally for difficult ones',
      'No, but I would if I could',
      'No, I prefer writing my own'
    ],
    weight: 1
  },
  
  {
    id: 'meeting_notes_ai',
    text: 'Do you use AI for meeting notes/transcription?',
    type: 'binary',
    category: 'work',
    weight: 1
  },
  
  // Privacy & Trust
  {
    id: 'email_access',
    text: 'Would you give AI full access to your email history?',
    type: 'multiple',
    category: 'privacy',
    options: [
      'Already have',
      'Yes, I would',
      'Maybe with restrictions',
      'No way'
    ],
    weight: 2
  },
  
  {
    id: 'conversation_recording',
    text: 'Would you let AI record and analyze all your conversations?',
    type: 'multiple',
    category: 'privacy',
    options: [
      'Already doing this',
      'Yes, I would',
      'Only for work calls',
      'Never'
    ],
    weight: 2.5
  },
  
  {
    id: 'private_notes_access',
    text: 'Would you give AI access to your private notes/journal?',
    type: 'multiple',
    category: 'privacy',
    options: [
      'Already have',
      'Yes, it would be helpful',
      'Maybe sanitized versions',
      'No, too personal'
    ],
    weight: 2
  },
  
  {
    id: 'financial_access',
    text: 'Have you given AI access to financial information?',
    type: 'multiple',
    category: 'privacy',
    options: [
      'Yes, including account access',
      'Yes, for analysis only',
      'No, but I would consider it',
      'No, that\'s too risky'
    ],
    weight: 2
  },
  
  // Autonomy
  {
    id: 'unreviewed_decisions',
    text: 'Have you let AI make decisions without reviewing them first?',
    type: 'binary',
    category: 'autonomy',
    weight: 2
  },
  
  {
    id: 'background_agents',
    text: 'Do you have AI agents that work while you sleep?',
    type: 'multiple',
    category: 'autonomy',
    options: [
      'Yes, regularly',
      'I\'ve tried it',
      'I want to but don\'t know how',
      'What\'s an agent?'
    ],
    weight: 2.5
  },
  
  {
    id: 'longest_unsupervised',
    text: 'What\'s the longest you\'ve let AI work completely unsupervised?',
    type: 'multiple',
    category: 'autonomy',
    options: [
      'Days or weeks',
      'Several hours',
      'Under an hour',
      'Never - I always monitor'
    ],
    weight: 2
  },
  
  {
    id: 'autonomous_purchases',
    text: 'Would you let AI make purchases on your behalf?',
    type: 'multiple',
    category: 'autonomy',
    options: [
      'Already do',
      'For small amounts, yes',
      'With approval, maybe',
      'Absolutely not'
    ],
    weight: 2
  },
  
  // Sophistication
  {
    id: 'building_vs_using',
    text: 'Which best describes you?',
    type: 'multiple',
    category: 'sophistication',
    options: [
      'I build AI agents/tools',
      'I customize and chain AI tools',
      'I use AI tools as-is',
      'I\'m just learning'
    ],
    weight: 2
  },
  
  {
    id: 'api_usage',
    text: 'Do you use AI APIs directly (not through UIs)?',
    type: 'binary',
    category: 'sophistication',
    showIf: (answers) => answers.user_type === 'I write code professionally' || answers.user_type === 'I code as a hobby or for personal projects',
    weight: 1.5
  },
  
  {
    id: 'prompt_engineering',
    text: 'How much effort do you put into prompt engineering?',
    type: 'scale',
    category: 'sophistication',
    min: 1,
    max: 5,
    weight: 1
  },
  
  {
    id: 'local_models',
    text: 'Do you run AI models locally on your machine?',
    type: 'binary',
    category: 'sophistication',
    weight: 2
  },
  
  // Emotional
  {
    id: 'emotional_response',
    text: 'How does AI make you feel? (Choose strongest)',
    type: 'multiple',
    category: 'emotional',
    options: [
      'Excited about possibilities',
      'Anxious about job security',
      'Overwhelmed by pace of change',
      'Indifferent',
      'Skeptical of hype'
    ],
    weight: 1
  },
  
  {
    id: 'trust_level',
    text: 'How much do you trust AI outputs?',
    type: 'scale',
    category: 'emotional',
    min: 1,
    max: 5,
    weight: 1.5
  },
  
  // Budget
  {
    id: 'monthly_spend',
    text: 'How much do you spend monthly on AI tools/subscriptions?',
    type: 'multiple',
    category: 'budget',
    options: [
      '$0',
      '$1-20',
      '$21-50',
      '$51-100',
      '$100+'
    ],
    weight: 1.5
  },
  
  // Philosophy
  {
    id: 'future_ear_piece',
    text: 'In 5 years, will you have an AI voice assistant in your ear 24/7?',
    type: 'multiple',
    category: 'philosophy',
    options: [
      'Already do',
      'Definitely',
      'Probably',
      'Maybe',
      'No way'
    ],
    weight: 2
  },
  
  {
    id: 'job_replacement',
    text: 'Will AI replace your job?',
    type: 'multiple',
    category: 'philosophy',
    options: [
      'I\'m using AI to replace it myself',
      'Parts of it, and that\'s good',
      'Parts of it, and that worries me',
      'No, my job is safe',
      'I work in AI, so...'
    ],
    weight: 1.5
  },
  
  {
    id: 'agi_timeline',
    text: 'When do you think we\'ll achieve AGI?',
    type: 'multiple',
    category: 'philosophy',
    options: [
      '1-2 years',
      '3-5 years',
      '5-10 years',
      '10+ years',
      'Never / fundamentally impossible'
    ],
    weight: 1
  },
  
  {
    id: 'building_for_agi',
    text: 'Are you building/preparing for AGI or just using current tools?',
    type: 'multiple',
    category: 'philosophy',
    options: [
      'Building for AGI future',
      'Both building and using',
      'Just using tools pragmatically',
      'Neither really',
      'Avoiding AI when possible'
    ],
    weight: 2
  }
];
