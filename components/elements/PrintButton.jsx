    import Button from '@mui/material/Button';
import { FaFilePdf } from 'react-icons/fa';
    const PrintButton = ({ contentId, title='' }) => {
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
        <Button variant='contained' color='success' onClick={handlePrint} > <FaFilePdf />{title !== "" ? title : "Print Invoice"}</Button>

    );
    };

    export default PrintButton;
