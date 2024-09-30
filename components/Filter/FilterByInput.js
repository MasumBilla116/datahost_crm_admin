import React, { useState } from "react";


const FilterByInput = ({placeholderText=null,setFilterValue,filterValue}) =>{

  const [text, setText] = useState(null);

  const searchHandle = (e) => {
    setFilterValue(prev => ({
        ...prev,
        search: text,
        paginate: true,
        filter: true
    }));
}


return<>

<label htmlFor="search">Search</label>
                <div className="input-group mb-3">
                    <input onChange={(e) => setText(e.target.value)} type="text" defaultValue={text} className="form-control" placeholder={placeholderText || 'Name / Room No. / Invoice No.'} style={{ paddingTop: "7px" }} />
                    <button className="btn btn-primary" type="button" id="search-btn" onClick={searchHandle}>Search</button>
                </div>
</>

}




export default FilterByInput;