import type {
  Exercise,
  SessionRecord,
} from "../types/exercise";
import { defaultExercises } from "../features/exercises/defaultExercises";

/* ================================= */
/* Keys (Namespaced + Versioned)     */
/* ================================= */

const EXERCISE_KEY = "speech_timer_exercises_v1";
const SESSION_KEY = "speech_timer_sessions_v1";
const POMODORO_STATS_KEY = "speech_timer_pomodoro_stats_v1";

/* ================================= */
/* Internal Helpers                  */
/* ================================= */

function read<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ================================= */
/* Exercise API                      */
/* ================================= */

export function getExercises(): Exercise[] {
  return read<Exercise[]>(EXERCISE_KEY) ?? [];
}

export function saveExercises(exercises: Exercise[]) {
  write(EXERCISE_KEY, exercises);
}

export function addExercise(exercise: Exercise) {
  const exercises = getExercises();
  exercises.push(exercise);
  saveExercises(exercises);
}

export function getExerciseById(
  id: string
): Exercise | undefined {
  return getExercises().find((ex) => ex.id === id);
}

/* ================================= */
/* Session API                       */
/* ================================= */

export function getSessions(): SessionRecord[] {
  return read<SessionRecord[]>(SESSION_KEY) ?? [];
}

export function addSession(record: SessionRecord) {
  const sessions = getSessions();
  sessions.push(record);
  write(SESSION_KEY, sessions);

  // If it's a pomodoro → update stats
  if (record.exerciseId.toLowerCase().includes("pomodoro")) {
    updatePomodoroStats();
  }
}

/* ================================= */
/* Pomodoro Stats API                */
/* ================================= */

interface PomodoroStats {
  total: number;
  streak: number;
  lastDate: string | null;
}

export function getPomodoroStats(): PomodoroStats {
  return (
    read<PomodoroStats>(POMODORO_STATS_KEY) ?? {
      total: 0,
      streak: 0,
      lastDate: null,
    }
  );
}

function updatePomodoroStats() {
  const stats = getPomodoroStats();
  const today = new Date().toISOString().split("T")[0];

  stats.total += 1;

  if (stats.lastDate === today) {
    // already counted today
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yDate = yesterday.toISOString().split("T")[0];

    if (stats.lastDate === yDate) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
  }

  stats.lastDate = today;

  write(POMODORO_STATS_KEY, stats);
}

/* ================================= */
/* Initialization                    */
/* ================================= */

export function initializeStorage() {
  const existing = getExercises();
  if (existing.length === 0) {
    saveExercises(defaultExercises);
  }
}