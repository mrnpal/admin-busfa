import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../Dashboard.css";

const Dashboard = () => {
  const [alumniCount, setAlumniCount] = useState(0);
  const [kegiatanCount, setKegiatanCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [alumniVerifiedCount, setAlumniVerifiedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataCounts();
  }, []);

  const fetchDataCounts = async () => {
    try {
      const alumniSnapshot = await getDocs(collection(db, "alumni"));
      const kegiatanSnapshot = await getDocs(collection(db, "kegiatan"));
      const alumniVerifiedSnapshot = await getDocs(collection(db, "alumniVerified"));

      const pendingQuery = query(
        collection(db, "pendingAlumni"),
        where("isVerified", "==", false)
      );
      const pendingSnapshot = await getDocs(pendingQuery);

      setAlumniCount(alumniSnapshot.size);
      setKegiatanCount(kegiatanSnapshot.size);
      setPendingCount(pendingSnapshot.size);
      setAlumniVerifiedCount(alumniVerifiedSnapshot.size);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirmLogout) return;
  
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fungsi untuk menangani klik card
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2>Admin Panel</h2>
          <ul>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/alumni")}>Alumni</button>
            <button onClick={() => navigate("/kegiatan")}>Kegiatan</button>
            <button onClick={() => navigate("/verifikasi")}>Verifikasi Alumni</button>
            <button onClick={() => navigate("/alumniVerified")}>Alumni Terverifikasi</button>
          </ul>
        </div>
        <button className="logout-button" onClick={() => setShowLogoutModal(true)}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>DASHBOARD</h1>
        <div className="cards">
          
          <div 
            className="card clickable-card" 
            onClick={() => handleCardClick("/alumni")}
          >
            <h3>TOTAL ALUMNI</h3>
            <p>{alumniCount + alumniVerifiedCount}</p>
          </div>

          <div 
            className="card clickable-card" 
            onClick={() => handleCardClick("/alumni")}
          >
            <h3>ALUMNI</h3>
            <p>{alumniCount}</p>
          </div>
          
          <div 
            className="card clickable-card" 
            onClick={() => handleCardClick("/alumniVerified")}
          >
            <h3>ALUMNI TERVERIFIKASI</h3>
            <p>{alumniVerifiedCount}</p>
          </div>
         
          <div 
            className="card clickable-card" 
            onClick={() => handleCardClick("/kegiatan")}
          >
            <h3>KEGIATAN</h3>
            <p>{kegiatanCount}</p>
          </div>
          
         
          
          
          <div 
            className="card clickable-card" 
            onClick={() => handleCardClick("/verifikasi")}
          >
            <h3>ALUMNI PENDING</h3>
            <p>{pendingCount}</p>
          </div>
        </div>
      </div>
      
      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Apakah Anda yakin ingin logout?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={handleLogout}>Ya</button>
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;