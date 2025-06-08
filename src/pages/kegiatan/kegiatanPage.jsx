import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase"; 
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
  FiClock,
  FiMapPin,
  FiImage
} from "react-icons/fi";
import "./kegiatanPage.css";

const KegiatanPage = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ 
    title: "", 
    description: "", 
    date: "", 
    time: "", 
    location: "" 
  });
  const [editingActivity, setEditingActivity] = useState(null);
  const [deletingActivity, setDeletingActivity] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, );

  const fetchActivities = async () => {
    try {
      const snapshot = await getDocs(collection(db, "kegiatan"));
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        formattedDate: formatDate(doc.data().date)
      }));
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let imageUrl = "";
  
    try {
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `kegiatan/${imageFile.name}_${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      await addDoc(collection(db, "kegiatan"), {
        ...newActivity,
        imageUrl,
      });
  
      setNewActivity({ title: "", description: "", date: "", time: "", location: "" });
      imageInputRef.current.value = null;
      setImageFile(null);
      await fetchActivities();
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { id, ...data } = editingActivity;
      await updateDoc(doc(db, "kegiatan", id), data);
      setEditingActivity(null);
      await fetchActivities();
    } catch (error) {
      console.error("Error updating activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditingActivity({ ...editingActivity, [e.target.name]: e.target.value });
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "kegiatan", deletingActivity.id));
      setDeletingActivity(null);
      await fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    } finally {
      setIsLoading(false);
    }
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
          <h1>Kelola Kegiatan</h1>
          <div className="user-info">
            <span>Admin</span>
            <div className="user-avatar">
              <FiUsers size={18} />
            </div>
          </div>
        </header>

        <div className="content-card">
          <h2 className="section-title">
            <FiCalendar className="title-icon" />
            Tambah Kegiatan Baru
          </h2>
          
          <form onSubmit={handleAddActivity} className="form-grid">
            <div className="form-group">
              <label>Judul Kegiatan</label>
              <input
                type="text"
                placeholder="Masukkan judul kegiatan"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                placeholder="Masukkan deskripsi kegiatan"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Lokasi</label>
              <div className="input-with-icon">
                <FiMapPin className="input-icon" />
                <input
                  type="text"
                  placeholder="Masukkan lokasi"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tanggal</label>
              <input
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Waktu</label>
              <div className="input-with-icon">
                <FiClock className="input-icon" />
                <input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gambar</label>
              <div className="file-upload">
                <FiImage className="upload-icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  ref={imageInputRef}
                />
                <span>{imageFile ? imageFile.name : "Pilih gambar"}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FiPlus className="btn-icon" />
                  Tambah Kegiatan
                </>
              )}
            </button>
          </form>
        </div>

        <div className="content-card">
          <h2 className="section-title">
            <FiCalendar className="title-icon" />
            Daftar Kegiatan
          </h2>

          {activities.length === 0 ? (
            <div className="empty-state">
              <img 
                src="https://img.freepik.com/free-vector/cancelled-musical-events_23-2148583933.jpg?ga=GA1.1.601080000.1746172783&semt=ais_hybrid&w=740" 
                alt="No activities" 
                className="empty-image"
              />
              <h3>Belum ada kegiatan</h3>
              <p>Tambahkan kegiatan baru untuk ditampilkan di sini</p>
            </div>
          ) : (
            <div className="responsive-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul</th>
                    <th>Tanggal</th>
                    <th>Waktu</th>
                    <th>Lokasi</th>
                    <th>Gambar</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act, index) => (
                    <tr key={act.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="activity-title">{act.title}</div>
                        <div className="activity-description">{act.description}</div>
                      </td>
                      <td>{act.formattedDate}</td>
                      <td>{act.time}</td>
                      <td>{act.location}</td>
                      <td>
                        {act.imageUrl && (
                          <img
                            src={act.imageUrl}
                            alt={act.title}
                            className="activity-image"
                          />
                        )}
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-edit"
                          onClick={() => setEditingActivity(act)}
                        >
                          <FiEdit2 className="btn-icon" />
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => setDeletingActivity(act)}
                        >
                          <FiTrash2 className="btn-icon" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Edit Kegiatan */}
        {editingActivity && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Edit Kegiatan</h3>
                <button 
                  className="modal-close"
                  onClick={() => setEditingActivity(null)}
                >
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleUpdateActivity} className="modal-form">
                <div className="form-group">
                  <label>Judul Kegiatan</label>
                  <input
                    name="title"
                    type="text"
                    value={editingActivity.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="description"
                    value={editingActivity.description}
                    onChange={handleEditChange}
                    required
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Lokasi</label>
                  <input
                    name="location"
                    type="text"
                    value={editingActivity.location}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tanggal</label>
                  <input
                    name="date"
                    type="date"
                    value={editingActivity.date}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Waktu</label>
                  <input
                    name="time"
                    type="time"
                    value={editingActivity.time}
                    onChange={handleEditChange}
                    required
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
                    onClick={() => setEditingActivity(null)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Hapus Kegiatan */}
        {deletingActivity && (
          <div className="modal-overlay">
            <div className="modal modal-sm">
              <div className="modal-header">
                <h3>Konfirmasi Hapus</h3>
                <button 
                  className="modal-close"
                  onClick={() => setDeletingActivity(null)}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="modal-body">
                <p>Anda yakin ingin menghapus kegiatan <strong>"{deletingActivity.title}"</strong>?</p>
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
                  onClick={() => setDeletingActivity(null)}
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

export default KegiatanPage;