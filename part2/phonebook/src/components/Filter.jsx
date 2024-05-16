import React from "react";

const Filter = (props) => {
  return (
    <input
      type="text"
      value={props.searchTerm}
      onChange={props.handleSearchChange}
      placeholder="Search by name"
    />
  );
};

export default Filter;
