import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ExamIntroPage } from "./pages/ExamIntroPage";
import { ExamPage } from "./pages/ExamPage";
import { HomePage } from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  return (
    <BrowserRouter basename={basename || undefined}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intro/:setId/:mode" element={<ExamIntroPage />} />
        <Route path="/exam/:setId/:mode" element={<ExamPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
