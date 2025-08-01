import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiLogIn } from "react-icons/fi";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "admins", uid));
      const userData = userDoc.data();

      if (!userData || userData.role !== "admin") {
        await signOut(auth);
        setError("Akses ditolak. Hanya admin yang dapat login.");
      } else {
        // Simpan informasi login ke localStorage
        localStorage.setItem("uid", uid);
        localStorage.setItem("role", userData.role);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
          ? "Email atau password salah"
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <h1>Alumni Tracking System</h1>
            <p>Sistem Manajemen Alumni</p>
          </div>
          <div className="login-illustration">
            <img 
              src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?ga=GA1.1.601080000.1746172783&semt=ais_hybrid&w=740" 
              alt="Login Illustration" 
            />
          </div>
        </div>
        
        <div className="login-right">
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-header">
              <h2>Masuk sebagai Admin</h2>
              <p>Silakan masuk dengan akun admin Anda</p>
            </div>

            {error && (
              <div className="login-error">
                <p>{error}</p>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-field">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-field">
                <FiLock className="input-icon" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FiLogIn className="button-icon" />
                  <span>Masuk</span>
                </>
              )}
            </button>

            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;