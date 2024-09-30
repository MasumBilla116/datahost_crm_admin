import PdfDataTable from "../../components/PdfDataTable";
import PrintDataTable from "../../components/PrintDataTable";

const PDFAndPrintBtn = ({currentPage, rowsPerPage, data, columns,position}) => {
    const generatePDF = () => {        
        if(data?.length > 0)
        {
            const pdfData = data;
            PdfDataTable({ currentPage, rowsPerPage, pdfData, columns });
        }
      };    
      const printData = () => {
        if(data?.length > 0)
        {
            const printData = data;
            PrintDataTable({ currentPage, rowsPerPage, printData, columns });
        }
      };    
    return (
        <div className={`pdf-and-print-btn ${position ? 'position-absolute' : ''}`}  >
            <div
                    className=""
                    onClick={generatePDF}
                    style={{cursor:"pointer",color:"red"}}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 700 700" 
                    >
                    <path 
                    fill="#616467"
                    d="M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" />
                    </svg>
                </div>
                <div className="devider"></div>
                <div
                    className=""
                    onClick={printData}
                    style={{cursor:"pointer",color:"red"}}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 700 700" 
                    >
                    <path fill="#616467" d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                    </svg>
                </div>
        </div>

    )
}





export default PDFAndPrintBtn;