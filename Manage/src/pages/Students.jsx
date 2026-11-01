import React, { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import { TopPerformers } from '../components/students/TopPerformers';
import { StudentForm } from '../components/students/StudentForm';
import { AllStudents } from '../components/students/AllStudents';
import { StudentDetails } from '../components/students/StudentDetails';
import { Modal } from '../components/common/Modal';
import { studentService } from '../services/studentService';

export const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudent = async (newStudentData) => {
    try {
      const added = await studentService.create(newStudentData);
      setStudents((prev) => [...prev, added]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      {/* Header with Dynamic Total Students Counter */}
      <div className="page-header">
        <div>
          <p className="page-subtitle">Student Directory</p>
          <h1 className="page-title">Find, manage and know your students.</h1>
          <p className="page-description">
            Search, filter, sort and add student records. View top performers and explore the complete directory.
          </p>
        </div>

        {/* Dynamic Total Count */}
        <div className="total-counter-card">
          <FiUsers style={{ fontSize: '20px', color: '#064e3b' }} />
          <div>
            <div className="counter-label">Total Students</div>
            <div className="counter-value">{students.length}</div>
          </div>
        </div>
      </div>

      {/* Top Performers Section */}
      <TopPerformers students={students} />

      {/* 2-Column Split: Form & Directory */}
      <div className="directory-grid-layout">
        <StudentForm onSubmit={handleAddStudent} />
        <AllStudents students={students} onViewDetails={(s) => setSelectedStudent(s)} />
      </div>

      {/* View Details Popup */}
      <Modal
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title="Student Information"
      >
        <StudentDetails student={selectedStudent} />
      </Modal>
    </div>
  );
};