import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiClipboard,
  FiBriefcase,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiX,
  FiBookOpen,
} from "react-icons/fi";
import "./usersPage.css";

const UsersPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingusers, setDeletingusers] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        graduationYear: doc.data().graduationYear || '-',
      }));
      setAlumni(data);
      setCurrentPage(1);
    } catch (err) {
      setError("Gagal memuat data user. Silakan coba lagi.");
      console.error("Error fetching alumni:", err);
    }
  };

  const filteredAlumni = alumni.filter(alumnus =>
    alumnus.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumnus.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumnus.job?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumnus.graduationYear?.toString().includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlumni = filteredAlumni.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { id, collectionName } = deletingusers;
      if (!id || !collectionName) throw new Error("Data tidak lengkap untuk penghapusan");
      await deleteDoc(doc(db, collectionName, id));
      setDeletingusers(null);
      await fetchAlumni();
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      setError("Gagal menghapus user. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (user) => setSelectedUser(user);

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
          <li><button onClick={() => navigate("/dashboard")} className="menu-item"><FiHome className="menu-icon" /> {!isSidebarCollapsed && <span>Dashboard</span>}</button></li>
          <li><button onClick={() => navigate("/alumni")} className="menu-item"><FiUsers className="menu-icon" /> {!isSidebarCollapsed && <span>Alumni</span>}</button></li>
          <li><button onClick={() => navigate("/users")} className="menu-item"><FiCheckCircle className="menu-icon" /> {!isSidebarCollapsed && <span>Users</span>}</button></li>
          <li><button onClick={() => navigate("/kegiatan")} className="menu-item"><FiCalendar className="menu-icon" /> {!isSidebarCollapsed && <span>Kegiatan</span>}</button></li>
          <li><button onClick={() => navigate("/verifikasi")} className="menu-item"><FiClipboard className="menu-icon" /> {!isSidebarCollapsed && <span>Verifikasi Pengguna</span>}</button></li>
          <li><button onClick={() => navigate("/pekerjaan")} className="menu-item"><FiBriefcase className="menu-icon" /> {!isSidebarCollapsed && <span>Tambah Pekerjaan</span>}</button></li>
          <li><button onClick={() => navigate("/maps")} className="menu-item active"><FiMapPin className="menu-icon" /> {!isSidebarCollapsed && <span>Peta Alumni</span>}</button></li>
        </ul>
        <button className="logout-button menu-item" onClick={() => navigate("/logout")}>
          <FiLogOut className="menu-icon" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Daftar Users</h1>
          <div className="user-info"><span>Admin</span><div className="user-avatar"><FiUsers size={18} /></div></div>
        </header>

        <div className="content-card">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Modal Delete */}
          {deletingusers && (
            <div className="modal-overlay">
              <div className="modal modal-sm">
                <div className="modal-header">
                  <h3>Konfirmasi Hapus</h3>
                  <button className="modal-close" onClick={() => setDeletingusers(null)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <p>Anda yakin ingin menghapus user <strong>"{deletingusers.name}"</strong>?</p>
                  <p className="text-muted">Data yang dihapus tidak dapat dikembalikan.</p>
                </div>
                <div className="modal-buttons">
                  <button className="btn btn-danger" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? <span className="loading-spinner"></span> : "Ya, Hapus"}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setDeletingusers(null)}>Batal</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Detail */}
          {selectedUser && (
            <div className="modal-overlay">
              <div className="modal modal-lg">
                <div className="modal-header">
                  <h3>Detail Pengguna</h3>
                  <button className="modal-close" onClick={() => setSelectedUser(null)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <p><strong>Nama:</strong> {selectedUser.name}</p>
                  <p><strong>Nomor Induk:</strong>{selectedUser.indukNumber || '-'}</p>
                  <p><strong>Email:</strong> {selectedUser.email || '-'}</p>
                  <p><strong>Tempat, Tanggal Lahir:</strong> {selectedUser.birthPlaceDate || '-'}</p>
                  <p><strong>Pendidikan:</strong> {selectedUser.education || '-'}</p>
                  <p><strong>Orang Tua:</strong> {selectedUser.parentName || '-'}</p>
                  <p><strong>Telepon:</strong> {selectedUser.phone || '-'}</p>
                  <p><strong>Pekerjaan:</strong> {selectedUser.job || '-'}</p>
                  <p><strong>Tahun Masuk:</strong> {selectedUser.dateEntry || '-'}</p>
                  <p><strong>Tahun Lulus:</strong> {selectedUser.graduationYear || '-'}</p>
                  <p><strong>Alamat:</strong> {selectedUser.address || '-'}</p>
                </div>
                <div className="modal-buttons">
                  <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Tutup</button>
                </div>
              </div>
            </div>
          )}

          <div className="table-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="search-results">{filteredAlumni.length} user ditemukan</span>
            </div>
          </div>

          <div className="responsive-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIS</th>
                  <th><FiMail className="table-icon" /> Email</th>
                  <th><FiCalendar className="table-icon" /> TTL</th>
                  <th><FiBookOpen className="table-icon" /> Pendidikan</th>
                  <th><FiUsers className="table-icon" /> Orang Tua</th>
                  <th><FiPhone className="table-icon" /> Telepon</th>
                  <th><FiBriefcase className="table-icon" /> Pekerjaan</th>
                  <th><FiCalendar className="table-icon" /> Masuk</th>
                  <th><FiCalendar className="table-icon" /> Lulus</th>
                  <th><FiMapPin className="table-icon" /> Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentAlumni.length > 0 ? (
                  currentAlumni.map((a, index) => (
                    <tr key={a.id} onClick={() => handleRowClick(a)} style={{ cursor: "pointer" }}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="alumni-name">{a.name}</td>
                      <td>{a.indukNumber || '-'}</td>
                      <td>{a.email || '-'}</td>
                      <td>{a.birthPlaceDate || '-'}</td>
                      <td>{a.education || '-'}</td>
                      <td>{a.parentName || '-'}</td>
                      <td>{a.phone || '-'}</td>
                      <td>{a.job || '-'}</td>
                      <td>{a.dateEntry || '-'}</td>
                      <td>{a.graduationYear || '-'}</td>
                      <td className="alamat-col">{a.address || '-'}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingusers({ id: a.id, collectionName: "users", name: a.name });
                          }}
                          disabled={isLoading}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="empty-table">
                      {searchTerm
                        ? "Tidak ditemukan alumni yang sesuai dengan pencarian"
                        : "Tidak ada data alumni yang tersedia"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                <FiChevronLeft className="pagination-icon" /> Sebelumnya
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Selanjutnya <FiChevronRight className="pagination-icon" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
