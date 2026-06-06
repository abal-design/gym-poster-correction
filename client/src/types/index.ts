export type UserRole = 'user' | 'admin';

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  favoriteExercises?: Exercise[] | string[];
};

export type AuthResponse = {
  status: string;
  token: string;
  user: User;
};

export type PostureStep = {
  stepNumber: number;
  instruction: string;
};

export type Exercise = {
  _id: string;
  name: string;
  category: 'upper body' | 'lower body';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
  equipment: string[];
  description: string;
  postureSteps: PostureStep[];
  tips: string[];
  commonMistakes: string[];
  imageUrl?: string;
  durationMinutes: number;
};

export type ProgressEntry = {
  _id: string;
  exercise: Pick<Exercise, '_id' | 'name' | 'category' | 'difficulty'>;
  completedAt: string;
  notes: string;
  durationMinutes: number;
};

export type ProgressSummary = {
  totalCompleted: number;
  totalMinutes: number;
  categorySummary: {
    'upper body': number;
    'lower body': number;
    [key: string]: number;
  };
};
