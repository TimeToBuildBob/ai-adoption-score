import { Answer, CategoryScore, Result, Archetype, ArchetypeProfile } from './types';
import { questions } from './questions';

export const archetypeProfiles: Record<Archetype, ArchetypeProfile> = {
  'AI Native': {
    name: 'AI Native',
    description: 'You live and breathe AI. Building agents, running local models, and pushing boundaries.',
    traits: [
      'Builds AI agents and tools',
      'Deep technical understanding',
      'High trust and autonomy',
      'Privacy-aware but pragmatic',
      'Thinks long-term about AGI'
    ],
    growthPath: [
      'Share your knowledge - write about your setup',
      'Contribute to open source AI projects',
      'Mentor others in AI adoption',
      'Experiment with multi-agent systems'
    ]
  },
  'Power User': {
    name: 'Power User',
    description: 'Multiple AI tools, high integration, but not building your own yet.',
    traits: [
      'Uses many AI tools effectively',
      'Strong workflows and automation',
      'Comfortable with deep integration',
      'Still learning the technical side',
      'Excited about possibilities'
    ],
    growthPath: [
      'Learn to use APIs directly',
      'Try building a simple agent',
      'Explore local models',
      'Automate more of your workflow'
    ]
  },
  'Pragmatic Adopter': {
    name: 'Pragmatic Adopter',
    description: 'Selective AI use. You adopt when it clearly adds value, cautious about downsides.',
    traits: [
      'Uses AI strategically',
      'Privacy-conscious',
      'Validates outputs carefully',
      'Skeptical of hype',
      'Balanced perspective'
    ],
    growthPath: [
      'Try one new AI tool this month',
      'Experiment with deeper integration',
      'Test autonomous workflows',
      'Consider where trust makes sense'
    ]
  },
  'AI Curious': {
    name: 'AI Curious',
    description: 'Exploring AI, learning what works. Still finding your comfort level.',
    traits: [
      'Active learner',
      'Testing different tools',
      'Building understanding',
      'Developing workflows',
      'Open to possibilities'
    ],
    growthPath: [
      'Commit to one AI tool for a month',
      'Join AI communities',
      'Learn prompt engineering basics',
      'Document what works for you'
    ]
  },
  'AI Skeptic': {
    name: 'AI Skeptic',
    description: 'Minimal AI use. Concerns about quality, privacy, or job impact limit adoption.',
    traits: [
      'Prefers human judgment',
      'Concerned about privacy/security',
      'Questions AI reliability',
      'Values traditional methods',
      'Watching from sidelines'
    ],
    growthPath: [
      'Try AI for low-stakes tasks',
      'Learn about privacy-preserving options',
      'Understand local models',
      'Connect with thoughtful AI users'
    ]
  }
};

function normalizeAnswer(questionId: string, value: any): number {
  const question = questions.find(q => q.id === questionId);
  if (!question) return 0;

  switch (question.type) {
    case 'binary':
      return value === true || value === 'yes' ? 1 : 0;
    
    case 'slider':
      const max = question.max || 100;
      return value / max;
    
    case 'scale':
      const scaleMax = question.max || 5;
      return (value - 1) / (scaleMax - 1);
    
    case 'multiple':
      // Score based on option index (higher = more advanced/integrated)
      const options = question.options || [];
      const index = options.indexOf(value);
      return index >= 0 ? index / (options.length - 1) : 0;
    
    default:
      return 0;
  }
}

function calculateCategoryScores(answers: Record<string, any>): CategoryScore[] {
  const categories = ['habits', 'work', 'privacy', 'autonomy', 'sophistication', 'emotional', 'budget', 'philosophy'];
  
  return categories.map(category => {
    const categoryQuestions = questions.filter(q => {
      if (q.category !== category) return false;
      if (q.showIf && !q.showIf(answers)) return false;
      if (q.skipIf && q.skipIf(answers)) return false;
      return true;
    });
    
    let totalScore = 0;
    let totalWeight = 0;
    
    categoryQuestions.forEach(q => {
      if (answers[q.id] !== undefined) {
        const normalized = normalizeAnswer(q.id, answers[q.id]);
        totalScore += normalized * q.weight;
        totalWeight += q.weight;
      }
    });
    
    const score = totalWeight > 0 ? totalScore : 0;
    const maxScore = totalWeight;
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    return {
      category,
      score,
      maxScore,
      percentage
    };
  });
}

function determineArchetype(
  overallScore: number,
  categoryScores: CategoryScore[],
  answers: Record<string, any>
): Archetype {
  const sophisticationScore = categoryScores.find(c => c.category === 'sophistication')?.percentage || 0;
  const autonomyScore = categoryScores.find(c => c.category === 'autonomy')?.percentage || 0;
  const privacyScore = categoryScores.find(c => c.category === 'privacy')?.percentage || 0;
  const habitsScore = categoryScores.find(c => c.category === 'habits')?.percentage || 0;
  
  // AI Native: high sophistication + high autonomy + building
  if (sophisticationScore >= 70 && autonomyScore >= 60 && 
      (answers.building_vs_using === 'I build AI agents/tools' || 
       answers.building_vs_using === 'I customize and chain AI tools')) {
    return 'AI Native';
  }
  
  // Power User: high usage + high integration but not building
  if (habitsScore >= 60 && overallScore >= 60 && sophisticationScore < 70) {
    return 'Power User';
  }
  
  // AI Skeptic: low across the board
  if (overallScore < 30) {
    return 'AI Skeptic';
  }
  
  // AI Curious: moderate scores, learning
  if (overallScore < 50 && habitsScore > 30) {
    return 'AI Curious';
  }
  
  // Pragmatic Adopter: moderate to good scores, selective use
  return 'Pragmatic Adopter';
}

function generateRecommendations(
  archetype: Archetype,
  categoryScores: CategoryScore[],
  answers: Record<string, any>
): string[] {
  const recommendations: string[] = [];
  
  // Add archetype-specific recommendations
  recommendations.push(...archetypeProfiles[archetype].growthPath);
  
  // Add category-specific recommendations
  const weakestCategory = categoryScores.reduce((min, cat) => 
    cat.percentage < min.percentage ? cat : min
  );
  
  if (weakestCategory.percentage < 40) {
    switch (weakestCategory.category) {
      case 'autonomy':
        recommendations.push('Try letting AI handle one small task end-to-end');
        break;
      case 'sophistication':
        recommendations.push('Learn basic API usage or try local models');
        break;
      case 'privacy':
        recommendations.push('Explore privacy-preserving AI tools or local options');
        break;
      case 'habits':
        recommendations.push('Integrate AI into one daily workflow');
        break;
    }
  }
  
  return recommendations.slice(0, 5); // Top 5 recommendations
}

export function calculateResults(answers: Record<string, any>): Result {
  const categoryScores = calculateCategoryScores(answers);
  
  // Calculate overall score (weighted average of categories)
  const totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
  const totalMaxScore = categoryScores.reduce((sum, cat) => sum + cat.maxScore, 0);
  const overallScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
  
  // Determine archetype
  const archetype = determineArchetype(overallScore, categoryScores, answers);
  
  // Generate recommendations
  const recommendations = generateRecommendations(archetype, categoryScores, answers);
  
  // Calculate percentile (mock for now - in production, compare to real data)
  const percentile = Math.min(99, Math.max(1, Math.round(overallScore)));
  
  return {
    overallScore: Math.round(overallScore),
    percentile,
    archetype,
    categoryScores,
    answers,
    recommendations
  };
}
