
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const PdfDataTable = ({ currentPage, rowsPerPage, pdfData, columns }) => {
    const unit = 'pt';
    const size = 'A4';
    const orientation = 'portrait';

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = 'My Data Table';

    const headers = columns
      .filter((column) => column.name !== 'Action')
      .map((column) => column.name);

    // Get the data for the current page based on the selected rowsPerPage
    // const startRow = (currentPage - 1) * rowsPerPage;
    // const endRow = currentPage * rowsPerPage;

    // const pageData = pdfData.slice(0, rowsPerPage);

    const data = pdfData.map((row) =>
      columns
        .filter((column) => column.name !== 'Action')
        .map((column) =>
          typeof column.selector === 'function' ? column.selector(row) : row[column.selector]
        )
    );

    doc.text(title, marginLeft, 40);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 50,
    });

    doc.save('my-data-table.pdf');
  };


  export default PdfDataTable;