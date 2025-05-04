import React from "react";

const ConfirmLogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Apakah Anda yakin ingin logout?</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Logout</button>
          <button className="btn btn-cancel" onClick={onCancel}>Batal</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
