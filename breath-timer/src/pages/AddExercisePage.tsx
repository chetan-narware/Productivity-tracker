import { useNavigate } from "react-router-dom";

export default function AddExercisePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Add Exercise Page</h1>
      <button onClick={() => navigate("/")}>
        Back Home
      </button>
    </div>
  );
}