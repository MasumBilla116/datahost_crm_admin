



const FilterResetBtn = ({setFilterValue}) =>{
    const resetHandle = (e) =>{
        e.preventDefault();
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth()+1;

        setFilterValue(prev=>({
            ...prev,
            search: '',
            status: "all",
            yearMonth: `${y}-${m}`,
            filter: true,
        }));
    }


    return (<button type='button'  onClick={resetHandle} className='btn  w-100 btn-primary' style={{paddingTop:"7px"}}>Reset</button>)
}



export default FilterResetBtn