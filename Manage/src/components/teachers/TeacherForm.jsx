import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiSave, FiChevronDown } from 'react-icons/fi';
import { Button } from '../common/Button';
import { teacherService } from '../../services/teacherService';

// Custom inline dropdown component to bypass OS blue hover highlights
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
          color: value ? '#0f172a' : '#9da3ae',
          borderColor: error ? '#ef4444' : '#cbd5e1',
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
      {error && <p className="error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
};

export const TeacherForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subject: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        subject: initialData.subject || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: '',
        subject: '',
      });
    }
    setErrors({});
  }, [initialData]);

  const departmentOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Information Technology', label: 'Information Technology' },
  ];

  // Regex Patterns
  const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const subjectRegex = /^[a-zA-Z0-9\s.&'-]{2,50}$/;

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Teacher Name is required';
    } else if (!nameRegex.test(formData.name.trim())) {
      errs.name = 'Please enter a valid name (letters, dots, and hyphens only)';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.department) {
      errs.department = 'Department selection is required';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject is required';
    } else if (!subjectRegex.test(formData.subject.trim())) {
      errs.subject = 'Please enter a valid subject name';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let savedTeacher;
      if (initialData && initialData.id) {
        // PUT update call using teacherService
        savedTeacher = await teacherService.update(initialData.id, formData);
      } else {
        // POST create call using teacherService
        savedTeacher = await teacherService.create(formData);
      }

      onSubmit(savedTeacher); // Pass saved server response back to parent component
    } catch (error) {
      console.error('Error saving teacher data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Teacher Name */}
        <div className="form-group">
          <label>
            Teacher Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter teacher name"
            value={formData.name}
            style={{ borderColor: errors.name ? '#ef4444' : undefined }}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: null });
            }}
          />
          {errors.name && <p className="error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.name}</p>}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label>
            Email Address <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter email address"
            value={formData.email}
            style={{ borderColor: errors.email ? '#ef4444' : undefined }}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: null });
            }}
          />
          {errors.email && <p className="error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.email}</p>}
        </div>

        {/* Department Custom Dropdown */}
        <FormDropdown
          label="Department"
          required
          placeholder="Select department"
          options={departmentOptions}
          value={formData.department}
          onChange={(val) => {
            setFormData({ ...formData, department: val });
            if (errors.department) setErrors({ ...errors, department: null });
          }}
          error={errors.department}
        />

        {/* Subject Input */}
        <div className="form-group">
          <label>
            Subject <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter subject"
            value={formData.subject}
            style={{ borderColor: errors.subject ? '#ef4444' : undefined }}
            onChange={(e) => {
              setFormData({ ...formData, subject: e.target.value });
              if (errors.subject) setErrors({ ...errors, subject: null });
            }}
          />
          {errors.subject && <p className="error-text" style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.subject}</p>}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {initialData ? (
            <>
              <FiSave style={{ marginRight: '4px' }} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </>
          ) : (
            <>
              <FiPlus style={{ marginRight: '4px' }} /> {isSubmitting ? 'Adding...' : 'Add Teacher'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};