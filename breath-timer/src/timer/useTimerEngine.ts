// issue - timer runs eveb after cycles and steps have ended.
import { useEffect, useRef, useState } from "react";
import type { Exercise } from "../types/exercise";

interface TimerOptions {
  exercise: Exercise;
  onComplete?: () => void;
}

export function useTimerEngine({
  exercise,
  onComplete,
}: TimerOptions) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(
    exercise.steps[0]?.duration ?? 0
  );
  const [running, setRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  function clearTimer() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  /* Reset when exercise changes */
  useEffect(() => {
    clearTimer();
    setRunning(false);
    setCurrentStepIndex(0);
    setCurrentCycle(1);
    setTimeLeft(exercise.steps[0]?.duration ?? 0);
  }, [exercise.id]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        advance();
        return 0;
      });
    }, 1000);

    return () => clearTimer();
  }, [running]);

  function advance() {
    const isLastStep =
      currentStepIndex === exercise.steps.length - 1;

    if (!isLastStep) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      setTimeLeft(exercise.steps[nextStep].duration);
      return;
    }

    const isLastCycle =
      currentCycle === exercise.cycles;

    if (!isLastCycle) {
      setCurrentCycle(currentCycle + 1);
      setCurrentStepIndex(0);
      setTimeLeft(exercise.steps[0].duration);
      return;
    }

    // Fully complete
    clearTimer();
    setRunning(false);
    onComplete?.();
  }

  function start() {
    if (running) return;
    setRunning(true);
  }

  function pause() {
    clearTimer();
    setRunning(false);
  }

  function reset() {
    clearTimer();
    setRunning(false);
    setCurrentStepIndex(0);
    setCurrentCycle(1);
    setTimeLeft(exercise.steps[0]?.duration ?? 0);
  }

  return {
    currentStepIndex,
    currentCycle,
    timeLeft,
    running,
    start,
    pause,
    reset,
  };
}