import React from "react";

const FilterByStatus = ({ status ,handleChangeFilter,filterValue}) => (
  <select onChange={handleChangeFilter} className="form-select" name="status" style={{padding:"8px",borderColor:"#bfbfbf"}}> 
    {status?.map((row, index) => (
      <option key={index} value={row.value} selected={filterValue.status === row.value ? true : false}>{row.title}</option>
    ))}
  </select>
);

export default FilterByStatus;
