import React from 'react';
import Barcode from 'react-barcode';

function BarcodeWithoutShowNum({ value }) {
  return (
    <div>
      <Barcode value={value} height={45} displayValue={false}/>
    </div>
  );
}

export default BarcodeWithoutShowNum;
