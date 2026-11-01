import React from 'react';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Button } from '../common/Button';

export const TeacherActions = ({ teacher, onView, onEdit, onDelete }) => {
  return (
    <div className="action-buttons">
      <Button
        variant="outline"
        style={{ padding: '4px 8px', fontSize: '12px' }}
        onClick={() => onView(teacher)}
      >
        <FiEye style={{ marginRight: '4px' }} /> View
      </Button>
      <Button
        variant="secondary"
        style={{ padding: '4px 8px', fontSize: '12px' }}
        onClick={() => onEdit(teacher)}
      >
        <FiEdit2 style={{ marginRight: '4px' }} /> Edit
      </Button>
      <Button
        variant="danger"
        style={{ padding: '4px 8px', fontSize: '12px' }}
        onClick={() => onDelete(teacher.id)}
      >
        <FiTrash2 style={{ marginRight: '4px' }} /> Delete
      </Button>
    </div>
  );
};