import React from 'react';

export const StudentDetails = ({ student }) => {
  if (!student) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
        <span style={{ color: '#64748b' }}>Full Name:</span>
        <strong>{student.name}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
        <span style={{ color: '#64748b' }}>Email:</span>
        <strong>{student.email}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
        <span style={{ color: '#64748b' }}>Department:</span>
        <strong>{student.department}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
        <span style={{ color: '#64748b' }}>Year of Study:</span>
        <strong>{student.year}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
        <span style={{ color: '#64748b' }}>CGPA:</span>
        <strong style={{ color: '#047857' }}>{student.cgpa}</strong>
      </div>
    </div>
  );
};