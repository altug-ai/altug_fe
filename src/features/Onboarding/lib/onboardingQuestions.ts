export const onboardingQuestions = [
  {
    key: 'age',
    text: 'What is your age?',
    type: 'input',
    inputType: 'number',
  },

  {
    key: 'experience',
    text: 'How would you rate your current football skill level?',
    options: ['Beginner', 'Amateur', 'Semi Pro', 'Professional', 'World Class'],
    type: 'options',
  },
  {
    key: 'position',
    text: 'What position do you usually play?',
    options: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
    type: 'options',
  },

  {
    key: 'team_participation',
    text: ' Are you currently part of a football team (school or club)?',
    options: ['Yes', 'No'],
    type: 'options',
  },
  {
    key: 'training_frequency',
    text: 'How often do you train or play football each week?',
    options: [
      'Less than once a week',
      '1-2 times a week',
      '3-4 times a week',
      '5 or more times a week',
    ],
    type: 'options',
  },
  {
    key: 'goals',
    text: 'What are your main goals for using this app? (select all that apply)',
    options: [
      'Improve technical skills',
      'Enhance physical fitness',
      'Learn new tactics',
      'Get advice from professional footballers',
      'Get daily routine advice',
      'Get health and food advice',
    ],
    type: 'multiple-options',
  },
  {
    key: 'favorite_footballers',
    text: 'Who are your favorite professional footballers? (Optional)',
    type: 'multiple-inputs',
  },
  {
    key: 'content_preference',
    text: 'What type of content do you prefer? (pick all that apply)',
    options: [
      'Video tutorials',
      'Chat with professionals',
      'Live sessions',
      'Written guides',
      'Interactive challenges',
    ],
    type: 'multiple-options',
  },
];

export const onBoardKeys = [
  'age',
  'experience',
  'position',
  'team_participation',
  'training_frequency',
  'goals',
  'favorite_footballers',
  'content_preference',
];
