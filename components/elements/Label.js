import React from 'react'

export default function Label({text, ...rest}) {
  return (
    <>
    <label className="col-md-2  col-form-label " {...rest}>{text}</label>
    </>
  )
}
