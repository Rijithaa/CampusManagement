import React from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{title}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};