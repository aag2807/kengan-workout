export interface Quote {
  id: string;
  text: string;
  author?: string;
  category: 'motivation' | 'discipline' | 'strength' | 'kengan' | 'victory' | 'training';
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  // KENGAN ASHURA QUOTES
  {
    id: 'k1',
    text: 'The strong eat, the weak are meat.',
    author: 'Kengan Ashura',
    category: 'kengan',
  },
  {
    id: 'k2',
    text: "I'm the King of Stranglers. I don't lose.",
    author: 'Imai Cosmo',
    category: 'kengan',
  },
  {
    id: 'k3',
    text: 'In the arena, only results matter.',
    author: 'Kengan Philosophy',
    category: 'kengan',
  },
  {
    id: 'k4',
    text: 'Every fighter has a zone. Find yours.',
    author: 'Imai Cosmo',
    category: 'kengan',
  },
  {
    id: 'k5',
    text: 'The moment you think you can rest is the moment you lose.',
    author: 'Kengan Fighter',
    category: 'kengan',
  },
  {
    id: 'k6',
    text: 'Strength without technique is meaningless.',
    author: 'Kengan Wisdom',
    category: 'kengan',
  },
  {
    id: 'k7',
    text: 'A true fighter never stops evolving.',
    author: 'Kengan Philosophy',
    category: 'kengan',
  },
  {
    id: 'k8',
    text: "Pain is temporary. Victory is forever.",
    author: 'Kengan Arena',
    category: 'kengan',
  },

  // MOTIVATION
  {
    id: 'm1',
    text: 'The only bad workout is the one that didn\'t happen.',
    category: 'motivation',
  },
  {
    id: 'm2',
    text: 'Your body can stand almost anything. It\'s your mind you have to convince.',
    category: 'motivation',
  },
  {
    id: 'm3',
    text: 'Success starts with self-discipline.',
    category: 'motivation',
  },
  {
    id: 'm4',
    text: 'The pain you feel today will be the strength you feel tomorrow.',
    category: 'motivation',
  },
  {
    id: 'm5',
    text: 'Don\'t count the days. Make the days count.',
    category: 'motivation',
  },
  {
    id: 'm6',
    text: 'Excuses don\'t burn calories.',
    category: 'motivation',
  },
  {
    id: 'm7',
    text: 'The hardest lift is lifting yourself off the couch.',
    category: 'motivation',
  },
  {
    id: 'm8',
    text: 'Results happen over time, not overnight.',
    category: 'motivation',
  },

  // DISCIPLINE
  {
    id: 'd1',
    text: 'Discipline is choosing between what you want now and what you want most.',
    category: 'discipline',
  },
  {
    id: 'd2',
    text: 'Motivation gets you started. Discipline keeps you going.',
    category: 'discipline',
  },
  {
    id: 'd3',
    text: 'The difference between a goal and a dream is a deadline and a plan.',
    category: 'discipline',
  },
  {
    id: 'd4',
    text: 'Train when you don\'t feel like it. That\'s when it matters most.',
    category: 'discipline',
  },
  {
    id: 'd5',
    text: 'Small daily improvements over time lead to stunning results.',
    category: 'discipline',
  },
  {
    id: 'd6',
    text: 'Discipline is the bridge between goals and accomplishment.',
    category: 'discipline',
  },
  {
    id: 'd7',
    text: 'Consistency beats intensity every time.',
    category: 'discipline',
  },

  // STRENGTH
  {
    id: 's1',
    text: 'Strength doesn\'t come from what you can do. It comes from overcoming what you thought you couldn\'t.',
    category: 'strength',
  },
  {
    id: 's2',
    text: 'The iron never lies to you.',
    category: 'strength',
  },
  {
    id: 's3',
    text: 'Strong people are harder to kill and more useful in general.',
    category: 'strength',
  },
  {
    id: 's4',
    text: 'Your muscles don\'t know weight. They know tension.',
    category: 'strength',
  },
  {
    id: 's5',
    text: 'Progressive overload is the key to all progress.',
    category: 'strength',
  },
  {
    id: 's6',
    text: 'Don\'t wish for it to be easier. Wish for you to be stronger.',
    category: 'strength',
  },

  // VICTORY
  {
    id: 'v1',
    text: 'Winners train. Losers complain.',
    category: 'victory',
  },
  {
    id: 'v2',
    text: 'The fight is won or lost far away from witnesses.',
    category: 'victory',
  },
  {
    id: 'v3',
    text: 'Champions aren\'t made in gyms. They\'re made from something deep inside.',
    category: 'victory',
  },
  {
    id: 'v4',
    text: 'Every champion was once a contender who refused to give up.',
    category: 'victory',
  },
  {
    id: 'v5',
    text: 'Winning isn\'t everything, but wanting to win is.',
    category: 'victory',
  },

  // TRAINING
  {
    id: 't1',
    text: 'Train like a beast. Look like a beauty.',
    category: 'training',
  },
  {
    id: 't2',
    text: 'Form over ego. Always.',
    category: 'training',
  },
  {
    id: 't3',
    text: 'Rest days are training days for the mind.',
    category: 'training',
  },
  {
    id: 't4',
    text: 'Nutrition is 80% of your results. Don\'t waste your training.',
    category: 'training',
  },
  {
    id: 't5',
    text: 'Sleep is when your body builds muscle. Don\'t skip it.',
    category: 'training',
  },
  {
    id: 't6',
    text: 'The body achieves what the mind believes.',
    category: 'training',
  },
  {
    id: 't7',
    text: 'Track your progress or you\'re just guessing.',
    category: 'training',
  },
  {
    id: 't8',
    text: 'Warm up properly. Injury prevention is performance enhancement.',
    category: 'training',
  },
];

/**
 * Get a random quote
 */
export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
}

/**
 * Get a random quote from a specific category
 */
export function getQuoteByCategory(category: Quote['category']): Quote {
  const filtered = MOTIVATIONAL_QUOTES.filter(q => q.category === category);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || MOTIVATIONAL_QUOTES[0];
}

/**
 * Get quote for workout completion
 */
export function getWorkoutCompletionQuote(): Quote {
  // Prefer victory and kengan quotes for workout completion
  const preferred = MOTIVATIONAL_QUOTES.filter(
    q => q.category === 'victory' || q.category === 'kengan'
  );
  const randomIndex = Math.floor(Math.random() * preferred.length);
  return preferred[randomIndex];
}

/**
 * Get quote for home screen
 */
export function getHomeScreenQuote(): Quote {
  // Any quote works for home screen
  return getRandomQuote();
}

/**
 * Get quote for PR celebration
 */
export function getPRQuote(): Quote {
  // Prefer strength and victory quotes for PRs
  const preferred = MOTIVATIONAL_QUOTES.filter(
    q => q.category === 'strength' || q.category === 'victory' || q.category === 'kengan'
  );
  const randomIndex = Math.floor(Math.random() * preferred.length);
  return preferred[randomIndex];
}
