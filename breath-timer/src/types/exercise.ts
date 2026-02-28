// Represents a single timed step inside an exercise
export interface Step {
  id: string;
  label: string;
  duration: number; // seconds
}

// Represents a full exercise made of multiple steps
export interface Exercise {
  id: string;
  name: string;
  steps: Step[];
  cycles: number;
  createdAt: number; // timestamp
}

// Represents a completed session record
export interface SessionRecord {
  id: string;
  exerciseId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}