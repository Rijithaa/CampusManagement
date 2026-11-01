import React from 'react';
import { Button } from '../common/Button';

export const StudentCard = ({ student, onViewDetails }) => {
  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '';

  return (
    <div className="student-card">
      <div className="student-card-left">
        <div className="avatar">{getInitials(student.name)}</div>
        <div className="student-meta">
          <h4>{student.name}</h4>
          <p>{student.email}</p>
          <p>
            {student.department} • {student.year}
          </p>
          <span className="cgpa-chip">CGPA {student.cgpa}</span>
        </div>
      </div>
      {onViewDetails && (
        <Button
          variant="outline"
          onClick={() => onViewDetails(student)}
          style={{ fontSize: '12px', padding: '6px 10px' }}
        >
          View Details
        </Button>
      )}
    </div>
  );
};