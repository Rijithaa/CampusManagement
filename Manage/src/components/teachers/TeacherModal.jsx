import React from 'react';
import { FiUser, FiMail, FiBriefcase, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import { Modal } from '../common/Modal';
import { TeacherForm } from './TeacherForm';

export const TeacherModal = ({ isOpen, mode, teacher, onClose, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'Teacher Details' : mode === 'edit' ? 'Edit Teacher' : 'Add Teacher'}
    >
      {mode === 'view' && teacher && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', padding: '4px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiUser style={{ color: '#064e3b', fontSize: '16px' }} />
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block' }}>Name</span>
              <strong>{teacher.name}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiMail style={{ color: '#064e3b', fontSize: '16px' }} />
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block' }}>Email</span>
              <span>{teacher.email}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiBriefcase style={{ color: '#064e3b', fontSize: '16px' }} />
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block' }}>Department</span>
              <span>{teacher.department}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiBookOpen style={{ color: '#064e3b', fontSize: '16px' }} />
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block' }}>Subject</span>
              <span>{teacher.subject}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiCheckCircle style={{ color: teacher.status === 'Active' ? '#059669' : '#dc2626', fontSize: '16px' }} />
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block' }}>Status</span>
              <span className={`status-tag ${teacher.status?.toLowerCase()}`}>{teacher.status}</span>
            </div>
          </div>
        </div>
      )}

      {(mode === 'edit' || mode === 'create') && (
        <TeacherForm initialData={teacher} onSubmit={onSubmit} onCancel={onClose} />
      )}
    </Modal>
  );
};