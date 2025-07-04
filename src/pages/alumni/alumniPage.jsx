import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { 
  FiHome, 
  FiUsers, 
  FiCheckCircle, 
  FiCalendar, 
  FiClipboard, 
  FiBriefcase, 
  FiLogOut,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiUser,
  FiSearch
} from "react-icons/fi";
import "./alumniPage.css";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [newAlumni, setNewAlumni] = useState({
    name: "",
    address: "",
    birthPlaceDate: "",
    fatherName: "",
    motherName: ""
  
  });
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [deletingAlumni, setDeletingAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setIsLoading(true);
    try {
      const alumniSnapshot = await getDocs(collection(db, "alumni"));
     
  
      const alumniData = alumniSnapshot.docs.map(doc => ({
        id: doc.id,
        collectionName: "alumni",
        verified: false,
        ...doc.data()
      }));
  
      
  
      setAlumni([...alumniData]);
      setCurrentPage(1);
    } catch (err) {
      setError("Gagal memuat data alumni. Silakan coba lagi.");
      console.error("Error fetching alumni:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPageData = () => {
    const filteredData = alumni.filter((a) =>
      `${a.name} ${a.email} ${a.job} ${a.graduationYear}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filteredData.slice(startIndex, endIndex),
      totalItems: filteredData.length,
      totalPages: Math.ceil(filteredData.length / itemsPerPage)
    };
  };

  const { data: currentAlumni, totalPages } = getCurrentPageData();

  const handleAddAlumni = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const id = uuidv4();
      await setDoc(doc(db, "alumni", id), {
        ...newAlumni,
        id: id,
      });
      
      setNewAlumni({ name: "", email: "", address: "", phone: "", job: "", graduationYear: "", birthPlaceDate: "", parentName: "" });
      await fetchAlumni();
    } catch (err) {
      setError("Gagal menambahkan alumni.");
      console.error("Error adding alumni:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAlumni = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { id, collectionName, ...data } = editingAlumni;
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        id,
        collectionName
      });
      
      setEditingAlumni(null);
      await fetchAlumni();
    } catch (err) {
      setError("Gagal memperbarui data alumni.");
      console.error("Error updating alumni:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const { id, collectionName } = deletingAlumni;
      if (!id || !collectionName) {
        throw new Error("Data tidak lengkap untuk penghapusan.");
      }
      await deleteDoc(doc(db, collectionName, id));
      setDeletingAlumni(null);
      await fetchAlumni();
    } catch (err) {
      console.error("Gagal menghapus alumni:", err);
      setError("Gagal menghapus alumni.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditingAlumni((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
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
          <h1>Tambah Data Alumni</h1>
          <div className="user-info">
            <span>Admin</span>
            <div className="user-avatar">
              <FiUser size={18} />
            </div>
          </div>
        </header>

        <div className="content-card">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <h2 className="section-title">
            <FiPlus className="title-icon" />
            Tambah Alumni Baru
          </h2>
          
          <form onSubmit={handleAddAlumni} className="form-grid">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Nama alumni"
                value={newAlumni.name}
                onChange={(e) => setNewAlumni({...newAlumni, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Tempat, Tanggal Lahir</label>
              <input
                type="text"
                placeholder="Tempat, Tanggal Lahir"
                value={newAlumni.birthPlaceDate}
                onChange={(e) => setNewAlumni({...newAlumni, birthPlaceDate: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Alamat</label>
              <div className="input-with-icon">
                <FiMapPin className="input-icon" />
                <input
                  type="text"
                  placeholder="Alamat lengkap"
                  value={newAlumni.address}
                  onChange={(e) => setNewAlumni({...newAlumni, address: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Nama Ayah</label>
             
                {/* <FiMail className="input-icon" /> */}
                <input
                  type="text"
                  placeholder="Nama Ayah"
                  value={newAlumni.fatherName}
                  onChange={(e) => setNewAlumni({...newAlumni, fatherName: e.target.value})}   
                />
         
              
            </div>
            <div className="form-group">
             <label>Nama Ibu</label>
                <input
                  type="text"
                  placeholder="Nama Ibu"
                  value={newAlumni.motherName}
                  onChange={(e) => setNewAlumni({...newAlumni, motherName: e.target.value})}   
                />
           
            </div>
              

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FiPlus className="btn-icon" />
                  Tambah Alumni
                </>
              )}
            </button>
          </form>
        </div>

        <div className="content-card">
          <div className="table-controls">
            <div className="search-box">
              <div className="input-with-icon">
                <FiSearch className="input-icon" />
                <input
                  type="text"
                  placeholder="Cari alumni berdasarkan nama, email, pekerjaan..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <span className="search-results">
                {getCurrentPageData().totalItems} alumni ditemukan
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner large"></div>
              <p>Memuat data alumni...</p>
            </div>
          ) : (
            <>
              <div className="responsive-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Tempat, Taggal Lahir</th>
                      <th>Alamat</th>   
                      <th>Nama Ayah</th>
                      <th>Nama Ibu</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAlumni.length > 0 ? (
                      currentAlumni.map((a, index) => (
                        <tr key={`${a.collectionName}-${a.id}`}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                         
                          <td className="alumni-name">{a.name}</td>
                          <td>{a.birthPlaceDate || '-'}</td>
                          <td>{a.address || '-'}</td>
                          
                          <td>{a.fatherName || '-'}</td>
                          <td>{a.motherName || '-'}</td>
                        
                          
                          <td className="action-buttons">
                            <button 
                              className="btn btn-edit"
                              onClick={() => setEditingAlumni(a)}
                            >
                              <FiEdit2 className="btn-icon" />
                              Edit
                            </button>
                            <button 
                              className="btn btn-danger"
                              onClick={() => setDeletingAlumni(a)}
                            >
                              <FiTrash2 className="btn-icon" />
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="empty-table">
                          {searchTerm ? 
                            "Tidak ditemukan alumni yang sesuai dengan pencarian" : 
                            "Tidak ada data alumni yang tersedia"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => goToPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    <FiChevronLeft className="pagination-icon" />
                    Sebelumnya
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => goToPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Selanjutnya
                    <FiChevronRight className="pagination-icon" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Edit Alumni */}
        {editingAlumni && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Edit Data Alumni</h3>
                <button 
                  className="modal-close"
                  onClick={() => setEditingAlumni(null)}
                >
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleUpdateAlumni} className="modal-form">
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    name="name"
                    type="text"
                    value={editingAlumni.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tempat, Tanggal Lahir</label>
                  <input
                    name="birthPlaceDate"
                    type="text"
                    value={editingAlumni.birthPlaceDate}
                    onChange={handleEditChange}
                  />
                </div>

                

                <div className="form-group">
                  <label>Alamat</label>
                  <input
                    name="address"
                    type="text"
                    value={editingAlumni.address}
                    onChange={handleEditChange}
                  />
                </div>

                

                <div className="form-group">
                  <label>Nama Ayah</label>
                  <input
                    name="fatherName"
                    type="text"
                    value={editingAlumni.fatherName}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Nama Ibu</label>
                  <input
                    name="motherName"
                    type="text"
                    value={editingAlumni.motherName}
                    onChange={handleEditChange}
                  />
                </div>

                

                <div className="modal-buttons">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setEditingAlumni(null)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Hapus Alumni */}
        {deletingAlumni && (
          <div className="modal-overlay">
            <div className="modal modal-sm">
              <div className="modal-header">
                <h3>Konfirmasi Hapus</h3>
                <button 
                  className="modal-close"
                  onClick={() => setDeletingAlumni(null)}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="modal-body">
                <p>Anda yakin ingin menghapus alumni <strong>"{deletingAlumni.name}"</strong>?</p>
                <p className="text-muted">Data yang dihapus tidak dapat dikembalikan.</p>
              </div>

              <div className="modal-buttons">
                <button 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setDeletingAlumni(null)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;