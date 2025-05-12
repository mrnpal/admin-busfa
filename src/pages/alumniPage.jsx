import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../alumniPage.css";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [newAlumni, setNewAlumni] = useState({
    name: "", email: "", address: "", phone: "", job: "", graduationYear: ""
  });
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [deletingAlumni, setDeletingAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Batas baris per halaman

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const alumniSnapshot = await getDocs(collection(db, "alumni"));
      const alumniVerifiedSnapshot = await getDocs(collection(db, "alumniVerified"));
  
      const alumniData = alumniSnapshot.docs.map(doc => ({
        id: doc.id,
        collectionName: "alumni",
        verified: false,
        ...doc.data()
      }));
  
      const alumniVerifiedData = alumniVerifiedSnapshot.docs.map(doc => ({
        id: doc.id,
        collectionName: "alumniVerified",
        verified: true,
        ...doc.data()
      }));
  
      setAlumni([...alumniData, ...alumniVerifiedData]);
      setCurrentPage(1); // Reset ke halaman 1 saat data berubah
    } catch (err) {
      setError("Gagal memuat data alumni.");
    }
  };
  
  // Fungsi untuk mendapatkan data yang ditampilkan di halaman saat ini
  const getCurrentPageData = () => {
    const filteredData = alumni.filter((a) =>
      `${a.name} ${a.email} ${a.job}`.toLowerCase().includes(searchTerm.toLowerCase())
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
    try {
      const id = uuidv4();
      await setDoc(doc(db, "alumni", id), {
        ...newAlumni,
        id: id,
      });
      
      setNewAlumni({ name: "", email: "", address: "", phone: "", job: "", graduationYear: "" });
      fetchAlumni();
    } catch (err) {
      setError("Gagal menambahkan alumni.");
    }
  };

  const handleUpdateAlumni = async (e) => {
    e.preventDefault();
    try {
      const { id, collectionName, ...data } = editingAlumni;
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        id,
        collectionName
      });
      
      setEditingAlumni(null);
      fetchAlumni();
    } catch (err) {
      setError("Gagal memperbarui data alumni.");
    }
  };

  const confirmDelete = async () => {
    try {
      const { id, collectionName } = deletingAlumni;
      if (!id || !collectionName) {
        throw new Error("Data tidak lengkap untuk penghapusan.");
      }
      await deleteDoc(doc(db, collectionName, id));
      setDeletingAlumni(null);
      fetchAlumni();
    } catch (err) {
      console.error("Gagal menghapus alumni:", err);
      setError("Gagal menghapus alumni.");
    }
  };

  const handleEditChange = (e) => {
    setEditingAlumni((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Fungsi untuk mengubah halaman
  const goToPage = (page) => {
    setCurrentPage(page);
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


        <h2 className="section-title">Tambah Alumni</h2>
        <form onSubmit={handleAddAlumni} className="form-grid">
          {["name", "email", "address", "phone", "job", "graduationYear"].map((field) => (
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
        <input
          type="text"
          placeholder="Cari alumni berdasarkan nama, email, atau pekerjaan..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset ke halaman 1 saat pencarian berubah
          }}
          className="form-input"
          style={{ marginBottom: "1rem", width: "100%" }}
        />

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
              <th>Lulus</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentAlumni.map((a, index) => (
              <tr key={`${a.collectionName}-${a.id}`}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.address}</td>
                <td>{a.phone}</td>
                <td>{a.job}</td>
                <td>{a.graduationYear}</td>
                <td>
                  {a.verified ? (
                    <span title="Terverifikasi" style={{ color: "green", fontWeight: "bold" }}>✔️</span>
                  ) : (
                    <span title="Belum Terverifikasi" style={{ color: "red", fontWeight: "bold" }}>❌</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-edit" onClick={() => setEditingAlumni(a)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => setDeletingAlumni(a)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              &gt;
            </button>
          </div>
        )}

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