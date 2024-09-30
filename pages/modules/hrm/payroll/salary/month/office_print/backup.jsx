import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "react-bootstrap";
import { FaFilePdf } from 'react-icons/fa';
import Axios from '../../../../../../../utils/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const OfficePrice = () => {
  const { http } = Axios();
  const pdfRef = useRef();
  const router = useRouter();
  const { isReady, query: { id } } = router;

  const [tblLoader, setTblLoader] = useState(true);
  const [salaryData, setSalaryData] = useState([]);

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, { action: "getSpecificMonthlySalary", id: id })
      .then((res) => {
        if (isSubscribed) {
          setSalaryData(res?.data?.data);
        }
      });
    setTblLoader(false);
    return () => isSubscribed = false;
  }

  useEffect(() => {
    if (id) {
      fetchItemList();
    }
  }, [id]);

  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const salaryChunks = chunkArray(salaryData, 8);

  const downloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const addPage = (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    };

    const processChunks = (index = 0) => {
      if (index >= salaryChunks.length) {
        pdf.save('monthly_salary_report.pdf');
        return;
      }

      const chunkElement = document.createElement('div');
      chunkElement.style.padding = '20px';
      chunkElement.style.width = '210mm';
      chunkElement.style.height = '297mm';
      chunkElement.innerHTML = `
        <div>
          <div class="row justify-content-around">
            ${salaryChunks[index].map(data => `
              <div class="col-6 mb-4" style="margin-bottom: 30px; margin-top: 30px;">
                <p><strong>Employee Name:</strong> ${data.employee_name}</p>
                <p><strong>Monthly Salary Id:</strong> ${data.monthly_salary_id}</p>
                <p><strong>Department:</strong> ${data.department_name}</p>
                <p><strong>Basic Salary:</strong> ${data.basic_salary}</p>
                <p><strong>Gross Salary:</strong> ${data.gross_salary}</p>
                <p><strong>Addition:</strong> ${data.addition}</p>
                <p><strong>Deduction:</strong> ${data.deduction}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(chunkElement);
      html2canvas(chunkElement).then((canvas) => {
        addPage(canvas);
        document.body.removeChild(chunkElement);
        if (index < salaryChunks.length - 1) {
          pdf.addPage();
        }
        processChunks(index + 1);
      });
    };

    processChunks();
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">Monthly Salary</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  <div className="row w-100">
                    <div className="col-md-6">
                      <select className="form-control" name='department_name'>
                        <option value='all'>All</option>
                      </select>
                    </div>
                    <div className="col-md-3 mr-3">
                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                        block
                        onClick={downloadPDF}
                      >
                        <FaFilePdf /> DOWNLOAD
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body" ref={pdfRef}>
                {salaryChunks.map((chunk, chunkIndex) => (
                  <div key={chunkIndex} className="salary-chunk">
                    <div className="row justify-content-around">
                      {chunk.map((data) => (
                        <div key={data.id} className="col-6 mb-4">
                          <p><strong>Employee Name:</strong> {data.employee_name}</p>
                          <p><strong>Monthly Salary Id:</strong> {data.monthly_salary_id}</p>
                          <p><strong>Department:</strong> {data.department_name}</p>
                          <p><strong>Basic Salary:</strong> {data.basic_salary}</p>
                          <p><strong>Gross Salary:</strong> {data.gross_salary}</p>
                          <p><strong>Addition:</strong> {data.addition}</p>
                          <p><strong>Deduction:</strong> {data.deduction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-break {
          page-break-before: always;
        }
        .salary-chunk {
          padding: 10px;
        }
        .salary-chunk p {
          font-size: 16px;
          margin: 5px 0;
        }
        .salary-chunk strong {
          font-size: 18px;
        }
      `}</style>
    </>
  );
};

export default OfficePrice;
