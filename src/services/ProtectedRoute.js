import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");

  // Jika belum login atau bukan admin, redirect ke login
  if (!uid || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;