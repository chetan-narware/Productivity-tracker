import type { Exercise } from "../../types/exercise";

const now = Date.now();

export const defaultExercises: Exercise[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    cycles: 4,
    createdAt: now,
    steps: [
      { id: "s1", label: "Inhale", duration: 4 },
      { id: "s2", label: "Hold", duration: 4 },
      { id: "s3", label: "Exhale", duration: 4 },
      { id: "s4", label: "Hold", duration: 4 },
    ],
  },
  {
    id: "pomodoro-25",
    name: "Pomodoro 25m",
    cycles: 1,
    createdAt: now,
    steps: [
      { id: "s1", label: "Focus", duration: 1500 },
    ],
  },
];