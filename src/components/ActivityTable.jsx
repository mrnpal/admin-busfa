import React from "react";

const ActivityTable = ({ activities, handleEditActivityClick, handleDeleteActivityClick }) => {
  return (
    <div className="table-container">
      <h2>Daftar Kegiatan</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Deskripsi</th>
            <th>Tanggal</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.title}</td>
              <td>{activity.description}</td>
              <td>{activity.date}</td>
              <td>
                {activity.imageUrl && (
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    style={{ width: "100px", height: "auto" }}
                  />
                )}
              </td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEditActivityClick(activity)}>
                  Edit
                </button>
                <button className="btn btn-delete" onClick={() => handleDeleteActivityClick(activity)}>
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

export default ActivityTable;
