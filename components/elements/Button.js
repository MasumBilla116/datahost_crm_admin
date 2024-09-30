import React from 'react';

export default function Button({children, className, ...parm}) {
  return (
    <button type="submit" className={`btn ${className} rounded-pill px-4 waves-effect waves-light`}>
    {children}
  </button>
  )
}
