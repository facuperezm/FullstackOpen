import React from "react";

const Filter = ({ showAll, handleFilter }) => {
  return (
    <div>
      filter shown with <input value={showAll} onChange={handleFilter} />
    </div>
  );
};

export default Filter;
