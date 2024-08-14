export type Current = {
  id: number;
  attributes: {
    question: string;
    type: string;
    options?: any;
    answer_type? : string;
  };
};

export type FormIndex =
  | 'age'
  | 'experience'
  | 'position'
  | 'team_participation'
  | 'training_frequency'
  | 'goals'
  | 'favorite_footballers'
  | 'content_preference';
