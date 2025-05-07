import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../alumniPage.css";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [newAlumni, setNewAlumni] = useState({
    name: "", email: "", address: "", phone: "", job: "", graduationYear: ""
  });
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [deletingAlumni, setDeletingAlumni] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const snapshot = await getDocs(collection(db, "alumni"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlumni(data);
    } catch (err) {
      setError("Gagal memuat data alumni.");
    }
  };

  const handleAddAlumni = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "alumni"), newAlumni);
      setNewAlumni({ name: "", email: "", address: "", phone: "", job: "", graduationYear: "" });
      fetchAlumni();
    } catch (err) {
      setError("Gagal menambahkan alumni.");
    }
  };

  const handleUpdateAlumni = async (e) => {
    e.preventDefault();
    try {
      const { id, ...data } = editingAlumni;
      await updateDoc(doc(db, "alumni", id), data);
      setEditingAlumni(null);
      fetchAlumni();
    } catch (err) {
      setError("Gagal memperbarui data alumni.");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "alumni", deletingAlumni.id));
      setDeletingAlumni(null);
      fetchAlumni();
    } catch (err) {
      setError("Gagal menghapus alumni.");
    }
  };

  const handleEditChange = (e) => {
    setEditingAlumni((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2>Alumni</h2>
          <ul>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/alumni")}>Alumni</button>
            <button onClick={() => navigate("/kegiatan")}>Kegiatan</button>
          </ul>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="main-content">
        {error && <p className="error-message">{error}</p>}

        <h1>Kelola Alumni</h1>

        <h2 className="section-title">Tambah Alumni</h2>
        <form onSubmit={handleAddAlumni} className="form-grid">
          {["name", "address", "phone", "job", "graduationYear"].map((field) => (
            <input
              key={field}
              type={field === "graduationYear" ? "number" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newAlumni[field]}
              onChange={(e) => setNewAlumni((prev) => ({ ...prev, [field]: e.target.value }))}
              required
              aria-label={field}
              className="form-input"
            />
          ))}
          <button type="submit" className="btn btn-add">Tambah</button>
        </form>

        <h2 className="section-title">Daftar Alumni</h2>
        <table className="alumni-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Telepon</th>
              <th>Pekerjaan</th>
              <th>Lulus</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{a.name}</td>
                <td>{a.address}</td>
                <td>{a.phone}</td>
                <td>{a.job}</td>
                <td>{a.graduationYear}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => setEditingAlumni(a)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => setDeletingAlumni(a)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal untuk Edit Alumni */}
        {editingAlumni && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Alumni</h2>
              <form onSubmit={handleUpdateAlumni} className="modal-form">
                <input
                  name="name"
                  type="text"
                  value={editingAlumni.name}
                  onChange={handleEditChange}
                  placeholder="Nama"
                  required
                />
                <input
                  name="address"
                  type="text"
                  value={editingAlumni.address}
                  onChange={handleEditChange}
                  placeholder="Alamat"
                  required
                />
                <input
                  name="phone"
                  type="text"
                  value={editingAlumni.phone}
                  onChange={handleEditChange}
                  placeholder="Telepon"
                  required
                />
                <input
                  name="job"
                  type="text"
                  value={editingAlumni.job}
                  onChange={handleEditChange}
                  placeholder="Pekerjaan"
                  required
                />
                <input
                  name="graduationYear"
                  type="number"
                  value={editingAlumni.graduationYear}
                  onChange={handleEditChange}
                  placeholder="Tahun Lulus"
                  required
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn btn-add">Simpan</button>
                  <button
                    type="button"
                    className="btn btn-delete"
                    onClick={() => setEditingAlumni(null)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {deletingAlumni && (
          <div className="modal">
            <div className="modal-content">
              <h3>Hapus Alumni?</h3>
              <p><strong>{deletingAlumni.name}</strong></p>
              <div className="modal-buttons">
                <button className="btn btn-delete" onClick={confirmDelete}>Ya</button>
                <button className="btn btn-edit" onClick={() => setDeletingAlumni(null)}>Tidak</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;
