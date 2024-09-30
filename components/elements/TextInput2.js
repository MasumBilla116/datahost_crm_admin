import React from 'react';

export default function TextInput2({type,placeholder,...rest}) {
  return (
    <>
        <div className="mb-3 row">
            {/* <label className="col-md-2 col-form-label ">{label}</label> */}
            <div className="col-md-8">

                <input type={type} placeholder={placeholder} className="form-control" {...rest}/>
              
            </div>

        </div>
    </>
  )
}
