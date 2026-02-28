import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddExercisePage from "./pages/AddExercisePage";
import TimerPage from "./pages/TimerPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add" element={<AddExercisePage />} />
      <Route path="/timer/:id" element={<TimerPage />} />
    </Routes>
  );
}

export default App;