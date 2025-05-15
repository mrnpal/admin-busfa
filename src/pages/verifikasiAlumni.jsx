import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../verifikasiAlumni.css";

const VerifikasiAlumniPage = () => {
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingAlumni();
  }, []);

  const fetchPendingAlumni = async () => {
    const snapshot = await getDocs(collection(db, "pendingAlumni"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    }));
    setPendingAlumni(data);
  };

  const handleVerify = async (alumni) => {
  setLoading(true);
  try {
    // Simpan ke koleksi alumniVerified dan alumni
    const alumniData = {
      ...alumni,
      isVerified: true,
    };

    await Promise.all([
      setDoc(doc(db, "alumniVerified", alumni.id), alumniData),
      setDoc(doc(db, "alumni", alumni.id), alumniData),
      deleteDoc(doc(db, "pendingAlumni", alumni.id)),
    ]);

    // Kirim notifikasi jika alumni memiliki FCM token
    if (alumni.fcmToken) {
      await sendFCM(
        alumni.fcmToken,
        "Pendaftaran Disetujui",
        "Selamat! Akun Anda telah diverifikasi."
      );
    }

    fetchPendingAlumni(); // refresh daftar
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

  const sendFCM = async (token, title, body) => {
  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "key=YOUR_SERVER_KEY", // Ganti dengan server key dari Firebase console
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title: title,
        body: body,
      },
    }),
  });

  const data = await response.json();
  console.log("FCM response:", data);
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
        <button className="logout-button" onClick={() => navigate("/logout")}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Verifikasi Alumni</h1>
        {pendingAlumni.length === 0 ? (
          <p>Tidak ada pendaftar yang menunggu verifikasi.</p>
        ) : (
          <table className="alumni-table">
            <thead>
              <tr>
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
              {pendingAlumni.map((alumni) => (
                <tr key={alumni.id}>
                  <td>{alumni.name}</td>
                  <td>{alumni.email}</td>
                  <td>{alumni.address}</td>
                  <td>{alumni.phone}</td>
                  <td>{alumni.job}</td>
                  <td>{alumni.graduationYear}</td>
                  <td>
                    <button
                      className="btn btn-add"
                      onClick={() => handleVerify(alumni)}
                      disabled={loading}
                    >
                      Verifikasi
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleReject(alumni.id)}
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VerifikasiAlumniPage;
