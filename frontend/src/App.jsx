import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import DeteksiPage from "./pages/DeteksiPage";
import BatchPage from "./pages/BatchPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-panel">
          <Navbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/deteksi" element={<DeteksiPage />} />
              <Route path="/batch" element={<BatchPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
