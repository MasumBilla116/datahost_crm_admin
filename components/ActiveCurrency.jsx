import React, { useContext } from 'react'
import themeContext from './context/themeContext';

const ActiveCurrency = () => {
    const context = useContext(themeContext);
    const {golbalCurrency} = context;
    
    
  return (
    // <>{golbalCurrency?? golbalCurrency[0]?.symbol }</>
    <>
    {golbalCurrency && golbalCurrency[0]?.symbol} {" "}
    </>
  )
}

export default ActiveCurrency