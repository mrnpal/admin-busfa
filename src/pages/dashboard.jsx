import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();

    const [alumni, setAlumni] = useState([]);
    const [activities, setActivities] = useState([]);
    const [newAlumni, setNewAlumni] = useState({
      name: "",
      email: "",
      address: "",
      phone: "",
      job: "",
      graduationYear: "",
    });
  
    const [newActivity, setNewActivity] = useState({
      title: "",
      description: "",
      date: "",
      image: null,
    });
  
    const [editingAlumni, setEditingAlumni] = useState(null);
    const [deletingAlumni, setDeletingAlumni] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [deletingActivity, setDeletingActivity] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);
  
    useEffect(() => {
      fetchAlumni();
      fetchActivities();
    }, []);
  
    const fetchAlumni = async () => {
      const snapshot = await getDocs(collection(db, "alumni"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlumni(data);
    };
  
    const fetchActivities = async () => {
      const snapshot = await getDocs(collection(db, "kegiatan"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setActivities(data);
    };
  
    const handleDeleteActivityClick = (activity) => {
      setDeletingActivity(activity);
    };
  
    const confirmDeleteActivity = async () => {
      await deleteDoc(doc(db, "kegiatan", deletingActivity.id));
      setDeletingActivity(null);
      fetchActivities();
    };
  
    const handleEditActivityClick = (activity) => {
      setEditingActivity(activity);
    };
  
    const handleEditActivityChange = (e) => {
      setEditingActivity({ ...editingActivity, [e.target.name]: e.target.value });
    };
  
    const handleUpdateActivity = async (e) => {
      e.preventDefault();
      const { id, title, description, date } = editingActivity;
      await updateDoc(doc(db, "kegiatan", id), { title, description, date });
      setEditingActivity(null);
      fetchActivities();
    };
  
    const handleAddAlumni = async (e) => {
      e.preventDefault();
      await addDoc(collection(db, "alumni"), newAlumni);
      setNewAlumni({ name: "", email: "", address: "", job: "", phone: "", graduationYear: "" });
      fetchAlumni();
    };
  
    const handleAddActivity = async (e) => {
      e.preventDefault();
      const storage = getStorage();
      let imageUrl = "";
  
      if (newActivity.image) {
        const imageRef = ref(storage, `kegiatan/${newActivity.image.name}-${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, newActivity.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
  
      await addDoc(collection(db, "kegiatan"), {
        title: newActivity.title,
        description: newActivity.description,
        date: newActivity.date,
        imageUrl,
      });
  
      setNewActivity({ title: "", description: "", date: "", image: null });
      fetchActivities();
    };
  
    const handleEditClick = (alumnus) => setEditingAlumni(alumnus);
    const handleEditChange = (e) => setEditingAlumni({ ...editingAlumni, [e.target.name]: e.target.value });
  
    const handleUpdateAlumni = async (e) => {
      e.preventDefault();
      const { id, ...data } = editingAlumni;
      await updateDoc(doc(db, "alumni", id), data);
      setEditingAlumni(null);
      fetchAlumni();
    };
  
    const handleDeleteClick = (alumnus) => setDeletingAlumni(alumnus);
  
    const confirmDelete = async () => {
      await deleteDoc(doc(db, "alumni", deletingAlumni.id));
      setDeletingAlumni(null);
      fetchAlumni();
    };
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Gagal logout:", error);
      }
    };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="btn btn-logout" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
      </div>

      <h1 className="dashboard-title">Dashboard Admin Alumni</h1>

      {/* ✅ Form Tambah Alumni */}
      <form onSubmit={handleAddAlumni} className="form-grid">
        <input type="text" placeholder="Nama Alumni" value={newAlumni.name} onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={newAlumni.email} onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })} required />
        <input type="text" placeholder="Alamat" value={newAlumni.address} onChange={(e) => setNewAlumni({ ...newAlumni, address: e.target.value })} required />
        <input type="text" placeholder="Nomor Telepon" value={newAlumni.phone} onChange={(e) => setNewAlumni({ ...newAlumni, phone: e.target.value })} required />
        <input type="text" placeholder="Pekerjaan" value={newAlumni.job} onChange={(e) => setNewAlumni({ ...newAlumni, job: e.target.value })} required />
        <input type="number" placeholder="Tahun Lulus" value={newAlumni.graduationYear} onChange={(e) => setNewAlumni({ ...newAlumni, graduationYear: e.target.value })} required />
        <button type="submit" className="btn btn-add">Tambah Alumni</button>
      </form>

      {/* ✅ Form Tambah Kegiatan */}
      <form onSubmit={handleAddActivity} className="form-grid">
        <input type="text" placeholder="Judul Kegiatan" value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} required />
        <textarea placeholder="Deskripsi" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} required />
        <input type="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} required />
        <input type="file" accept="image/*" onChange={(e) => setNewActivity({ ...newActivity, image: e.target.files[0] })} />
        <button type="submit" className="btn btn-add">Tambah Kegiatan</button>
      </form>

      {/* 📋 Tabel Kegiatan */}
      <h2 className="section-title">Daftar Kegiatan</h2>
      <table className="alumni-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Judul</th>
            <th>Deskripsi</th>
            <th>Tanggal</th>
            <th>Foto</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={activity.id}>
              <td>{index + 1}</td>
              <td>{activity.title}</td>
              <td>{activity.description}</td>
              <td>{activity.date}</td>
              <td>{activity.imageUrl ? <img src={activity.imageUrl} alt={activity.title} width="100" /> : "Tidak ada gambar"}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEditActivityClick(activity)}>Edit</button>
                <button className="btn btn-delete" onClick={() => handleDeleteActivityClick(activity)}>Hapus</button>
                </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* 📋 Tabel Alumni */}
      <h2 className="section-title">Daftar Alumni</h2>
      <table className="alumni-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Alamat</th>
            <th>Telepon</th>
            <th>Pekerjaan</th>
            <th>Tahun Lulus</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {alumni.map((a, index) => (
            <tr key={a.id}>
              <td>{index + 1}</td>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.address}</td>
              <td>{a.phone}</td>
              <td>{a.job}</td>
              <td>{a.graduationYear}</td>
              <td>
                <button className="btn btn-delete" onClick={() => handleDeleteClick(a)}>Hapus</button>
                <button className="btn btn-edit" onClick={() => handleEditClick(a)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📝 Modal Edit Alumni */}
      {editingAlumni && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Alumni</h2>
            <form onSubmit={handleUpdateAlumni} className="modal-form">
              {["name", "email", "address", "phone", "job", "graduationYear"].map((field) => (
                <input
                  key={field}
                  type={field === "graduationYear" ? "number" : "text"}
                  name={field}
                  value={editingAlumni[field]}
                  onChange={handleEditChange}
                  required
                />
              ))}
              <div className="modal-buttons">
                <button type="submit" className="btn btn-add">Simpan</button>
                <button type="button" className="btn btn-delete" onClick={() => setEditingAlumni(null)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⚠️ Modal Konfirmasi Hapus */}
      {deletingAlumni && (
        <div className="modal">
          <div className="modal-content">
            <h3>Yakin ingin menghapus alumni ini?</h3>
            <p><strong>{deletingAlumni.name}</strong></p>
            <div className="modal-buttons">
              <button className="btn btn-delete" onClick={confirmDelete}>Ya</button>
              <button className="btn btn-edit" onClick={() => setDeletingAlumni(null)}>Tidak</button>
            </div>
          </div>
        </div>
      )}
      {editingActivity && (
        <div className="modal">
            <div className="modal-content">
            <h2>Edit Kegiatan</h2>
            <form onSubmit={handleUpdateActivity} className="modal-form">
                <input
                type="text"
                name="title"
                value={editingActivity.title}
                onChange={handleEditActivityChange}
                required
                />
                <textarea
                name="description"
                value={editingActivity.description}
                onChange={handleEditActivityChange}
                required
                />
                <input
                type="date"
                name="date"
                value={editingActivity.date}
                onChange={handleEditActivityChange}
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
        {deletingActivity && (
        <div className="modal">
            <div className="modal-content">
            <h3>Yakin ingin menghapus kegiatan ini?</h3>
            <p><strong>{deletingActivity.title}</strong></p>
            <div className="modal-buttons">
                <button className="btn btn-delete" onClick={confirmDeleteActivity}>Ya</button>
                <button className="btn btn-edit" onClick={() => setDeletingActivity(null)}>Tidak</button>
            </div>
            </div>
        </div>
        )}



      {/* ⚠️ Modal Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Yakin ingin logout?</h3>
            <div className="modal-buttons">
              <button className="btn btn-delete" onClick={handleLogout}>Ya</button>
              <button className="btn btn-edit" onClick={() => setShowLogoutConfirm(false)}>Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
