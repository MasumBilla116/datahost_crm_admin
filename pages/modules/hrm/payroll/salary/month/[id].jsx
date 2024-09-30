import * as CryptoJS from 'crypto-js';
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Button } from "react-bootstrap";
import { FaFilePdf } from 'react-icons/fa';
import { HeadSection, ViewIcon } from '../../../../../../components';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRouter } from 'next/router';
import Axios from '../../../../../../utils/axios';

const SalaryDetails = () => {

    const { http } = Axios();
    const router = useRouter();
    const {
        isReady,
        query: { id },
    } = router;
    const downloadPDF = async () => {
        const input = tableRef.current;

        // Temporarily hide the action column
        const actionColumns = input.querySelectorAll('.action-column');
        actionColumns.forEach(column => column.style.display = 'none');

        // Generate the PDF
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save('salary.pdf');

        // Show the action column again
        actionColumns.forEach(column => column.style.display = '');
    };



    const tableRef = useRef();

    const [tblLoader, setTblLoader] = useState(true);
    const [salaryData, setSalaryData] = useState([]);
    console.log("salaryData",salaryData)

    const fetchItemList = async () => {
        let isSubscribed = true;
        setTblLoader(true);


        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, { action: "getSpecificMonthlySalary", id: id })
            .then((res) => {
                if (isSubscribed) {
                    setSalaryData(res?.data?.data);
                    // console.log(res?.data?.data)
                }
            });
        setTblLoader(false);
        return () => isSubscribed = false;
    }

    useEffect(() => {
        fetchItemList();

    }, [id]);

    const [departmentList, setDepartmentList] = useState([]);
    const [formData, setFormData] = useState({
        department_id: null,
        department_name: 'all',
    })



    const getDepartment = async () => {
        let isSubscribed = true;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, { action: "getAllDepartments", })
            .then((res) => {
                if (isSubscribed) {
                    setDepartmentList(res?.data?.data)

                }
            });

        return () => isSubscribed = false;
    }
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        getDepartment();

    }, []);

    const totalBasicSalary = salaryData?.reduce((sum, data) => sum + data.basic_salary, 0);
    const totalAllowance = salaryData?.reduce((sum, data) => sum + data.allowance, 0);
    const totalGrossSalary = salaryData?.reduce((sum, data) => sum + data.gross_salary, 0);
    const totalDeduction = salaryData?.reduce((sum, data) => sum + data.deduction, 0);
    const totalNetSalary = salaryData?.reduce((sum, data) => sum + data.net_salary, 0);
    const totalAddition = salaryData?.reduce((sum, data) => sum + (data.addition || 0), 0);
    const actionButton = (id) => {
        const key = '123';
        const passphrase = `${id}`;
        const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();

        const ids = encrypted.replace(/\//g, '--');
        return (
            <ul className="action list-unstyled mb-0 d-flex justify-content-end">
                <li className="mr-2">
                    <Link href={`/modules/hrm/payroll/salary/month/${ids}`}>
                        <a><ViewIcon /></a>
                    </Link>
                </li>

            </ul>
        );
    };
    return (
        <>
            <HeadSection title="Monthly Salary" />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 p-xs-2">
                        <div className="card shadow">
                            <div className="d-flex border-bottom title-part-padding align-items-center">
                                <div>
                                    <h4 className="card-title mb-0">Monthly Salary</h4>
                                </div>
                                <div className="ms-auto flex-shrink-0">

                                    <div className="d-flex justify-content-end">
                                       
                                            <select
                                                className="form-control mr-2"
                                                onChange={handleChange}
                                                value={formData?.department_name}
                                                name='department_name'
                                            >
                                                <option value='all'>All</option>
                                                {departmentList &&
                                                    departmentList.map((department, index) => (
                                                        <Fragment key={index}>
                                                            <option value={department?.name}>
                                                                {department?.name}
                                                            </option>
                                                        </Fragment>
                                                    ))}
                                            </select>
                                       
                                        
                                            
                                            <Button
                                                className="shadow rounded btn-sm mr-2"
                                                variant="primary"
                                                type="button"
                                                block
                                                onClick={downloadPDF}
                                            >
                                                <FaFilePdf /> DOWNLOAD PAYSLIP
                                            </Button>

                                            <Link href={`/modules/hrm/payroll/salary/month/office_print_all_emp/${id}`}>
                                            <Button
                                                className="shadow rounded btn-sm "
                                                variant="primary"
                                                type="button"
                                                block
                                            >
                                                Office Print
                                            </Button>
                                            </Link>
                                        
                                    </div>

                                </div>
                            </div>
                            <div className="card-body" ref={tableRef}>
                                <table className="table table-striped small">
                                    <thead style={{ backgroundColor: 'rgb(234, 238, 251)' }}>
                                        <tr>
                                            <th scope="col" className="font-weight-bold text-uppercase">SL No</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Employee Name</th>
                                            <th scope="col" className="font-weight-bold text-uppercase">Department</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-end">Basic Salary</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-end">Addition</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-end">Gross Salary</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-end">Deduction</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-end">Net Salary</th>
                                            <th scope="col" className="font-weight-bold text-uppercase text-end action-column">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salaryData?.map((data, index) => {
                                            const grossSalary = data.basic_salary + data.allowance;
                                            const netSalary = grossSalary - data.deduction;
                                            const addition = data.Addition || 0;

                                            return (
                                                <tr key={data.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{data.employee_name}</td>
                                                    <td>{data.department_name}</td>
                                                    <td className="text-end">{data.basic_salary}</td>
                                                    <td className="text-end">{data?.addition}</td>
                                                    <td className="text-end">{data?.gross_salary}</td>
                                                    <td className="text-end">{data?.deduction}</td>
                                                    <td className="text-end">{data?.net_salary}</td>
                                                    <td className="text-end action-column">
                                                        <Link href={`/modules/hrm/payroll/salary_pay_slip/${data.employee_id}?date=${data.monthly_salary_id}`}>
                                                            <a><ViewIcon /></a>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <th scope="row" colSpan="3" className="text-end font-weight-bold">Total = </th>
                                            <td className="text-end font-weight-bold">{totalBasicSalary}</td>
                                            <td className="text-end font-weight-bold">{totalAddition}</td>
                                            <td className="text-end font-weight-bold">{totalGrossSalary}</td>
                                            <td className="text-end font-weight-bold">{totalDeduction}</td>
                                            <td className="text-end font-weight-bold">{totalNetSalary}</td>
                                            <td className="text-end font-weight-bold action-column"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default SalaryDetails