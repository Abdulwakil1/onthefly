import React from "react";
import "./DeleteDialog.css"; // We'll create this CSS next

function DeleteDialog({ onCancel, onConfirm, error }) {
  return (
    <div className="delete-dialog-overlay">
      {/* Backdrop */}
      <div className="delete-dialog-backdrop" onClick={onCancel}></div>

      {/* Dialog */}
      <div className="delete-dialog-box">
        <h2>⚠️ Confirm Deletion ⚠️</h2>
        <p>
          Are you sure you want to delete this trip? This action cannot be
          undone.
        </p>

        {error && <p className="delete-dialog-error">{error}</p>}

        <div className="delete-dialog-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteDialog;
