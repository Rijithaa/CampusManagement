import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FiUsers, FiRotateCcw, FiChevronDown } from 'react-icons/fi';
import { StudentCard } from './StudentCard';
import { SearchBar } from '../common/SearchBar';
import { Button } from '../common/Button';
import { useDebounce } from '../../hooks/useDebounce';

// Custom inline dropdown component to bypass Windows native blue highlight
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
      <label>{label}</label>
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

export const AllStudents = ({ students, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('All');
  const [year, setYear] = useState('All');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartment('All');
    setYear('All');
    setSortOrder('name-asc');
    setCurrentPage(1);
  };

  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          student.email.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesDept = department === 'All' || student.department === department;
        const matchesYear = year === 'All' || student.year === year;
        return matchesSearch && matchesDept && matchesYear;
      })
      .sort((a, b) => {
        if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
        if (sortOrder === 'cgpa-desc') return b.cgpa - a.cgpa;
        if (sortOrder === 'cgpa-asc') return a.cgpa - b.cgpa;
        return 0;
      });
  }, [students, debouncedSearch, department, year, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedStudents.slice(start, start + itemsPerPage);
  }, [filteredAndSortedStudents, currentPage]);

  const totalCount = filteredAndSortedStudents.length;
  const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Dropdown options configuration
  const departmentOptions = useMemo(() => {
  const depts = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));
  return [
    { value: 'All', label: 'All Departments' },
    ...depts.map((d) => ({ value: d, label: d })),
  ];
}, [students]);

  const yearOptions = [
    { value: 'All', label: 'All Years' },
    { value: 'Year 1', label: 'Year 1' },
    { value: 'Year 2', label: 'Year 2' },
    { value: 'Year 3', label: 'Year 3' },
    { value: 'Year 4', label: 'Year 4' },
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'cgpa-desc', label: 'CGPA: High to Low' },
    { value: 'cgpa-asc', label: 'CGPA: Low to High' },
  ];

  return (
    <div className="all-students-card-container">
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <div className="header-title-group">
          <FiUsers style={{ fontSize: '20px', color: '#064e3b' }} />
          <div>
            <h3>All Students</h3>
            <p className="header-subtitle">Search, filter and sort student records.</p>
          </div>
        </div>
        <span className="count-badge">{totalCount} Students</span>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or email..." />

        <FilterDropdown
          label="Department"
          options={departmentOptions}
          value={department}
          onChange={setDepartment}
        />

        <FilterDropdown
          label="Year"
          options={yearOptions}
          value={year}
          onChange={setYear}
        />

        <FilterDropdown
          label="Sort by"
          options={sortOptions}
          value={sortOrder}
          onChange={setSortOrder}
        />

        <Button variant="secondary" onClick={handleClearFilters}>
          <FiRotateCcw style={{ marginRight: '6px' }} />
          Clear Filters
        </Button>
      </div>

      {/* Student Cards List */}
      <div className="student-grid">
        {paginatedStudents.map((student) => (
          <StudentCard key={student.id} student={student} onViewDetails={onViewDetails} />
        ))}
      </div>

      {/* Bottom Pagination Bar */}
      <div className="pagination-wrapper">
        <span className="pagination-info">
          Showing {startItem}-{endItem} of {totalCount} students
        </span>

        <div className="pagination-controls">
          <button
            className="page-num-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="page-num-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};