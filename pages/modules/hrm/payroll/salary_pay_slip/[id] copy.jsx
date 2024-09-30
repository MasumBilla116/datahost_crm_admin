import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { HeadSection } from "../../../../../components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Form, Modal } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa";
import * as CryptoJS from "crypto-js";
import Axios from "../../../../../utils/axios";
const SalaryPaySlip = () => {
    const { http } = Axios();
    const router = useRouter();
    // const { id, date } = router.query;
    const {
        isReady,
        query: { id, date },
    } = router;
    console.log(id, date);
    const tableRef = useRef();

    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState(true);
    const [deductionData, setDeductionData] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [additions, setAdditions] = useState([]);

    console.log("employee", employee);
    console.log("additions", additions);


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
                    const employeeData = res.data.data[0]; // Access the first element of the array
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
        if (employee.deduction_data) {
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

    const tableData = [
        {
            key: "Position",
            value1: "Team Lead",
            key2: "From",
            value2: "1-May-2022",
        },
        { key: "Contact", value1: "097326121", key2: "To", value2: "31-May-2022" },
        { key: "Address", value1: "", key2: "", value2: "" },
        {
            key: "Recruitment date",
            value1: "01-June-2022",
            key2: "Worked Days",
            value2: "31",
        },
        { key: "Staff ID No.", value1: "2", key2: "", value2: "" },
        { key: "Seniority (yrs)", value1: "2.0", key2: "", value2: "" },
    ];
    const [tableData2, setTableData2] = useState([
        {
            description: "Basic Salary",
            grossAmount: "$ 500.00",
            rate: "",
            value: "$ 0.00",
            deduction: "",
        },
        {
            description: "Transport allowance",
            grossAmount: "$ 300.00",
            rate: "",
            value: "$ 0.00",
            deduction: "",
        },
        {
            description: "Total Benefit",
            grossAmount: "",
            rate: "",
            value: "$ 130",
            deduction: "",
        },
        {
            description: "Overtime",
            grossAmount: "",
            rate: "",
            value: "",
            deduction: "",
        },
        {
            description: "Gross Salary",
            grossAmount: "",
            rate: "",
            value: "$ 130",
            deduction: "",
        },
        {
            description: "State Income Tax",
            grossAmount: "",
            rate: "",
            value: "",
            deduction: "$ 0.00",
        },
        {
            description: "Social Security",
            grossAmount: "",
            rate: "5%",
            value: "",
            deduction: "$ 0.00",
        },
        {
            description: "Loan Deduction",
            grossAmount: "",
            rate: "",
            value: "",
            deduction: "$ 0.00",
        },
        {
            description: "Salary Advance",
            grossAmount: "",
            rate: "",
            value: "",
            deduction: "$ 0.00",
        },
        {
            description: "Total Deductions",
            grossAmount: "",
            rate: "",
            value: "",
            deduction: "$ 0.00",
        },
    ]);

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
        // <div>SalaryPaySlip : {id}</div>

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
                                    <div className="row w-100">
                                        <div className="col-md-3">
                                            <Button
                                                className="shadow rounded btn-sm"
                                                variant="primary"
                                                type="button"
                                                block
                                                onClick={downloadPDF}
                                            >
                                                <FaFilePdf /> DOWNLOAD PAYSLIP
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body " ref={tableRef}>
                                <div
                                    className="p-2 text-center"
                                    style={{ backgroundColor: "rgb(234, 238, 251)" }}
                                >
                                    <h6 className="font-weight-bold text-uppercase m-0">
                                        PAYSLIP
                                    </h6>
                                </div>


                                <table className="table table-striped small mt-4 table-bordered">
                                    <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                Earning
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '50%' }}>Basic Salary</td>
                                            <td>{employee.basic_salary}</td>
                                        </tr>
                                        {additions.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ width: '50%' }}>{item.name}</td>
                                                <td>{item.amount}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={{ width: '50%' }}>Gross Salary</td>
                                            <td>{employee.gross_salary}</td>
                                        </tr>
                                    </tbody>
                                </table>


                                <table className="table table-striped small mt-4 table-bordered">
                                    <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                Deduction Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deductions.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ width: '50%' }}>{item.name}</td>
                                                <td >{item.amount}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={{ width: '50%' }}>Total deduction</td>
                                            <td>{employee.deduction}</td>
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
                                            <td style={{ width: '50%' }}>Net Salary</td>
                                            <td>{employee.net_salary}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                    </div>
                                </div>


                                <table className="table table-striped small mt-4 table-bordered">
                                    <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                Employee Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                Roberts Brown
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                Month
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase"
                                            >
                                                May
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.key}</td>
                                                <td>{row.value1}</td>
                                                <td>{row.key2}</td>
                                                <td>{row.value2}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <table className="table table-striped small mt-4 table-bordered">
                                    <thead style={{ backgroundColor: "rgb(234, 238, 251)" }}>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase col-3"
                                            >
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase col-3"
                                            >
                                                Gross Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase col-1"
                                            >
                                                Rate
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase col-2"
                                            >
                                                VALUE
                                            </th>
                                            <th
                                                scope="col"
                                                className="font-weight-bold text-uppercase col-2"
                                            >
                                                Deduction
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData2.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.description}</td>
                                                <td>{row.grossAmount}</td>
                                                <td>{row.rate}</td>
                                                <td>{row.value}</td>
                                                <td>{row.deduction}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td colSpan="5"></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Total Social Security</td>
                                            <td>$ 0</td>
                                        </tr>

                                        <tr>
                                            <td colSpan="4">NET SALARY </td>
                                            <td>$ 130.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalaryPaySlip;
