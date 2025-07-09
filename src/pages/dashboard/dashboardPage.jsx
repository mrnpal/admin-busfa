import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { FiHome, FiUsers, FiCheckCircle, FiCalendar, FiClipboard, FiBriefcase, FiLogOut, FiMapPin } from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const [alumniCount, setAlumniCount] = useState(0);
  const [kegiatanCount, setKegiatanCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [usersCount, setusersCount] = useState(0);
  const [pekerjaanCount, setPekerjaanCount] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataCounts();
  }, []);

  const fetchDataCounts = async () => {
    try {
      const alumniSnapshot = await getDocs(collection(db, "alumni"));
      const kegiatanSnapshot = await getDocs(collection(db, "kegiatan"));
      const usersSnapshot = await getDocs(collection(db, "users"));
      const pekerjaanSnapshot = await getDocs(collection(db, "jobs"));

      const pendingSnapshot = await getDocs(collection(db, "pendingUsers"));

      setAlumniCount(alumniSnapshot.size);
      setKegiatanCount(kegiatanSnapshot.size);
      setPendingCount(pendingSnapshot.size);
      setPekerjaanCount(pekerjaanSnapshot.size);
      setusersCount(usersSnapshot.size);
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

  const handleCardClick = (route) => {
    navigate(route);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
            <div className="sidebar">
              <div className="sidebar-header">
                <h2>{isSidebarCollapsed ? "AP" : "Admin Panel"}</h2>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                  {isSidebarCollapsed ? "»" : "«"}
                </button>
              </div>
              <ul className="sidebar-menu">
                <li>
                  <button onClick={() => navigate("/dashboard")} className="menu-item">
                    <FiHome className="menu-icon" />
                    {!isSidebarCollapsed && <span>Dashboard</span>}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/alumni")} className="menu-item">
                    <FiUsers className="menu-icon" />
                    {!isSidebarCollapsed && <span>Alumni</span>}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/users")} className="menu-item">
                    <FiCheckCircle className="menu-icon" />
                    {!isSidebarCollapsed && <span>Users</span>}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/kegiatan")} className="menu-item">
                    <FiCalendar className="menu-icon" />
                    {!isSidebarCollapsed && <span>Kegiatan</span>}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/verifikasi")} className="menu-item">
                    <FiClipboard className="menu-icon" />
                    {!isSidebarCollapsed && <span>Verifikasi Pengguna</span>}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/pekerjaan")} className="menu-item">
                    <FiBriefcase className="menu-icon" />
                    {!isSidebarCollapsed && <span>Tambah Pekerjaan</span>}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/maps")} className="menu-item active">
                    <FiMapPin className="menu-icon" />
                    {!isSidebarCollapsed && <span>Peta Alumni</span>}
                  </button>
                </li>
              </ul>
              <button className="logout-button menu-item" onClick={() => navigate("/logout")}>
                <FiLogOut className="menu-icon" />
                {!isSidebarCollapsed && <span>Logout</span>}
              </button>
            </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Admin</span>
            <div className="user-avatar">
              {auth.currentUser?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div 
            className="stat-card primary" 
           
          >
            <h3>Total Alumni</h3>
            <p className="stat-value">{alumniCount + usersCount}</p>
            <div className="stat-icon">
              <FiUsers size={24} />
            </div>
          </div>

          <div 
            className="stat-card secondary" 
            onClick={() => handleCardClick("/alumni")}
          >
            <h3>Alumni</h3>
            <p className="stat-value">{alumniCount}</p>
            <div className="stat-icon">
              <FiUsers size={24} />
            </div>
          </div>
          
          <div 
            className="stat-card success" 
            onClick={() => handleCardClick("/users")}
          >
            <h3>Users</h3>
            <p className="stat-value">{usersCount}</p>
            <div className="stat-icon">
              <FiCheckCircle size={24} />
            </div>
          </div>
         
          <div 
            className="stat-card info" 
            onClick={() => handleCardClick("/kegiatan")}
          >
            <h3>Kegiatan</h3>
            <p className="stat-value">{kegiatanCount}</p>
            <div className="stat-icon">
              <FiCalendar size={24} />
            </div>
          </div>

          <div 
            className="stat-card warning" 
            onClick={() => handleCardClick("/pekerjaan")}
          >
            <h3>Lowongan Kerja</h3>
            <p className="stat-value">{pekerjaanCount}</p>
            <div className="stat-icon">
              <FiBriefcase size={24} />
            </div>
          </div>
          
          <div 
            className="stat-card danger" 
            onClick={() => handleCardClick("/verifikasi")}
          >
            <h3>Alumni Pending</h3>
            <p className="stat-value">{pendingCount}</p>
            <div className="stat-icon">
              <FiClipboard size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Konfirmasi Logout</h3>
            <p>Apakah Anda yakin ingin logout?</p>
            <div className="modal-buttons">
              <button className="btn btn-confirm" onClick={handleLogout}>Ya</button>
              <button className="btn btn-cancel" onClick={() => setShowLogoutModal(false)}>Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;