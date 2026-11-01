import React, { useState, useEffect, useMemo } from 'react';
import { FiUsers, FiUserCheck, FiAward, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { studentService } from '../services/studentService';
import { teacherService } from '../services/teacherService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const HomePage = ({ onNavigate }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsData, teachersData] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
      ]);
      setStudents(studentsData);
      setTeachers(teachersData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  // Stats calculation
  const topPerformersCount = useMemo(
    () => students.filter((s) => Number(s.cgpa) > 9.0).length,
    [students]
  );

  const uniqueDepartments = useMemo(() => {
    const studentDepts = students.map((s) => s.department);
    const teacherDepts = teachers.map((t) => t.department);
    return Array.from(new Set([...studentDepts, ...teacherDepts].filter(Boolean)));
  }, [students, teachers]);

  const recentStudents = useMemo(() => students.slice(-4).reverse(), [students]);

  return (
    <div className="page-container">
      {/* Dashboard Header */}
      <div className="page-header">
        <div>
          <p className="page-subtitle">Overview & Summary</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            Quick analytics, recent entries, and quick links across your campus directory.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FiUsers style={{ fontSize: '22px', color: '#2563eb' }} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <h2 className="stat-number">{students.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <FiUserCheck style={{ fontSize: '22px', color: '#059669' }} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Teachers</span>
            <h2 className="stat-number">{teachers.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <FiAward style={{ fontSize: '22px', color: '#ca8a04' }} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Top Performers (&gt;9 CGPA)</span>
            <h2 className="stat-number">{topPerformersCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <FiBookOpen style={{ fontSize: '22px', color: '#9333ea' }} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Departments</span>
            <h2 className="stat-number">{uniqueDepartments.length}</h2>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="dashboard-content-grid">
        {/* Left Column: Recent Students */}
        <div className="dashboard-main-column">
          <Card className="dashboard-card">
            <div className="section-header">
              <h3>Recently Added Students</h3>
              <Button variant="outline" onClick={() => onNavigate('students')}>
                View All <FiArrowRight style={{ marginLeft: '4px' }} />
              </Button>
            </div>
            <div className="student-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {recentStudents.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-card-left">
                    <div className="avatar">
                      {student.name
                        ? student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                        : ''}
                    </div>
                    <div className="student-meta">
                      <h4>{student.name}</h4>
                      <p>{student.department}</p>
                      <span className="cgpa-chip">CGPA {student.cgpa}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="dashboard-side-column">
          <Card className="dashboard-card">
            <h3>Quick Actions</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              Directly jump into campus management tools.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button variant="primary" style={{ width: '100%' }} onClick={() => onNavigate('students')}>
                <FiUsers style={{ marginRight: '6px' }} /> Manage Students Directory
              </Button>
              <Button variant="secondary" style={{ width: '100%' }} onClick={() => onNavigate('teachers')}>
                <FiUserCheck style={{ marginRight: '6px' }} /> Manage Teachers
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};