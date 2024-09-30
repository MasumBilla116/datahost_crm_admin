import React from 'react'

const ResetBtn = () => {
    const resetHandle = (e) => {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        setEndDate(`${y}-${m}-01`)
        setText(null);
        setFilterValue(prev => ({
            ...prev,
            search: '',
            status: "all",
            yearMonth: `${y}-${m}`,
            filter: true,
        }));
    }
    return (
        <div className="position-ralative">
            <label htmlFor="reset" className="d-xs-none">&nbsp;</label>
            <button type='reset' onClick={resetHandle} className='btn  w-100 btn-primary horizontal-devider' style={{ paddingTop: "7px" }}>Reset</button>
        </div>
    )
}

export default ResetBtn