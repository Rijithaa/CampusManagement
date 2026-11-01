import React, { useState, useRef, useEffect } from 'react';
import { FiUserPlus, FiChevronDown } from 'react-icons/fi';
import { Button } from '../common/Button';
import { studentService } from '../../services/studentService';

// Custom inline dropdown component
const FormDropdown = ({ label, options, value, onChange, placeholder, error, required }) => {
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

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="form-group" ref={dropdownRef} style={{ position: 'relative' }}>
      <label>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <button
        type="button"
        className="form-input"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer',
          background: '#ffffff',
          color: value ? '#0f172a' : '#9da3ae', // Standardized placeholder color match
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder || 'Select option'}</span>
        <FiChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#9da3ae' }} />
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
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export const StudentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    cgpa: '',
  });

  const [errors, setErrors] = useState({});

  const departmentOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Information Technology', label: 'Information Technology' },
  ];

  const yearOptions = [
    { value: 'Year 1', label: 'Year 1' },
    { value: 'Year 2', label: 'Year 2' },
    { value: 'Year 3', label: 'Year 3' },
    { value: 'Year 4', label: 'Year 4' },
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid Email Address is required';
    }
    if (!formData.department) errs.department = 'Department selection is required';
    const cgpaVal = parseFloat(formData.cgpa);
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (validate()) {
    try {
      const createdStudent = await studentService.create({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        year: formData.year,
        cgpa: parseFloat(formData.cgpa),
      });
      onSubmit(createdStudent); // Update top-level state
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  }
};

  return (
    <div className="form-card-container">
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <FiUserPlus style={{ fontSize: '18px', color: '#064e3b' }} />
          <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Add a New Student</h3>
        </div>
        <p style={{ fontSize: '11px', color: '#64748b' }}>Enter student details to add them to the directory.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Full Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter student name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>
            Email Address <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <FormDropdown
          label="Department"
          required
          placeholder="Select department"
          options={departmentOptions}
          value={formData.department}
          onChange={(val) => setFormData({ ...formData, department: val })}
          error={errors.department}
        />

        <FormDropdown
          label="Year of Study"
          required
          placeholder="Select year"
          options={yearOptions}
          value={formData.year}
          onChange={(val) => setFormData({ ...formData, year: val })}
        />

        <div className="form-group">
          <label>
            CGPA <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            placeholder="Enter CGPA (e.g., 8.5)"
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
          />
          {errors.cgpa && <p className="error-text">{errors.cgpa}</p>}
        </div>

        <Button type="submit" style={{ width: '100%', marginTop: '6px' }}>
          + Add Student
        </Button>
      </form>
    </div>
  );
};