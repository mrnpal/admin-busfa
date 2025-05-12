import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // ✅ tambahkan ini
import "../login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.data();

      if (!userData || userData.role !== "admin") {
        await signOut(auth);
        setError("Akses ditolak. Anda bukan admin.");
      } else {
        navigate("/dashboard"); // ✅ arahkan ke halaman dashboard
      }

    } catch (err) {
      console.error(err);
      setError("Email atau password salah");
    }
  };

  return (
    
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Login Admin</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
