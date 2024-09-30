import React from 'react'

export default function RadioButton({id,label, ...rest}) {
  return (
    <div className="form-check">
        <input type="radio" className="form-check-input f-20" id={id} {...rest} />
        <label className="form-check-label" htmlFor={id}>{label}</label>
    </div>
  )
}
