import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboardPage";
import AlumniPage from "./pages/alumni/alumniPage";
import KegiatanPage from "./pages/kegiatan/kegiatanPage";
import Login from "./pages/login/loginPage";
import VerifyAlumniPage from "./pages/verifikasiAlumni/verifikasiAlumni";
import UsersPage from "./pages/users/usersPage";
import JobPage from "./pages/pekerjaan/addJobForm";
import ProtectedRoute from "./services/ProtectedRoute"; 
import MapsPage from "./pages/map/mapsPage";

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
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
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
        <Route
          path="/maps"
          element={
            <ProtectedRoute>
              <MapsPage />
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
