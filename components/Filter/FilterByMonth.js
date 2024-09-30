import React from "react"
import { allMonthName } from "../../utils/utils"



const FilterByMonth = () =>{ 
    return (<select className='form-control'>
    <option>Search By Month</option>
    {allMonthName.map((data, index) =>
      <option value={index + 1}>{data.month}</option>
    )

    }
  </select>)
}




export default FilterByMonth