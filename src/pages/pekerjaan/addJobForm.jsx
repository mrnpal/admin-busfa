import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  FiHome, 
  FiUsers, 
  FiCheckCircle, 
  FiCalendar, 
  FiClipboard, 
  FiBriefcase, 
  FiLogOut,
  FiTrash2,
  FiPlus,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiType,
  FiInfo,
  FiList,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import './jobPage.css';

const JobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    type: '',
    location: '',
    description: '',
    requirements: '',
    deadline: '',
    salary: '',
    phoneContact: '',
    emailContact: '',
  });

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'jobs'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        formattedDeadline: doc.data().deadline?.toDate?.().toLocaleDateString('id-ID') || '-'
      }));
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let logoUrl = "";

    if (logoFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `jobs_images/${logoFile.name}_${Date.now()}`);
      await uploadBytes(storageRef, logoFile);
      logoUrl = await getDownloadURL(storageRef);
    }

    const jobData = {
      ...formData,
      companyLogo: logoUrl, 
      requirements: formData.requirements
        .split('\n')
        .filter((req) => req.trim() !== ''),
      postedDate: Timestamp.now(),
      deadline: Timestamp.fromDate(new Date(formData.deadline)),
      salary: formData.salary || null,
    };

    try {
      await addDoc(collection(db, 'jobs'), jobData);
      setFormData({
        title: '',
        company: '',
        companyLogo: '',
        type: '',
        location: '',
        description: '',
        requirements: '',
        deadline: '',
        salary: '',
        phoneContact: '',
        emailContact: '',
      });
      await fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus lowongan ini?')) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'jobs', id));
        await fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      } finally {
        setIsLoading(false);
      }
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
          <h1>Manajemen Lowongan Pekerjaan</h1>
          <div className="user-info">
            <span>Admin</span>
            <div className="user-avatar">
              <FiBriefcase size={18} />
            </div>
          </div>
        </header>

        <div className="content-card">
          <h2 className="section-title">
            <FiPlus className="title-icon" />
            Tambah Lowongan Baru
          </h2>
          
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Judul Pekerjaan</label>
              <div className="input-with-icon">
                <FiType className="input-icon" />
                <input
                  name="title"
                  placeholder="Contoh: Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nama Perusahaan</label>
              <input
                name="company"
                placeholder="Contoh: PT. Contoh Indonesia"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Logo Perusahaan</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setLogoFile(e.target.files[0])}
              />
            </div>

            <div className="form-group">
              <label>Tipe Pekerjaan</label>
              <div className="input-with-icon">
                <FiBriefcase className="input-icon" />
                <input
                  name="type"
                  placeholder="Contoh: Full-time, Part-time"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lokasi</label>
              <div className="input-with-icon">
                <FiMapPin className="input-icon" />
                <input
                  name="location"
                  placeholder="Contoh: Jakarta, Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Deskripsi Pekerjaan</label>
              <div className="input-with-icon">
                <FiInfo className="input-icon" />
                <textarea
                  name="description"
                  placeholder="Deskripsikan pekerjaan secara detail"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Persyaratan</label>
              <div className="input-with-icon">
                <FiList className="input-icon" />
                <textarea
                  name="requirements"
                  placeholder="Satu persyaratan per baris"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Batas Waktu</label>
              <div className="input-with-icon">
                <FiClock className="input-icon" />
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gaji</label>
              <div className="input-with-icon">
                <FiDollarSign className="input-icon" />
                <input
                  name="salary"
                  placeholder="Contoh: Rp 8.000.000 - Rp 12.000.000 (opsional)"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Kontak Perusahaan</label>
            <div className="input-with-icon">
              <FiPhone className="input-icon" />
              <input
                name="phoneContact"
                type="tel"
                placeholder="Nomor telepon yang dapat dihubungi"
                value={formData.phoneContact}
                onChange={handleChange}
              />
              </div>
            </div>

            <div className="form-group">
              <label>Email Perusahaan</label>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                name="emailContact"
                type="email"
                placeholder="Email yang dapat dihubungi"
                value={formData.emailContact}
                onChange={handleChange}
              />
              </div>
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
                  Tambah Lowongan
                </>
              )}
            </button>
          </form>
        </div>

        <div className="content-card">
          <h2 className="section-title">
            <FiBriefcase className="title-icon" />
            Daftar Lowongan
          </h2>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner large"></div>
              <p>Memuat data lowongan...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <img 
                src="1.jpg" 
                alt="No jobs" 
                className="empty-image"
              />
              <h3>Belum ada lowongan</h3>
              <p>Tambahkan lowongan baru untuk ditampilkan di sini</p>
            </div>
          ) : (
            <div className="responsive-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul</th>
                    <th>Perusahaan</th>
                    <th>Logo</th>
                    <th>Tipe</th>
                    <th>Lokasi</th>
                    <th>Batas Waktu</th>
                    <th>Gaji</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, idx) => (
                    <tr key={job.id}>
                      <td>{idx + 1}</td>
                      <td className="job-title">{job.title}</td>
                      <td>{job.company}</td>
                      <td>
                        {job.companyLogo ? (
                          <img 
                            src={job.companyLogo} 
                            alt={job.company} 
                            className="company-logo"
                          />
                        ) : (
                          <div className="logo-placeholder">
                            <FiBriefcase />
                          </div>
                        )}
                      </td>
                      <td>{job.type}</td>
                      <td>{job.location}</td>
                      <td>{job.formattedDeadline}</td>
                      <td>{job.salary || '-'}</td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(job.id)}
                          disabled={isLoading}
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
      </div>
    </div>
  );
};

export default JobPage;