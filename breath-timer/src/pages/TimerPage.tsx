import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getExerciseById, addSession } from "../storage/storage";
import { useTimerEngine } from "../timer/useTimerEngine";
import type { Exercise } from "../types/exercise";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function TimerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const exercise: Exercise | undefined = id
    ? getExerciseById(id)
    : undefined;

  useEffect(() => {
    alarmRef.current = new Audio("/sounds/alarm.wav");
  }, []);

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800 text-center">
          <h2 className="text-xl font-semibold mb-4">
            Exercise not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg"
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  const isPomodoro = exercise.id.includes("pomodoro");

  const {
    currentStepIndex,
    currentCycle,
    timeLeft,
    running,
    start,
    pause,
    reset,
  } = useTimerEngine({
    exercise,
    onComplete: () => {
      // Save session
      addSession({
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        date: new Date().toISOString().split("T")[0],
        completed: true,
      });

      // Play alarm only for Pomodoro
      if (isPomodoro) {
        alarmRef.current?.play();
      }

      navigate("/");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 px-6">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 w-full max-w-md text-center shadow-2xl">

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">
          {exercise.name}
        </h2>

        {/* Current Step */}
        <p className="text-gray-400 mb-2">
          {exercise.steps[currentStepIndex].label}
        </p>

        {/* Timer */}
        <div className="text-6xl font-bold mb-6 tracking-wide">
          {formatTime(timeLeft)}
        </div>

        {/* Cycle Info */}
        <p className="text-gray-500 mb-8">
          Cycle {currentCycle} / {exercise.cycles}
        </p>

        {/* Controls */}
        <div className="flex justify-center gap-4">

          <button
            onClick={start}
            disabled={running}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              running
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            Start
          </button>

          <button
            onClick={pause}
            className="bg-yellow-600 hover:bg-yellow-500 px-5 py-2 rounded-lg transition"
          >
            Pause
          </button>

          <button
            onClick={reset}
            className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg transition"
          >
            Reset
          </button>

        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-200 transition"
          >
            ← Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}