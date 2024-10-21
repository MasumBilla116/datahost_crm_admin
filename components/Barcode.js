import Barcode from 'react-barcode';

function BarcodeGenerator({ value }) {
  return (
    <div>
      <Barcode value={value} height={30} displayValue={true}/>
    </div>
  );
}

export default BarcodeGenerator;
