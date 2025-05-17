import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import '../Dashboard.css';

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
  });

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, 'jobs'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(data);
    };
    fetchJobs();
  }, [formData]); // refresh saat formData berubah (setelah submit)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements
          .split('\n')
          .filter((req) => req.trim() !== ''),
        postedDate: Timestamp.now(),
        deadline: Timestamp.fromDate(new Date(formData.deadline)),
        companyLogo: formData.companyLogo || null,
        salary: formData.salary || null,
      };

      await addDoc(collection(db, 'jobs'), jobData);
      alert('Job posted successfully!');
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
      });
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div>
          <h2>Admin Panel</h2>
          <ul>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/alumni")}>Alumni</button>
            <button onClick={() => navigate("/alumniVerified")}>Alumni Terverifikasi</button>
            <button onClick={() => navigate("/kegiatan")}>Kegiatan</button>
            <button onClick={() => navigate("/verifikasi")}>Verifikasi Alumni</button>
            <button onClick={() => navigate("/pekerjaan")}>Tambah Pekerjaan</button>
          </ul>
        </div>
        <button className="logout-button" onClick={() => navigate("/logout")}>Logout</button>
      </div>

      <div className="main-content">
        <h2 className="job-form-title">Add Job Posting</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} className="form-input" required />

          <input name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} className="form-input" required />

          <input name="companyLogo" placeholder="Company Logo URL (optional)" value={formData.companyLogo} onChange={handleChange} className="form-input" />

          <input name="type" placeholder="Job Type (e.g. Full-time)" value={formData.type} onChange={handleChange} className="form-input" required />

          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="form-input" required />

          <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} className="form-textarea" required />

          <textarea name="requirements" placeholder="Requirements (one per line)" value={formData.requirements} onChange={handleChange} className="form-textarea" required />

          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" required />

          <input name="salary" placeholder="Salary (optional)" value={formData.salary} onChange={handleChange} className="form-input" />

          <button type="submit" className="btn btn-add">Submit Job</button>
        </form>

        <h2 style={{marginTop: 32}}>Daftar Lowongan</h2>
        <div className="table-responsive">
          <table className="alumni-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Perusahaan</th>
                <th>Logo</th>
                <th>Tipe</th>
                <th>Lokasi</th>
                <th>Deadline</th>
                <th>Gaji</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr key={job.id}>
                  <td>{idx + 1}</td>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} style={{width: 48, height: 48, objectFit: 'contain', borderRadius: 8}} />
                    ) : (
                      <span style={{color: '#aaa'}}>—</span>
                    )}
                  </td>
                  <td>{job.type}</td>
                  <td>{job.location}</td>
                  <td>{job.deadline && job.deadline.toDate ? job.deadline.toDate().toLocaleDateString() : '-'}</td>
                  <td>{job.salary || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
