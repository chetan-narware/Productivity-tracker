import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addExercise,
  getExerciseById,
  getExercises,
  saveExercises,
} from "../storage/storage";
import type { Step } from "../types/exercise";

export default function AddExercisePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const existingExercise = id
    ? getExerciseById(id)
    : undefined;

  const [name, setName] = useState(
    existingExercise?.name || ""
  );
  const [cycles, setCycles] = useState(
    existingExercise?.cycles || 1
  );
  const [steps, setSteps] = useState<Step[]>(
    existingExercise?.steps || [
      { id: crypto.randomUUID(), label: "", duration: 0 },
    ]
  );
  const [error, setError] = useState("");

  function addStep() {
    setSteps([
      ...steps,
      { id: crypto.randomUUID(), label: "", duration: 0 },
    ]);
  }

  function updateStep(
    id: string,
    field: keyof Step,
    value: string | number
  ) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  }

  function removeStep(id: string) {
    setSteps((prev) =>
      prev.filter((step) => step.id !== id)
    );
  }

  function validate() {
    if (!name.trim())
      return "Exercise name is required.";
    if (cycles <= 0)
      return "Cycles must be greater than 0.";
    if (steps.length === 0)
      return "At least one step is required.";

    for (const step of steps) {
      if (!step.label.trim())
        return "All steps must have a label.";
      if (step.duration <= 0)
        return "Step duration must be greater than 0.";
    }

    return "";
  }

  function handleSave() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const exercises = getExercises();

    if (existingExercise) {
      const updated = exercises.map((ex) =>
        ex.id === existingExercise.id
          ? { ...ex, name, cycles, steps }
          : ex
      );
      saveExercises(updated);
    } else {
      addExercise({
        id: crypto.randomUUID(),
        name,
        cycles,
        steps,
        createdAt: Date.now(),
      });
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl">

        <h2 className="text-2xl font-semibold mb-6">
          {existingExercise ? "Edit Exercise" : "Add Custom Exercise"}
        </h2>

        {error && (
          <div className="mb-4 text-red-400">
            {error}
          </div>
        )}

        <input
          placeholder="Exercise Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-4"
        />

        <input
          type="number"
          value={cycles}
          onChange={(e) =>
            setCycles(Number(e.target.value))
          }
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-6"
        />

        {steps.map((step) => (
          <div key={step.id} className="flex gap-3 mb-3">
            <input
              placeholder="Label"
              value={step.label}
              onChange={(e) =>
                updateStep(step.id, "label", e.target.value)
              }
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            />

            <input
              type="number"
              placeholder="Duration"
              value={step.duration}
              onChange={(e) =>
                updateStep(
                  step.id,
                  "duration",
                  Number(e.target.value)
                )
              }
              className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            />

            {steps.length > 1 && (
              <button
                onClick={() => removeStep(step.id)}
                className="bg-red-600 px-3 rounded-lg"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addStep}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg mt-3"
        >
          + Add Step
        </button>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}