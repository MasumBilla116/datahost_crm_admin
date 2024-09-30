import DataTable from 'react-data-table-component';
import Pagination from "../pagination/Pagination";
import FilterTblLoader from "./FilterTblLoader";

/**
 * @@ Data table filter with custom pagination @@
 * -----------------------------------------------
 * Must be provide props:
 * ---------------------
 * 1. table loader state value
 * 2. table colums
 * 3. data -> filteredData
 * 4. set current page state
 * 5. current page
 * 6. show per page show items
 * 
*/

const FilterDatatable = ({ tblLoader, columns, filteredData,setFilterValue, setCurrentPage, currentPage, perPageShow }) => {


    return <div className=" position-relative">     
        {tblLoader &&
            <FilterTblLoader />
        }
                   {filteredData && filteredData?.total > 0 ? (
                <>
                    <div className="table-responsive">
                        <DataTable
                            columns={columns}
                            data={filteredData[currentPage] ?? []}
                            highlightOnHover
                            striped
                        />
                    </div>
                    <Pagination
                        setCurrentPage={setCurrentPage}
                        setFilterValue={setFilterValue}
                        currentPage={currentPage}
                        total={filteredData.total}
                        perPage={perPageShow}
                    />
                </>
            ) : (
                <div style={{textAlign: 'center', fontSize: '20px', color: 'gray',height:"50px"}}>There is no data in this month</div>
            )}
    </div>
}




export default FilterDatatable;