import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";


import "../Dashboard.css";

const KegiatanPage = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ title: "", description: "", date: "" });
  const [editingActivity, setEditingActivity] = useState(null);
  const [deletingActivity, setDeletingActivity] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const snapshot = await getDocs(collection(db, "kegiatan"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setActivities(data);
  };
  

  const handleAddActivity = async (e) => {
    e.preventDefault();
    let imageUrl = "";
  
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
  
    setNewActivity({ title: "", description: "", date: "" });
    imageInputRef.current.value = null;
    setImageFile(null);
    fetchActivities();
  };
  

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    const { id, ...data } = editingActivity;
    await updateDoc(doc(db, "kegiatan", id), data);
    setEditingActivity(null);
    fetchActivities();
  };

  const handleEditChange = (e) => {
    setEditingActivity({ ...editingActivity, [e.target.name]: e.target.value });
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "kegiatan", deletingActivity.id));
    setDeletingActivity(null);
    fetchActivities();
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
        <button className="logout-button" onClick={() => navigate("/logout")}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Kelola Kegiatan</h1>

        {/* Form Tambah Kegiatan */}
        <h2 className="section-title">Tambah Kegiatan</h2>
        <form onSubmit={handleAddActivity} className="form-grid">
          <input
            type="text"
            placeholder="Judul Kegiatan"
            value={newActivity.title}
            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Deskripsi"
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            required
          />
          <input
            type="date"
            value={newActivity.date}
            onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            ref={imageInputRef}
          />


          <button type="submit" className="btn btn-add">Tambah</button>
        </form>

        {/* Tabel Daftar Kegiatan */}
        <h2 className="section-title">Daftar Kegiatan</h2>
        <div className="table-responsive">
          <table className="alumni-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Tanggal</th>
                <th>Gambar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act, index) => (
                <tr key={act.id}>
                  <td>{index + 1}</td>
                  <td>{act.title}</td>
                  <td>{act.description}</td>
                  <td>{act.date}</td>
                  <td>
                    {act.imageUrl && (
                      <img
                        src={act.imageUrl}
                        alt={act.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    )}
                  </td>
                  <td>
                    <button className="btn btn-edit" onClick={() => setEditingActivity(act)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => setDeletingActivity(act)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Edit Kegiatan */}
        {editingActivity && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Kegiatan</h2>
              <form onSubmit={handleUpdateActivity} className="modal-form">
                <input
                  name="title"
                  type="text"
                  value={editingActivity.title}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="description"
                  type="text"
                  value={editingActivity.description}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="date"
                  type="date"
                  value={editingActivity.date}
                  onChange={handleEditChange}
                  required
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn btn-add">Simpan</button>
                  <button type="button" className="btn btn-delete" onClick={() => setEditingActivity(null)}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Hapus Kegiatan */}
        {deletingActivity && (
          <div className="modal">
            <div className="modal-content">
              <h3>Hapus Kegiatan?</h3>
              <p><strong>{deletingActivity.title}</strong></p>
              <div className="modal-buttons">
                <button className="btn btn-delete" onClick={confirmDelete}>Ya</button>
                <button className="btn btn-edit" onClick={() => setDeletingActivity(null)}>Tidak</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KegiatanPage;
