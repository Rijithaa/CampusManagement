import React from 'react';
import { FiSearch } from 'react-icons/fi';

export const SearchBar = ({ value, onChange, placeholder = 'Search by name or email...' }) => {
  return (
    <div className="search-wrapper">
      <FiSearch className="search-icon"/>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
};