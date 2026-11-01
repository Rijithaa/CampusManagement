import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FiAlertTriangle style={{ color: '#dc2626', fontSize: '20px' }} />
          </div>
          <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
            {message || 'Are you sure you want to perform this action?'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};