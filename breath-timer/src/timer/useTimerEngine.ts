import { useEffect, useRef, useState } from "react";
import type { Exercise } from "../types/exercise";

interface TimerOptions {
  exercise: Exercise;
  onComplete?: () => void;
}

export function useTimerEngine({ exercise, onComplete }: TimerOptions) {
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

  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) return prevTime - 1;

        // When time hits 0, move forward safely
        moveForward();
        return 0;
      });
    }, 1000);

    return () => clearTimer();
  }, [running]);

  function moveForward() {
    setCurrentStepIndex((prevStepIndex) => {
      const isLastStep =
        prevStepIndex === exercise.steps.length - 1;

      if (!isLastStep) {
        const nextStepIndex = prevStepIndex + 1;
        setTimeLeft(exercise.steps[nextStepIndex].duration);
        return nextStepIndex;
      }

      // If last step, check cycle
      setCurrentCycle((prevCycle) => {
        const isLastCycle = prevCycle === exercise.cycles;

        if (!isLastCycle) {
          setTimeLeft(exercise.steps[0].duration);
          return prevCycle + 1;
        }

        // Fully complete
        clearTimer();
        setRunning(false);
        onComplete?.();
        return prevCycle;
      });

      // Reset to first step
      setTimeLeft(exercise.steps[0].duration);
      return 0;
    });
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