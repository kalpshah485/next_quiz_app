export type Question = {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: Array<string>;
  mixAnswers: string[];
  selectedAnswer?: string;
  question: {
    text: string;
  };
  tags: Array<string>;
  type: string;
  difficulty: string;
  regions: [];
  isNiche: boolean;
};
