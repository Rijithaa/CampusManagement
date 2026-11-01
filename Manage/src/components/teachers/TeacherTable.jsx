import React from 'react';
import { Table } from '../common/Table';
import { TeacherActions } from './TeacherActions';

export const TeacherTable = ({ teachers, onView, onEdit, onDelete }) => {
  const headers = ['S.NO', 'Teacher Name', 'Email', 'Department', 'Subject', 'Actions'];

  const renderRow = (teacher, idx) => (
    <tr key={teacher.id}>
      <td>{idx + 1}</td>
      <td>
        <strong>{teacher.name}</strong>
      </td>
      <td>{teacher.email}</td>
      <td>{teacher.department}</td>
      <td>{teacher.subject}</td>
      <td>
        <TeacherActions teacher={teacher} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );

  return <Table headers={headers} data={teachers} renderRow={renderRow} />;
};