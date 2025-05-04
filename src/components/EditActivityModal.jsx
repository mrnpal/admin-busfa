import React from "react";

const EditActivityModal = ({
  editingActivity,
  handleEditActivityChange,
  handleUpdateActivity,
  cancelEdit,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Kegiatan</h3>
        <form onSubmit={handleUpdateActivity}>
          <label>Judul:</label>
          <input
            type="text"
            name="title"
            value={editingActivity.title}
            onChange={handleEditActivityChange}
            required
          />

          <label>Deskripsi:</label>
          <textarea
            name="description"
            value={editingActivity.description}
            onChange={handleEditActivityChange}
            required
          />

          <label>Tanggal:</label>
          <input
            type="date"
            name="date"
            value={editingActivity.date}
            onChange={handleEditActivityChange}
            required
          />

          <div className="modal-actions">
            <button type="submit" className="btn btn-save">Simpan</button>
            <button type="button" className="btn btn-cancel" onClick={cancelEdit}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal;
