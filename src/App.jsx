import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage  from "./pages/LandingPage.jsx";
import LoginPage    from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import UploadPage   from "./pages/UploadPage.jsx";
import ResultPage   from "./pages/ResultPage.jsx";
import ChatPage     from "./pages/ChatPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload"    element={<UploadPage />} />
        <Route path="/result/:projectId" element={<ResultPage />} />
        <Route path="/chat/:token" element={<ChatPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
