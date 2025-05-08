import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

import "../alumniPage.css";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
 
  
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [deletingAlumni, setDeletingAlumni] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const snapshot = await getDocs(collection(db, "alumniVerified"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlumni(data);
    } catch (err) {
      setError("Gagal memuat data alumni.");
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

      <div className="main-content">
        {error && <p className="error-message">{error}</p>}

        <h1>Daftar Alumni Terverifikasi</h1>

        <table className="alumni-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
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
                <td>{a.email}</td>
                <td>{a.address}</td>
                <td>{a.phone}</td>
                <td>{a.job}</td>
                <td>{a.graduationYear}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => setEditingAlumni(a)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => setDeletingAlumni(a)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Edit */}
        {editingAlumni && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Alumni</h2>
              <form onSubmit={handleUpdateAlumni} className="modal-form">
                {["name", "email", "address", "phone", "job", "graduationYear"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    type={field === "graduationYear" ? "number" : "text"}
                    value={editingAlumni[field]}
                    onChange={handleEditChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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

        {/* Modal Hapus */}
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
