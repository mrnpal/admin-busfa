import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import AlumniPage from "./pages/alumniPage";
import KegiatanPage from "./pages/kegiatanPage";
import Login from "./pages/login";
import VerifyAlumniPage from "./pages/verifikasiAlumni";
import AlumniVerifiedPage from "./pages/alumniVerifiedPage";
import JobPage from "./pages/addJobForm";
import ProtectedRoute from "./services/ProtectedRoute"; // <- tambahkan ini

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman login sebagai root */}
        <Route path="/" element={<Login />} />

        {/* Semua halaman di bawah ini diproteksi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumni"
          element={
            <ProtectedRoute>
              <AlumniPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kegiatan"
          element={
            <ProtectedRoute>
              <KegiatanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verifikasi"
          element={
            <ProtectedRoute>
              <VerifyAlumniPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumniVerified"
          element={
            <ProtectedRoute>
              <AlumniVerifiedPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pekerjaan"
          element={
            <ProtectedRoute>
              <JobPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect semua route tidak dikenal ke login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
