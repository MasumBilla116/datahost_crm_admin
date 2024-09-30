    import React from 'react';
    import { FaFilePdf } from 'react-icons/fa';
    import Button from '@mui/material/Button';
    const PrintButton = ({ contentId }) => {
    const handlePrint = () => {
        const printContent = document.getElementById(contentId);
        if (printContent) {
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        } else {
        console.error(`Element with ID '${contentId}' not found.`);
        }
    };

    return (
        // <button onClick={handlePrint}>Print</button>
        <Button variant='contained' color='success' onClick={handlePrint} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Invoice</Button>

    );
    };

    export default PrintButton;
