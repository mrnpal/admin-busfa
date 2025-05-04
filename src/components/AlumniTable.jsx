import React from "react";

const AlumniTable = ({ alumni, handleEditClick, handleDeleteClick }) => {
  return (
    <div className="table-container">
      <h2>Daftar Alumni</h2>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Alamat</th>
            <th>Pekerjaan</th>
            <th>Nomor Telepon</th>
            <th>Tahun Lulus</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {alumni.map((alumnus) => (
            <tr key={alumnus.id}>
              <td>{alumnus.name}</td>
              <td>{alumnus.email}</td>
              <td>{alumnus.address}</td>
              <td>{alumnus.job}</td>
              <td>{alumnus.phone}</td>
              <td>{alumnus.graduationYear}</td>
              <td>
                <button
                  className="btn btn-edit"
                  onClick={() => handleEditClick(alumnus)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteClick(alumnus)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlumniTable;
