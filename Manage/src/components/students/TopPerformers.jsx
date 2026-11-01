import React from 'react';
import { FiAward, FiStar } from 'react-icons/fi';

export const TopPerformers = ({ students }) => {
  // Requirement: Top Performers above 9 CGPA
  const topStudents = students.filter((student) => Number(student.cgpa) > 9.0);

  return (
    <section className="top-performers-section">
      <div className="section-header">
        <div className="header-title-group">
          <FiAward style={{ fontSize: '20px', color: '#064e3b' }} />
          <div>
            <h3>Top Performers (CGPA &gt; 9)</h3>
            <p className="header-subtitle">Students with CGPA greater than 9 are featured here.</p>
          </div>
        </div>
        <span className="count-badge">{topStudents.length} Students</span>
      </div>

      {topStudents.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#64748b' }}>No students currently have a CGPA above 9.0.</p>
      ) : (
        <div className="top-performers-grid">
          {topStudents.map((student) => (
            <div key={student.id} className="top-card">
              <div className="top-card-header">
                <div className="avatar">
                  {student.name
                    ? student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : ''}
                </div>
                <div className="top-card-info">
                  <h4>{student.name}</h4>
                  <p>
                    {student.department} • {student.year}
                  </p>
                </div>
              </div>
              <div className="top-cgpa-box">
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>CGPA</div>
                  <div className="cgpa-val">{student.cgpa}</div>
                </div>
                <span className="badge-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <FiStar style={{ fontSize: '10px' }} /> Top Performer
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};