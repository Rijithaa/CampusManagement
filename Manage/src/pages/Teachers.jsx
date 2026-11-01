import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiUserPlus, FiUserCheck, FiRotateCcw, FiChevronDown } from 'react-icons/fi';
import { TeacherTable } from '../components/teachers/TeacherTable';
import { TeacherModal } from '../components/teachers/TeacherModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';
import { teacherService } from '../services/teacherService';
import { useDebounce } from '../hooks/useDebounce';

// Custom inline dropdown matching Students page styling
const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="filter-group" ref={dropdownRef} style={{ position: 'relative' }}>
      {label && <label>{label}</label>}
      <button
        type="button"
        className="filter-select"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          minWidth: '160px',
          textAlign: 'left',
          cursor: 'pointer',
          background: '#ffffff',
        }}
      >
        <span>{selectedLabel}</span>
        <FiChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '4px 0',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '8px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: isSelected ? '#064e3b' : '#0f172a',
                  backgroundColor: isSelected ? '#d1fae5' : '#ffffff',
                  fontWeight: isSelected ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#ecfdf5';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [subject, setSubject] = useState('All');
  const [activeModal, setActiveModal] = useState({ isOpen: false, mode: null, teacher: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setDepartment('All');
    setSubject('All');
  };

  const handleSave = async (formData) => {
    try {
      if (activeModal.mode === 'create') {
        const newTeacher = await teacherService.create(formData);
        setTeachers((prev) => [...prev, newTeacher]);
      } else if (activeModal.mode === 'edit') {
        const updated = await teacherService.update(activeModal.teacher.id, formData);
        setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      setActiveModal({ isOpen: false, mode: null, teacher: null });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (teacher) => {
    setDeleteTarget(teacher);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teacherService.delete(deleteTarget.id);
      setTeachers((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete teacher:', err);
    }
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.department.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesDept = department === 'All' || t.department === department;
      const matchesSubject = subject === 'All' || t.subject === subject;

      return matchesSearch && matchesDept && matchesSubject;
    });
  }, [teachers, debouncedSearch, department, subject]);

  const departmentOptions = useMemo(() => {
    const depts = Array.from(new Set(teachers.map((t) => t.department).filter(Boolean)));
    return [{ value: 'All', label: 'All Departments' }, ...depts.map((d) => ({ value: d, label: d }))];
  }, [teachers]);

  const subjectOptions = useMemo(() => {
    const subjs = Array.from(new Set(teachers.map((t) => t.subject).filter(Boolean)));
    return [{ value: 'All', label: 'All Subjects' }, ...subjs.map((s) => ({ value: s, label: s }))];
  }, [teachers]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-subtitle">Teacher Management</p>
          <h1 className="page-title">Manage Teachers</h1>
          <p className="page-description">
            View, edit, add, and remove teacher records. Keep track of departments and subjects.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button
            variant="primary"
            onClick={() => setActiveModal({ isOpen: true, mode: 'create', teacher: null })}
          >
            <FiUserPlus style={{ marginRight: '6px' }} /> Add Teacher
          </Button>

          <div className="total-counter-card">
            <FiUserCheck style={{ fontSize: '20px', color: '#064e3b' }} />
            <div>
              <div className="counter-label">Total Teachers</div>
              <div className="counter-value">{teachers.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, department..." />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <FilterDropdown
            label="Department"
            options={departmentOptions}
            value={department}
            onChange={setDepartment}
          />

          <FilterDropdown
            label="Subject"
            options={subjectOptions}
            value={subject}
            onChange={setSubject}
          />

          <Button variant="secondary" onClick={handleClearFilters}>
            <FiRotateCcw style={{ marginRight: '6px' }} /> Clear Filters
          </Button>
        </div>
      </div>

      <TeacherTable
        teachers={filteredTeachers}
        onView={(t) => setActiveModal({ isOpen: true, mode: 'view', teacher: t })}
        onEdit={(t) => setActiveModal({ isOpen: true, mode: 'edit', teacher: t })}
        onDelete={(id) => {
          const teacherToDelete = teachers.find((t) => t.id === id);
          handleDeleteClick(teacherToDelete || { id });
        }}
      />

      <TeacherModal
        isOpen={activeModal.isOpen}
        mode={activeModal.mode}
        teacher={activeModal.teacher}
        onClose={() => setActiveModal({ isOpen: false, mode: null, teacher: null })}
        onSubmit={handleSave}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this teacher'}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};