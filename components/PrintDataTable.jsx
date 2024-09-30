
const PrintDataTable = ({ currentPage, rowsPerPage, printData, columns }) => {
    const printWindow = window.open('', '', 'width=600,height=600');

    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print Data</title></head><body>');
    printWindow.document.write('<h1>My Data Table</h1>');

    const headers = columns
        .filter((column) => column.name !== 'Action')
        .map((column) => column.name);

    // const pageStartIndex = (currentPage - 1) * rowsPerPage;
    // const pageEndIndex = Math.min(currentPage * rowsPerPage, printData.length);

    printWindow.document.write('<table border="1">');
    printWindow.document.write('<thead><tr>');

    headers.forEach((header) => {
        printWindow.document.write(`<th>${header}</th>`);
    });

    printWindow.document.write('</tr></thead>');
    printWindow.document.write('<tbody>');

    for (let rowIndex = 0; rowIndex < printData.length; rowIndex++) {
        const row = printData[rowIndex];

        printWindow.document.write('<tr>');

        columns.forEach((column) => {
            if (column.name !== 'Action') {
                const cellValue = typeof column.selector === 'function' ? column.selector(row) : row[column.selector];
                printWindow.document.write(`<td>${cellValue}</td>`);
            }
        });

        printWindow.document.write('</tr>');
    }

    printWindow.document.write('</tbody>');
    printWindow.document.write('</table>');


    // Print the total sum
    // printWindow.document.write(`<div>Total Sum on Current Page: ${totalSum.toFixed(2)}</div>`);

    printWindow.document.write('</body></html>');
    printWindow.document.close();

    printWindow.print();
    printWindow.close();
};

export default PrintDataTable;
