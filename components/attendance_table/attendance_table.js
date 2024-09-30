// components/AttendanceTable.js
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';


const AttendanceTable = ({columns,rows,pagination=true,searchbar=true,subHeaderComponent = false}) => {
    //  data table
    const [itemList, setItemList] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalSum, setTotalSum] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]); // select rows state 

    // handle select field
    
  const handleRowSelect = (row) => {
    const updatedSelectedRows = [...selectedRows];
    const existingRowIndex = updatedSelectedRows.findIndex(
      (selectedRow) => selectedRow.id === row.id
    );

    if (existingRowIndex !== -1) {
      updatedSelectedRows.splice(existingRowIndex, 1);
    } else {
      updatedSelectedRows.push(row);
    }

    setSelectedRows(updatedSelectedRows);
  };

  const selectableRows = {
    selectAllRows: true,
    selectAllText: 'Select All',
    onClick: (selectedRows, setSelectedRows) => setSelectedRows(selectedRows),
    selectedRows,
  }; 

  return (
  <>  
    <DataTable 
        columns={columns} 
        data={rows} 
        pagination={pagination === true ? true : false }   
        highlightOnHover             
        // subHeader={searchbar===true ? true : false}
        subHeader={true}
        subHeaderComponent={
          <>
            {subHeaderComponent ? subHeaderComponent : null}
            <div>
              <input
                type="text"
                placeholder="search "
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </>
        }
        striped
        paginationPerPageOptions={[10, 25, 50]} 
        paginationRowsPerPage={rowsPerPage} 
        onChangeRowsPerPage={(currentRowsPerPage) => setRowsPerPage(currentRowsPerPage)} 
    />
  </>);
};

export default AttendanceTable;
