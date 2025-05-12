import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../alumniPage.css";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 baris per halaman
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
      setCurrentPage(1); // Reset ke halaman 1 saat data berubah
    } catch (err) {
      setError("Gagal memuat data alumni.");
    }
  };

  // Hitung data yang ditampilkan di halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlumni = alumni.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(alumni.length / itemsPerPage);

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            </tr>
          </thead>
          <tbody>
            {currentAlumni.map((a, index) => (
              <tr key={a.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.address}</td>
                <td>{a.phone}</td>
                <td>{a.job}</td>
                <td>{a.graduationYear}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &lt; Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;