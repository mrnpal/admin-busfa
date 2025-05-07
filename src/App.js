import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import AlumniPage from "./pages/alumniPage";
import KegiatanPage from "./pages/kegiatanPage";
import Login from "./pages/login"; // Pastikan nama komponen diawali huruf kapital

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman login sebagai root */}
        <Route path="/" element={<Login />} />

        {/* Halaman utama dashboard ringkasan */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Halaman kelola alumni */}
        <Route path="/alumni" element={<AlumniPage />} />

        {/* Halaman kelola kegiatan */}
        <Route path="/kegiatan" element={<KegiatanPage />} />

        {/* Redirect semua rute yang tidak dikenal ke login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
