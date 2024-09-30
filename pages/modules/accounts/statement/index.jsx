import MyToast from "@mdrakibul8001/toastify";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import Link from "next/link";
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Form, Modal, Button } from "react-bootstrap";
import { FaEdit, FaFilePdf, FaMoneyBillWave, FaPhone } from 'react-icons/fa';
import BarcodeGenerator from "../../../../components/Barcode";
import PropagateLoading from '../../../../components/PropagateLoading';
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import Select2 from "../../../../components/elements/Select2";
import { decrypt } from "../../../../components/helpers/helper";
import Axios from '../../../../utils/axios';
import HotelLogo from "../../../../components/hotelLogo";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { TextField } from '@mui/material';

const Statement = () => {


    //start date and end date
    const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
    const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
    const [start_date, set_start_date] = useState(null);
    const [end_date, set_end_date] = useState(null);
    //  start_date,end_date
    const [totalCredit, setTotalCredit] = useState('');
    const [totalDebit, setTotalDebit] = useState('');
    const [incomeList,setIncomeList] = useState([]);
    const [expenseList,setExpenseList] = useState([]);
    const [totalIncome,setTotalIncome] = useState(null);
    const [totalExpense,setTotalExpense] = useState(null);

    const { http } = Axios();


    React.useEffect(() => {
        const timeout = setTimeout(() => {
            fetchItemList();
        });
        return () => clearTimeout(timeout);
    }, []);

    //Fetch List Data for datatable

    const fetchItemList = async () => {

        let isSubscribed = true;
        let formData = {
            action: "profitLoss",

        }
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, formData)
            .then((res) => {
                if (isSubscribed) {
                    setExpenseList( res?.data?.data?.expense);
                    setIncomeList( res?.data?.data?.income);
                    setTotalIncome( res?.data?.data?.incomeTotal);
                    setTotalExpense( res?.data?.data?.expenseTotal);

                }
            })
            .catch((err) => {
                console.log("Server Error ~!")
            });

        return () => isSubscribed = false;
    };

    const theme = createTheme({

        components: {
            MuiFormLabel: {
                styleOverrides: {
                    asterisk: { color: "red" },
                },
            },
        },

    });


    const handleDownloadPdf = async () => {
        const element = document.getElementById('printME');
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        const marginTop = 15; // Adjust this value to set the desired top margin

        pdf.addImage(data, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
        // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('ledger.pdf');
    };


    return (
        <>
            <div className="container-fluid ">

                <div className="row mt-5">
                    <div className="col-12">

                        <div className='card shadow'>

                            <div className='card-body'>
                                <div className="row mb-3">
                                    <div className="col-md-2">
                                        <label className="col-form-label ">Start Date:</label>
                                        {/* <input type="date" name="start_date" onChange={handleChange } className="form-control" id="start_date" /> */}
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker

                                                size={1}
                                                label="From"
                                                open={dobOpenStartDate}
                                                onClose={() => setDobOpenStartDate(false)}
                                                value={start_date}
                                                inputFormat="yyyy-MM-dd"
                                                onChange={(event) => {
                                                    set_start_date(format(new Date(event), 'yyyy-MM-dd'));
                                                }}


                                                // variant="inline"
                                                // openTo="year"
                                                // views={["year", "month", "day"]}

                                                renderInput={(params) =>
                                                    <ThemeProvider theme={theme}>
                                                        <TextField onClick={() => setDobOpenStartDate(true)} fullWidth={true} size='small' {...params} required />
                                                    </ThemeProvider>
                                                }
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="col-form-label ">End Date:</label>
                                        {/* <input type="date" name="end_date" readOnly={(ledgerFilter.start_date == null) ? true: false} onChange={handleChange } className="form-control" id="end_date" /> */}
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker

                                                size={1}
                                                label="To"
                                                open={dobOpenEndDate}
                                                onClose={() => setDobOpenEndDate(false)}
                                                value={end_date}
                                                inputFormat="yyyy-MM-dd"
                                                onChange={(event) => {
                                                    set_end_date(format(new Date(event), 'yyyy-MM-dd'));
                                                }}


                                                // variant="inline"
                                                // openTo="year"
                                                // views={["year", "month", "day"]}

                                                renderInput={(params) =>
                                                    <ThemeProvider theme={theme}>
                                                        <TextField onClick={() => setDobOpenEndDate(true)} fullWidth={true} size='small' {...params} required />
                                                    </ThemeProvider>
                                                }
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>

                                <hr />
                                <div id="printME">
                                    <div className=' mt-5' style={{ margin: '10px', padding: '5px' }}>

                                        <div className=''>
                                            <div className='text-center fs-3'>


                                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}><span >HOTEL PROFIT AND LOSS STATEMENT</span></div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 text-right">
                                                    <p style={{ fontSize: '25px' }}>PROFIT & LOSS STATEMENT</p>
                                                </div>
                                            </div>

                                            <div>
                                                <hr></hr>
                                            </div>

                                        </div>

                                        <div className='table-responsive mt-5'>
                                            <h5 className='mb-2'><u>Hotel Info</u></h5>
                                            <table className="table table-bordered text-center">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" style={{ width: '60%' }}>Hotel Name</th>
                                                        <th scope="col">Start Date</th>
                                                        <th scope="col">End Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td scope="row">
                                                            Deluxe Double bed
                                                        </td>
                                                        <td>2022-12-26</td>
                                                        <td>2022-12-28</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <h5 className='mb-2'><u>Prepared By</u></h5>

                                                <table className="table table-bordered text-center">

                                                    <thead>
                                                        <tr>
                                                            <th scope="col" style={{ width: '30%' }}>Prepared By</th>
                                                            <th scope="col">Date</th>
                                                            <th scope="col" style={{ width: '30%' }}>Verified By</th>
                                                            <th scope="col">Date</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        <Fragment >
                                                            <tr>
                                                                <td scope="row">1</td>
                                                                <td>01-11-2023</td>
                                                                <td>CASH</td>
                                                                <td>01-11-2023</td>

                                                            </tr>
                                                        </Fragment>


                                                    </tbody>
                                                </table>


                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <p style={{ fontSize: '18px' }}>Complete non-shaded fields only</p>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-12">
                                                <p style={{ fontWeight: 'bold', fontSize: '30px' }}>INCOME</p>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-12">


                                                <table className="table table-bordered text-center">
                                                    <thead>
                                                        <tr style={{ background: '#f7e3d0c4' }}>

                                                            <th scope="col">REFERENCE ID</th>
                                                            <th scope="col"  >DESCRIPTION</th>
                                                            <th scope="col">AMOUNT</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        <Fragment >


                                                        { incomeList.map((inocme, index) => (
                                                               <tr key={index} >
                                                                <td style={{ width: '25%' }}>{inocme?.referenceId}</td>
                                                                <td style={{ width: '50%', textAlign: 'left' }}>{inocme?.description}</td>
                                                                <td style={{ width: '25%', textAlign: 'right' }}>{inocme?.amount}</td>

                                                            </tr>))}

                                                        </Fragment>


                                                    </tbody>
                                                    <tr style={{ background: '#f7e3d0c4' }}>
                                                        <td colspan="2" style={{ textAlign: 'right' }}>Total Income: </td>
                                                        <td style={{ textAlign: 'right' }}> {totalIncome}</td>
                                                    </tr>
                                                    {/* <tr style={{ background: '#f7e3d0c4' }}>
                                                        <td colspan="2" style={{ textAlign: 'right' }}>total debit: </td>
                                                        <td style={{ textAlign: 'right' }}> 100</td>
                                                    </tr>
                                                    <tr style={{ background: '#f7e3d0c4' }}>
                                                        <td colspan="2" style={{ textAlign: 'right' }}>total debit: </td>
                                                        <td style={{ textAlign: 'right' }}> 100</td>
                                                    </tr> */}
                                                </table>


                                            </div>

                                        </div>


                                        <div className="row">
                                            <div className="col-md-12">
                                                <p style={{ fontWeight: 'bold', fontSize: '30px' }}>EXPENSES</p>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-12">


                                                <table className="table table-bordered text-center">
                                                    <thead>
                                                        <tr style={{ background: '#dee2e6' }}>

                                                            <th scope="col">REFERENCE ID</th>
                                                            <th scope="col" style={{ textAlign: 'left' }} >DESCRIPTION</th>
                                                            <th scope="col">AMOUNT</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        <Fragment >

                                                        { expenseList.map((expense, index) => (
                                                            <tr key={index} >
                                                            <td style={{ width: '25%' }}>{expense?.referenceId}</td>
                                                            <td style={{ width: '50%', textAlign: 'left' }}>{expense?.description}</td>
                                                            <td style={{ width: '25%', textAlign: 'right' }}>{expense?.amount}</td>

                                                        </tr>))}
                                                            

                                                        </Fragment>


                                                    </tbody>
                                                    <tr style={{ background: '#dee2e6' }}>
                                                        <td colspan="2" style={{ textAlign: 'right' }}>Total Expense: </td>
                                                        <td style={{ textAlign: 'right' }}> {totalExpense}</td>
                                                    </tr>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className='text-end' >
                                    <Button variant='success' onClick={handleDownloadPdf} className=''  ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}

export default Statement