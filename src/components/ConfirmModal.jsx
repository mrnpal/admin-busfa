import React from "react";

const ConfirmDeleteModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Hapus</button>
          <button className="btn btn-cancel" onClick={onCancel}>Batal</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
