import React from 'react';

export default function Form({children, ...rest}) {
  return (
    <>
    <form className="form-horizontal" {...rest}>
        {children}
    </form>
    </>
  )
}
