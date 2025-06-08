import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { FiCheck, FiX, FiUser, FiMail, FiHome, FiPhone, FiBriefcase, FiCalendar, FiLogOut, FiMapPin, FiClipboard, FiCheckCircle, FiUsers } from "react-icons/fi";
import "../verifikasiAlumni.css";

const VerifikasiAlumniPage = () => {
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingAlumni();
  }, []);

  const fetchPendingAlumni = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pendingAlumni"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(),
      }));
      setPendingAlumni(data);
    } catch (error) {
      console.error("Error fetching pending alumni:", error);
    }
  };

  const handleVerify = async (alumni) => {
    setLoading(true);
    try {
      const alumniData = {
        ...alumni,
        isVerified: true,
      };

      await Promise.all([
        setDoc(doc(db, "alumniVerified", alumni.id), alumniData),
        deleteDoc(doc(db, "pendingAlumni", alumni.id)),
      ]);
      
      fetchPendingAlumni();
    } catch (error) {
      console.error("Gagal memverifikasi alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (alumniId) => {
    try {
      await deleteDoc(doc(db, "pendingAlumni", alumniId));
      fetchPendingAlumni();
    } catch (error) {
      console.error("Gagal menolak alumni:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
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
                  <button onClick={() => navigate("/alumniVerified")} className="menu-item">
                    <FiCheckCircle className="menu-icon" />
                    {!isSidebarCollapsed && <span>Alumni Terverifikasi</span>}
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
                    {!isSidebarCollapsed && <span>Verifikasi Alumni</span>}
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
          <h1>Verifikasi Alumni</h1>
          <div className="user-info">
            <span>Admin</span>
            <div className="user-avatar">
              <FiUser size={18} />
            </div>
          </div>
        </header>

        <div className="content-card">
          {pendingAlumni.length === 0 ? (
            <div className="empty-state">
              <img 
                src="1.jpg"
                alt="No pending alumni" 
                className="empty-image"
              />
              <h3>Tidak ada pendaftar yang menunggu verifikasi</h3>
              <p>Semua permintaan verifikasi telah diproses</p>
            </div>
          ) : (
            <div className="responsive-table-container">
              <table className="alumni-table">
                <thead>
                  <tr>
                    <th><FiUser className="table-icon" /> Nama</th>
                    <th><FiMail className="table-icon" /> Email</th>
                    <th><FiHome className="table-icon" /> Alamat</th>
                    <th><FiPhone className="table-icon" /> Telepon</th>
                    <th><FiBriefcase className="table-icon" /> Pekerjaan</th>
                    <th><FiCalendar className="table-icon" /> Tahun Lulus</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAlumni.map((alumni) => (
                    <tr key={alumni.id}>
                      <td data-label="Nama">{alumni.name}</td>
                      <td data-label="Email">{alumni.email}</td>
                      <td data-label="Alamat">{alumni.address || '-'}</td>
                      <td data-label="Telepon">{alumni.phone || '-'}</td>
                      <td data-label="Pekerjaan">{alumni.job || '-'}</td>
                      <td data-label="Tahun Lulus">{alumni.graduationYear || '-'}</td>
                      <td data-label="Aksi" className="action-buttons">
                        <button
                          className="btn btn-verify"
                          onClick={() => handleVerify(alumni)}
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="loading-spinner"></span>
                          ) : (
                            <>
                              <FiCheck className="btn-icon" /> Verifikasi
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => handleReject(alumni.id)}
                        >
                          <FiX className="btn-icon" /> Tolak
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifikasiAlumniPage;