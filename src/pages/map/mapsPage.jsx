import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  FiHome,
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiClipboard,
  FiBriefcase,
  FiLogOut,
  FiMapPin,
  FiInfo,
  FiPhone,
} from "react-icons/fi";
import "./mapsPage.css";

const containerStyle = {
  width: "100%",
  height: "70vh",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  marginTop: 24,
};

const center = { lat: -7.7398016, lng: 113.7016832 }; 

const MapsPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB0kzhoW5mY-0PZJRl02IJnbkktMdgqI6k",
  });

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const alumniData = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lat: data.latitude,
        lng: data.longitude,
      };
    });
    setAlumni(alumniData);
  };

  const toggleSidebar = () => setIsSidebarCollapsed((v) => !v);

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
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
            <button onClick={() => navigate("/users")} className="menu-item">
              <FiCheckCircle className="menu-icon" />
              {!isSidebarCollapsed && <span>Users</span>}
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
              {!isSidebarCollapsed && <span>Verifikasi Pengguna</span>}
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
          <h1>
            <FiMapPin style={{ verticalAlign: "middle", marginRight: 8 }} />
            Peta Persebaran Alumni
          </h1>
        </header>
        <div style={containerStyle}>
          {isLoaded && (
            <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center} zoom={14}>
              {alumni
                .filter(a => typeof a.lat === "number" && typeof a.lng === "number")
                .map(a => (
                  <Marker
                    key={a.id}
                    position={{ lat: a.lat, lng: a.lng }}
                    onClick={() => setSelected(a)}
                  />
                ))}
              {selected && (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div style={{ minWidth: 180, textAlign: "center" }}>
                    <img
                      src={selected.photoUrl}
                      alt={selected.name}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: 8,
                        border: "2px solid #eee",
                        background: "#fafafa"
                      }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                    <div style={{ fontWeight: "bold", marginBottom: 10, }}>{selected.name}</div>
                    <FiPhone style={{ marginRight: 4 }} />
                    {selected.phone || "-"}
                    <br />
                    <FiMapPin style={{ marginRight: 4 }} />
                    {selected.address || "-"}
                    <br />
                    <FiBriefcase style={{ marginRight: 4 }} />
                    {selected.job || "-"}
                    <br />
                    <FiCalendar style={{ marginRight: 4 }} />
                    {selected.graduationYear || "-"}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>
        <div style={{ marginTop: 16, color: "#888" }}>
          <small>
            <FiInfo style={{ marginRight: 4 }} />
            Hanya alumni yang memiliki data lokasi (latitude & longitude) yang akan tampil di peta.
          </small>
        </div>
      </div>
    </div>
  );
};

export default MapsPage;