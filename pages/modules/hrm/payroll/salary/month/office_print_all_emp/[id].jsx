import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import Axios from "../../../../../../../utils/axios";
import { useRouter } from 'next/router';
import { Button } from "react-bootstrap";
import Link from "next/link";
import { HeadSection } from "../../../../../../../components";
import { FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toWords } from 'number-to-words';

const AllEmpPrint = () => {
    const { http, token, user } = Axios();
    console.log('user', user)
    const router = useRouter();

    const {
        isReady,
        query: { id },
    } = router;
    const [tblLoader, setTblLoader] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [salaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deductionData, setDeductionData] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [additions, setAdditions] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [logoDetails, setLogoDetails] = useState();
    const [netSalaryInWords, setNetSalaryInWords] = useState()
    const [userInfo, setUserInfo] = useState();
    const tableRef = useRef();
    console.log("salaryData", salaryData);

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
        fetchItemList();
    }, [id]);


    useEffect(() => {
        if (salaryData?.employee?.deduction_data) {
            try {
                const parsedDeductions = JSON.parse(salaryData?.employee.deduction_data);
                const parsedAdditions = JSON.parse(salaryData?.employee.addition_data);
                setDeductions(parsedDeductions);
                setAdditions(parsedAdditions);
                const words = toWords(employee?.net_salary);
                setNetSalaryInWords(words)

            } catch (error) {
                console.error("Error parsing deduction data:", error);
            }
        }
    }, [salaryData]);

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

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };
    
    const downloadPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
    
        for (let i = 0; i < salaryData.length; i++) {
            const employeeContent = document.getElementById(`employee-${i}`);
    
            if (employeeContent) {
                try {
                    // Load all images within the employeeContent
                    const images = Array.from(employeeContent.getElementsByTagName('img'));
                    const loadImagesPromises = images.map(img => loadImage(img.src));
                    await Promise.all(loadImagesPromises);
    
                    const canvas = await html2canvas(employeeContent, {
                        scale: 2,
                        useCORS: true,
                        logging: true
                    });
    
                    const imgData = canvas.toDataURL('image/png');
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;
    
                    // Add first page
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
    
                    // Add additional pages if needed
                    while (heightLeft > 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
    
                    // Add a new page for the next employee, if not the last one
                    if (i < salaryData.length - 1) {
                        pdf.addPage();
                    }
                } catch (error) {
                    console.error("Error generating PDF for employee", i, error);
                }
            } else {
                console.warn(`Element #employee-${i} not found`);
            }
        }
    
        pdf.save('salary.pdf');
    };
    




    return (
        <div>
            <HeadSection title="Employees Payslip" />

            <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                    <h4 className="card-title mb-0">Monthly Salary</h4>
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
                            <FaFilePdf />  DOWNLOAD PAYSLIP
                        </Button>



                    </div>

                </div>
            </div>


            {salaryData?.map((employee, empIndex) => (

                // <div className="card shadow pb-5 m-4">
                <div key={empIndex} id={`employee-${empIndex}`} className="card shadow pb-3 m-3">

                    <div id="printME" className="p-5">
                        <div className="officeBody">
                            <div>
                                <div className="text-center fs-3">
                                </div>
                                <div className="row small my-2">
                                    <div className="col-sm-6 col-lg-6 col-md-6 my-2 text-capitalize">



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
                                    <div className="row col-sm-4 col-lg-4 col-md-4 my-2">
                                        <div className="ms-auto col-sm-8 col-lg-8 col-md-8 text-capitalize d-flex justify-content-end">

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
                                                        <td className='text-uppercase' style={{ textAlign: 'right' ,fontWeight: 'bold' }} >{userInfo?.company}</td>
                                                    </tr>
                                                    <tr>
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
                                        {JSON.parse(employee?.addition_data).map((item, index) => (
                                            <tr key={index}>
                                                <td className="table-cell">{item?.name}</td>
                                                <td className="table-cell" style={{ textAlign: 'right' }}>{item?.amount}</td>
                                                {index < JSON.parse(employee?.deduction_data?.length) ? (
                                                    <>
                                                        <td className="table-cell">{JSON.parse(employee?.deduction_data)[index]?.name}</td>
                                                        <td className="table-cell" style={{ textAlign: 'right' }}>{parseFloat(JSON.parse(employee?.deduction_data)[index]?.amount).toFixed(2)}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="table-cell"></td>
                                                        <td className="table-cell"></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        {JSON.parse(employee.deduction_data).slice(JSON.parse(employee?.addition_data).length).map((item, index) => (
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
                                        {employee?.net_salary && (<p className="text-capitalize"> <span style={{ fontWeight: 'bold' }}> In Word: </span>  {toWords(employee?.net_salary)} Tk Only</p>
                                        )}
                                    </div>
                                    <div className="table-responsive col-lg-4 d-flex justify-content-end">
                                        <table className="">
                                            <tfoot>
                                                <tr>
                                                    <th colSpan={1} className="" >
                                                        Net Salary
                                                    </th>
                                                    <th colSpan={1} className="" >
                                                        :
                                                    </th>
                                                    <th style={{ textAlign: 'right', }}>{employee?.net_salary}</th>
                                                </tr>
                                            </tfoot>
                                        </table>

                                    </div>
                                </div>



                                <div className="d-flex justify-content-between mt-1">
                                    <div style={{ marginTop: '60px' }} className="w-25">
                                        <div>
                                            {/* <hr /> */}
                                        </div>
                                        <div className="fw-bolder ">
                                            Office Copy
                                        </div>
                                        <p className="text-capitalize" style={{ fontSize: '12px' }}>Generate Date: {employee?.generated_date}</p>
                                    </div>
                                    <div className="w-25 mt-5">
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="text-center text-capitalize fw-bolder">
                                            employee signature
                                        </div>
                                    </div>
                                    <div className="w-25 mt-5">
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="text-center text-capitalize fw-bolder">
                                            authorized person signature
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderBottom: "2px dashed #c7c7c8", marginTop: '35px', marginBottom: '30px' }}></div>
                        {/* <hr /> */}
                        <div className="employee">
                            <div>
                                <div className="text-center fs-3">
                                </div>
                                <div className="row small my-2">
                                    <div className="col-sm-6 col-lg-6 col-md-6 my-2 text-capitalize">
                                        {/* <table className="">
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '105px' }}>Emp Name</th>
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
                                                <tr>
                                                    <th>Bank & Branch</th>
                                                    <th>:</th>
                                                    <td> {`${employee?.bank_name} (${employee?.bank_branch_address}) ` || "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <th>Acc No:</th>
                                                    <th>:</th>
                                                    <td> {`${employee?.bank_acc_number}` || "NA"}</td>
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
                                    <div className="row col-sm-4 col-lg-4 col-md-4 my-2">
                                        <div className="ms-auto col-sm-8 col-lg-8 col-md-8 text-capitalize d-flex justify-content-end">

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
                                                        <td className='text-uppercase' style={{ textAlign: 'right',fontWeight: 'bold' }} >{userInfo?.company}</td>
                                                    </tr>
                                                    <tr>
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
                                        {JSON.parse(employee?.addition_data).map((item, index) => (
                                            <tr key={index}>
                                                <td className="table-cell">{item?.name}</td>
                                                <td className="table-cell" style={{ textAlign: 'right' }}>{item?.amount}</td>
                                                {index < JSON.parse(employee?.deduction_data?.length) ? (
                                                    <>
                                                        <td className="table-cell">{JSON.parse(employee?.deduction_data)[index]?.name}</td>
                                                        <td className="table-cell" style={{ textAlign: 'right' }}>{parseFloat(JSON.parse(employee?.deduction_data)[index]?.amount).toFixed(2)}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="table-cell"></td>
                                                        <td className="table-cell"></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        {JSON.parse(employee.deduction_data).slice(JSON.parse(employee?.addition_data).length).map((item, index) => (
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
                                        {employee?.net_salary && (<p className="text-capitalize"> <span style={{ fontWeight: 'bold' }}> In Word: </span>  {toWords(employee?.net_salary)} Tk Only</p>
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


                                <div className="d-flex justify-content-between mt-1">
                                    <div style={{ marginTop: '60px' }} className="w-25">
                                        <div>
                                            {/* <hr /> */}
                                        </div>
                                        <div className="fw-bolder ">
                                            Employee Copy
                                        </div>
                                        <p className="text-capitalize" style={{ fontSize: '12px' }}>Generate Date: {employee?.generated_date}</p>
                                    </div>
                                    <div className="w-25 mt-5">
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="text-center text-capitalize fw-bolder">
                                            employee signature
                                        </div>
                                    </div>
                                    <div className="w-25 mt-5">
                                        <div>
                                            <hr />
                                        </div>
                                        <div className="text-center text-capitalize fw-bolder">
                                            authorized person signature
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default AllEmpPrint