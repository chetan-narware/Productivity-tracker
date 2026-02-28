import { useNavigate } from "react-router-dom";
import {
  getExercises,
  getSessions,
  getPomodoroStats,
} from "../storage/storage";
import type { Exercise } from "../types/exercise";

export default function HomePage() {
  const navigate = useNavigate();

  const exercises: Exercise[] = getExercises();
  const sessions = getSessions();
  const pomodoroStats = getPomodoroStats();

  const today = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter(
    (s) => s.date === today
  ).length;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Speech Timer
          </h1>
          <p className="text-gray-400 mt-2">
            Build consistency. Track your progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <StatCard label="Today's Sessions" value={todaySessions} />
          <StatCard label="Total Sessions" value={sessions.length} />
          <StatCard label="Pomodoros" value={pomodoroStats.total} />
          <StatCard label="Streak" value={`${pomodoroStats.streak} days`} />

        </div>

        {/* Exercises */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Your Exercises
            </h2>

            <button
              onClick={() => navigate("/add")}
              className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-2 rounded-lg font-medium"
            >
              + Add Exercise
            </button>
          </div>

          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex justify-between items-center bg-gray-800 p-5 rounded-xl hover:bg-gray-750 transition"
              >
                <div>
                  <p className="text-lg font-medium">
                    {exercise.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {exercise.cycles} cycles • {exercise.steps.length} steps
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/timer/${exercise.id}`)
                  }
                  className="bg-emerald-600 hover:bg-emerald-500 transition px-4 py-2 rounded-lg"
                >
                  Start
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-md">
      <p className="text-gray-400 text-sm mb-2">
        {label}
      </p>
      <p className="text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}