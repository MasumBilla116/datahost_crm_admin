import React from 'react';
import Barcode from 'react-barcode';

function BarcodeGenerator({ value }) {
  return (
    <div>
      <Barcode value={value} height={45} displayValue={true}/>
    </div>
  );
}

export default BarcodeGenerator;
