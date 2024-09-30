import React from 'react'

export default function Select({children, ...rest}) {
  return (
    <select className="form-control " {...rest}>
        {children}
    </select>
  )
}
