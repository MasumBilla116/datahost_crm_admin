import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { HeadSection } from "../../../../../../../components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Form, Modal } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa";
import * as CryptoJS from "crypto-js";
import BarcodeWithoutShowNum from "../../../../../../../components/BarcodeWithoutShowNum";
import PrintButton from "../../../../../../../components/elements/PrintButton";

import HotelLogo from "../../../../../../../components/hotelLogo";
import Axios from "../../../../../../../utils/axios";
import moment from "moment";
import { toWords } from 'number-to-words';

const SalaryPaySlip = () => {
    const { http, token, user } = Axios();
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();
    const router = useRouter();
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
    const [invoices, setInvoices] = useState([]);
    const [logoDetails, setLogoDetails] = useState();
    const [netSalaryInWords, setNetSalaryInWords] = useState()


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
                setDeductions(parsedDeductions);
                setAdditions(parsedAdditions);
                const words = toWords(employee?.net_salary);
                setNetSalaryInWords(words)

            } catch (error) {
                console.error("Error parsing deduction data:", error);
            }
        }
    }, [employee]);


    useEffect(() => {
        setIsLoading(true);
        const controller = new AbortController();
        const sectorList = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/users`,
                { action: "getUserInfo" }
            ).then((res) => {
                setUserInfo(res.data.data[0]);
                setIsLoading(false);
            }).catch((error) => {
                console.log('fetching sector list error', error);
            });
        };
        sectorList()
        return () => controller.abort();
    }, [user?.id]);


    const fetchLogoImages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "hotelLogo" });

            setLogoDetails(res.data?.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }, [http]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchLogoImages();
        };
        fetchData();
    }, [user?.id]);

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
            <HeadSection title="Salary Payslip" />

            <div>
                <div className="card shadow pb-5 m-4">
                    <div id="printME" className="p-5">

                        <div className="officeBody">
                            <div>
                                <div className="text-center fs-3">
                                </div>
                                <div className="row small my-2">
                                    <div className="col-sm-6 col-lg-6 col-md-6 my-2 text-capitalize">
                                        {/* <table className="">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '105px' }}>Name</th>
                                                    <th style={{ width: "10px" }}>:</th>
                                                    <td>
                                                        {employee?.employee_name == null ? (
                                                            "NA"
                                                        ) : (
                                                            <>
                                                                {employee?.employee_name}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Designations</th>
                                                    <th>:</th>
                                                    <td> {employee?.designations || "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <th>Month & Year</th>
                                                    <th>:</th>
                                                    <td> {employee?.month_name || "NA"}</td>
                                                </tr>
                                            </tbody>
                                        </table> */}

<style jsx>{`
                                    .table-cell-header {
                                        padding: 9px 10px;
                                    }
                                `}</style>
                                        <table className="table  small mt-4 table-bordered">
                                            <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Emp Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Designations
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Month & Year
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Bank & Branch
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Acc No
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }} > {employee?.employee_name}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{employee?.designations || "NA"}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{employee?.month_name || "NA"}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{`${employee?.bank_name} (${employee?.bank_branch_address}) ` || "NA"}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{`${employee?.bank_acc_number}` || "NA"}</td>
                                                </tr>


                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-center col-sm-2 col-lg-2 col-md-2 my-2">
                                    </div>
                                    <div className="row col-sm-4 col-lg-4 col-md-4 my-2" >
                                        <div className="ms-auto col-sm-8 col-lg-8 col-md-8 text-capitalize" style={{justifyContent:'end',display:'flex'}}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><img
                                                            src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${logoDetails}`}
                                                            alt="Logo"
                                                            style={{ width: '120px', height: '50px' }}
                                                        /></td>
                                                    </tr>
                                                    <tr>
                                                        {/* <td>{userInfo?.company}</td> */}
                                                        <td className='text-uppercase' style={{ textAlign: 'right',fontWeight: 'bold' }} >{userInfo?.company}</td>

                                                    </tr>
                                                    <tr>
                                                        {/* <td>{userInfo?.address}</td> */}
                                                        <td style={{ textAlign: 'right' }} >{userInfo?.address}</td>

                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <style jsx>{`
                                    .table-cell {
                                        padding: 4px 8px;
                                    }
                                `}</style>

                                <table className="table small mt-2 table-bordered">
                                    <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Earning
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Deduction
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-cell">Basic Salary</td>
                                            <td className="table-cell" style={{ textAlign: 'right' }}>{employee?.basic_salary}</td>
                                            <td className="table-cell"></td>
                                            <td className="table-cell"></td>
                                        </tr>
                                        {additions.map((item, index) => (
                                            <tr key={index}>
                                                <td className="table-cell">{item?.name}</td>
                                                <td className="table-cell" style={{ textAlign: 'right' }}>{item?.amount}</td>
                                                {index < deductions.length ? (
                                                    <>
                                                        <td className="table-cell">{deductions[index]?.name}</td>
                                                        <td className="table-cell" style={{ textAlign: 'right' }}>{parseFloat(deductions[index]?.amount).toFixed(2)}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="table-cell"></td>
                                                        <td className="table-cell"></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        {deductions.slice(additions.length).map((item, index) => (
                                            <tr key={index}>
                                                <td className="table-cell"></td>
                                                <td className="table-cell"></td>
                                                <td className="table-cell">{item?.name}</td>
                                                <td className="table-cell" style={{ textAlign: 'right' }}>{parseFloat(item?.amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="table-cell text-uppercase" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                Gross Salary
                                            </td>
                                            <td className="table-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {employee?.gross_salary}
                                            </td>
                                            <td className="table-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}> Total deduction</td>
                                            <td className="table-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}> {employee?.deduction}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="row">
                                    <div className="col-lg-8">
                                        {netSalaryInWords && (<p className="text-capitalize">In Word: {netSalaryInWords} Tk Only</p>
                                        )}
                                    </div>
                                    <div className="table-responsive mt-2 col-lg-4 d-flex justify-content-end">
                                        <table className="">
                                            <tfoot>
                                                <tr>
                                                    <th colSpan={1} className="" >
                                                        Net Salary
                                                    </th>
                                                    <th colSpan={1} className="" >
                                                        :
                                                    </th>
                                                    <th style={{ textAlign: 'right' }}>{employee?.net_salary}</th>
                                                </tr>
                                            </tfoot>
                                        </table>

                                    </div>
                                </div>

                                {/* <div className="row mt-4 d-flex justify-content-between">
                                    <div className="col-lg-4">
                                        <p className="text-capitalize"> <strong>Bank Name:</strong>{employee?.bank_name}</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <p className="text-capitalize"> <strong>Branch Name:</strong>{employee?.bank_branch_address}</p>
                                    </div>
                                    <div className="col-lg-4 position-relative">
                                        <p className="text-capitalize position-absolute top-0 end-0"><strong>Account Number:</strong>{employee?.bank_acc_number}</p>
                                    </div>
                                </div> */}

                                <div className="d-flex justify-content-between mt-1">
                                    <div className="w-25 mt-5">
                                        <p className="text-capitalize">Date: {employee?.generated_date}</p>
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="fw-bolder">
                                            Office Copy
                                        </div>
                                    </div>
                                    <div className="w-25 mt-5">
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="text-center fw-bolder">
                                            For management signature
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderBottom: "2px dashed #c7c7c8", marginTop: '30px',marginBottom:'20px' }}></div>

                        <div className="employeeBody">
                            <div>
                                <div className="text-center fs-3">
                                </div>
                                <div className="row small my-2">
                                    <div className="col-sm-6 col-lg-6 col-md-6 my-2 text-capitalize">
                                        {/* <table className="">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '105px' }}>Name</th>
                                                    <th style={{ width: "10px" }}>:</th>
                                                    <td>
                                                        {employee?.employee_name == null ? (
                                                            "NA"
                                                        ) : (
                                                            <>
                                                                {employee?.employee_name}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Designations</th>
                                                    <th>:</th>
                                                    <td> {employee?.designations || "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <th>Month & Year</th>
                                                    <th>:</th>
                                                    <td> {employee?.month_name || "NA"}</td>
                                                </tr>
                                            </tbody>
                                        </table> */}

<style jsx>{`
                                    .table-cell-header {
                                        padding: 9px 10px;
                                    }
                                `}</style>
                                        <table className="table  small mt-4 table-bordered">
                                            <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Emp Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Designations
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Month & Year
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Bank & Branch
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="font-weight-bold text-uppercase table-cell-header"
                                                        style={{ textAlign: 'center' }}
                                                    >
                                                        Acc No
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }} > {employee?.employee_name}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{employee?.designations || "NA"}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{employee?.month_name || "NA"}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{`${employee?.bank_name} (${employee?.bank_branch_address}) ` || "NA"}</td>
                                                    <td className="table-cell-header" style={{ fontSize: '12px', textAlign: 'center' }}>{`${employee?.bank_acc_number}` || "NA"}</td>
                                                </tr>


                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-center col-sm-2 col-lg-2 col-md-2 my-2">
                                    </div>
                                    <div className="row col-sm-4 col-lg-4 col-md-4 my-2" >
                                        <div className="ms-auto col-sm-8 col-lg-8 col-md-8 text-capitalize" style={{justifyContent:'end',display:'flex'}}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><img
                                                            src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${logoDetails}`}
                                                            alt="Logo"
                                                            style={{ width: '120px', height: '50px' }}
                                                        /></td>
                                                    </tr>
                                                    <tr>
                                                        {/* <td>{userInfo?.company}</td> */}
                                                        <td className='text-uppercase' style={{ textAlign: 'right',fontWeight: 'bold' }} >{userInfo?.company}</td>

                                                    </tr>
                                                    <tr>
                                                        {/* <td>{userInfo?.address}</td> */}
                                                        <td style={{ textAlign: 'right' }} >{userInfo?.address}</td>

                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <style jsx>{`
                                    .table-cell {
                                        padding: 4px 8px;
                                    }
                                `}</style>

                                <table className="table small mt-2 table-bordered">
                                    <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Earning
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Deduction
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase table-cell"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-cell">Basic Salary</td>
                                            <td className="table-cell" style={{ textAlign: 'right' }}>{employee?.basic_salary}</td>
                                            <td className="table-cell"></td>
                                            <td className="table-cell"></td>
                                        </tr>
                                        {additions.map((item, index) => (
                                            <tr key={index}>
                                                <td className="table-cell">{item?.name}</td>
                                                <td className="table-cell" style={{ textAlign: 'right' }}>{item?.amount}</td>
                                                {index < deductions.length ? (
                                                    <>
                                                        <td className="table-cell">{deductions[index]?.name}</td>
                                                        <td className="table-cell" style={{ textAlign: 'right' }}>{parseFloat(deductions[index]?.amount).toFixed(2)}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="table-cell"></td>
                                                        <td className="table-cell"></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        {deductions.slice(additions.length).map((item, index) => (
                                            <tr key={index}>
                                                <td className="table-cell"></td>
                                                <td className="table-cell"></td>
                                                <td className="table-cell">{item?.name}</td>
                                                <td className="table-cell" style={{ textAlign: 'right' }}>{parseFloat(item?.amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="table-cell text-uppercase" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                Gross Salary
                                            </td>
                                            <td className="table-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {employee?.gross_salary}
                                            </td>
                                            <td className="table-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}> Total deduction</td>
                                            <td className="table-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}> {employee?.deduction}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="row">
                                    <div className="col-lg-8">
                                        {netSalaryInWords && (<p className="text-capitalize">In Word: {netSalaryInWords} Tk Only</p>
                                        )}
                                    </div>
                                    <div className="table-responsive  col-lg-4 d-flex justify-content-end">
                                        <table className="">
                                            <tfoot>
                                                <tr>
                                                    <th colSpan={1} className="" >
                                                        Net Salary
                                                    </th>
                                                    <th colSpan={1} className="" >
                                                        :
                                                    </th>
                                                    <th style={{ textAlign: 'right' }}>{employee?.net_salary}</th>
                                                </tr>
                                            </tfoot>
                                        </table>

                                    </div>
                                </div>

                                {/* <div className="row mt-4 d-flex justify-content-between">
                                    <div className="col-lg-4">
                                        <p className="text-capitalize"> <strong>Bank Name:</strong>  DBBL</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <p className="text-capitalize"> <strong>Branch Name:</strong> Dhaka</p>
                                    </div>
                                    <div className="col-lg-4 position-relative">
                                        <p className="text-capitalize position-absolute top-0 end-0"><strong>Account Number:</strong>  12345678</p>
                                    </div>
                                </div> */}

                                <div className="d-flex justify-content-between mt-1">
                                    <div className="w-25 mt-5">
                                        <p className="text-capitalize">Date: {employee?.generated_date}</p>
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="fw-bolder">
                                            Employee Copy
                                        </div>
                                    </div>
                                    <div className="w-25 mt-5">
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="text-center fw-bolder">
                                            For management signature
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row m-0">
                        <div className="col-md-6 col-lg-6">

                        </div>
                        <div className="col-md-6 col-lg-6 text-end">
                            <PrintButton contentId="printME" />
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default SalaryPaySlip;
