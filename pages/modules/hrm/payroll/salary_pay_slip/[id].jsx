import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { HeadSection } from "../../../../../components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Form, Modal } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa";
import * as CryptoJS from "crypto-js";
import Axios from "../../../../../utils/axios";
import BarcodeWithoutShowNum from "../../../../../components/BarcodeWithoutShowNum";
import HotelLogo from "../../../../../components/hotelLogo";
import Link from "next/link";
import ActiveCurrency from "../../../../../components/ActiveCurrency";
const SalaryPaySlip = () => {
    const { http } = Axios();
    const router = useRouter();
    // const { id, date } = router.query;
    const {
        isReady,
        query: { id, date },
    } = router;
    const tableRef = useRef();

    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState(true);
    const [deductionData, setDeductionData] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [additions, setAdditions] = useState([]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        const employeeDetails = async () => {
            await http
                .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, {
                    action: "getPayslipInfo",
                    emp_id: id,
                    date: date,
                }, { signal: controller.signal })
                .then((res) => {
                    const employeeData = res.data.data[0];
                    setEmployee(employeeData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("fetching sector list error", error);
                });
        };
        employeeDetails();
        return () => controller.abort();
    }, [id, date]);

    useEffect(() => {
        if (employee?.deduction_data) {
            try {
                const parsedDeductions = JSON.parse(employee.deduction_data);
                const parsedAdditions = JSON.parse(employee.addition_data);
                console.log(parsedDeductions);
                setDeductions(parsedDeductions);
                setAdditions(parsedAdditions);
            } catch (error) {
                console.error("Error parsing deduction data:", error);
            }
        }
    }, [employee]);



    const downloadPDF = async () => {
        const input = tableRef.current;
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("PAYSLIP.pdf");
    };
    return (
        <>
            <HeadSection title="Salary Pay Slip" />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 p-xs-2">
                        <div className="card shadow">
                            <div className="d-flex border-bottom title-part-padding align-items-center">
                                <div>
                                    <h4 className="card-title mb-0">Salary Pay Slip</h4>
                                </div>
                                <div className="ms-auto flex-shrink-0">
                                    
                                        <div className="d-flex justify-content-end">
                                        <Button
                                                className="shadow rounded btn-sm mr-2"
                                                variant="primary"
                                                type="button"
                                                block
                                                onClick={downloadPDF}
                                            >
                                                <FaFilePdf /> DOWNLOAD PAYSLIP
                                            </Button>
                                            <Link href={`/modules/hrm/payroll/salary/month/office_print/${id}?date=${date}`}>
                                            <Button
                                                className="shadow rounded btn-sm"
                                                variant="primary"
                                                type="button"
                                                block
                                                // onClick={downloadPDF}
                                            >
                                                Office Print
                                            </Button>
                                            </Link>
                                        </div>
                                </div>
                            </div>
                            <div className="" style={{ padding: '20px 220px' }}>

                                <div className="card-body " ref={tableRef}  >
                                  
                                    <div className='text-center fs-3'>
                                        <HotelLogo id={employee?.id} invoiceName="PAYSLIP" />
                                    </div>
                                    <div className='row small'>
                                        <div className='col-sm-4 col-lg-4 col-md-4 my-2 '>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: "60px", fontSize: '15px' }}>Name</th>
                                                        <th style={{ width: "10px", fontSize: '15px' }}>:</th>
                                                        <td style={{ fontSize: '15px', fontWeight: 'bold' }}>{employee?.employee_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ fontSize: '15px' }}>Email</th>
                                                        <th >:</th>
                                                        <td style={{ fontSize: '15px', fontWeight: 'bold' }}>{employee?.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ fontSize: '15px' }}>Phone</th>
                                                        <th>:</th>
                                                        <td style={{ fontSize: '15px', fontWeight: 'bold' }}>{employee?.mobile}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ fontSize: '15px' }}>Address</th>
                                                        <th>:</th>
                                                        <td style={{ fontSize: '15px', fontWeight: 'bold' }}>{employee?.address}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                                            <BarcodeWithoutShowNum value={employee?.id} />

                                        </div>
                                        <div className='col-sm-4 col-lg-4 col-md-4 my-2 '>
                                            <table className="table table-striped small table-bordered">
                                                <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>

                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="font-weight-bold text-uppercase"
                                                            style={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                                                        >
                                                            DATE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="font-weight-bold text-uppercase"
                                                            style={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                                                        >
                                                            PAY TYPE
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="font-weight-bold text-uppercase"
                                                            style={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                                                        >
                                                            PAYSLIP ID
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-uppercase" style={{ fontSize: '12px', textAlign: 'center' }}>{employee?.month_name}</td>
                                                        <td className="text-uppercase" style={{ fontSize: '12px', textAlign: 'center' }}>{employee?.salary_type ?? "MONTHLY"}</td>
                                                        <td style={{ fontSize: '12px', textAlign: 'center' }}>{employee?.id}</td>
                                                    </tr>


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <table className="table small mt-4 table-bordered">
                                        <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="font-weight-bold text-uppercase"
                                                    style={{ textAlign: 'center' }}
                                                >
                                                    Earning
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="font-weight-bold text-uppercase"
                                                    style={{ textAlign: 'center' }}
                                                >
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '50%', }}>Basic Salary</td>
                                                <td style={{ textAlign: 'right' }}><ActiveCurrency />{employee?.basic_salary}  </td>
                                            </tr>
                                            {additions.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ width: '50%' }}>{item?.name}</td>
                                                    <td style={{ textAlign: 'right' }}><ActiveCurrency />{item?.amount}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className=" text-uppercase" style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>Gross Salary</td>
                                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}><ActiveCurrency />{employee?.gross_salary}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="table  small mt-4 table-bordered">
                                        <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="font-weight-bold text-uppercase"
                                                    style={{ textAlign: 'center' }}
                                                >
                                                    Deduction Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="font-weight-bold text-uppercase"
                                                    style={{ textAlign: 'center' }}
                                                >
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deductions.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ width: '50%' }}>{item?.name}</td>
                                                    <td style={{ textAlign: 'right' }} ><ActiveCurrency />{parseFloat(item?.amount).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className=" text-uppercase" style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>Total deduction</td>
                                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}><ActiveCurrency />{employee?.deduction}</td>
                                            </tr>
                                            {/* deduction */}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <div className="col-6">

                                        </div>
                                        <div className="col-6">
                                            <table className="table table-striped small mt-4 table-bordered">

                                                <tbody>
                                                    <tr>
                                                        <td className=" text-uppercase" style={{ width: '50%', fontWeight: 'bold', fontSize: '15px' }}>Net Salary</td>
                                                        <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '15px' }}><ActiveCurrency />{employee?.net_salary}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalaryPaySlip;
