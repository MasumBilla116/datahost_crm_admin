import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { FaFilePdf } from 'react-icons/fa';
// import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import moment from 'moment';
import { useRouter } from 'next/router';
import Axios from '../../../../../utils/axios';
import PrintButton from '../../../../../components/elements/PrintButton';

const ledger = () => {
    const [initialLoading, setInitialLoading] = useState(true)
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [customer, setCustomer] = useState({})
    const [account_ledger, setAccount_ledger] = useState([]);

    const { http } = Axios();
    const router = useRouter();
    const { id } = router.query;

    const handleDateChange = (e) => {
        if (e.target.name == 'start_date') {
            setStartDate(e.target.value);
        }
        if (e.target.name == 'end_date') {
            setEndDate(e.target.value);
        }

    }
    const handleDownloadPdf = async () => {
        const element = document.getElementById('printME');
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        // notify("success", "printing invoice of " + supplierInfo?.name)

        const marginTop = 15; // Adjust this value to set the desired top margin

        pdf.addImage(data, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
        // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`LP_${customer?.first_name}.pdf`);
    };

    //set Opening Balance
    const [openingBalance, setOpeningBalance] = useState({});
    const [total_debit_credit, setTotalDebitCredit] = useState({});


    useEffect(() => {
        const controller = new AbortController();
        let formData = { action: "customerLedger", customer_id: id, fromDate: fromDate, toDate: toDate };
        async function getCustomerInfo() {
            setTotalDebitCredit({})
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
                .then((res) => {
                    setCustomer(res?.data?.data?.customer);
                    setAccount_ledger(res?.data?.data?.account_ledger);
                    setOpeningBalance(res?.data?.data?.opening_balance);
                    setTotalDebitCredit(res?.data?.data?.total_debit_credit);

                })
                .catch((err) => {
                    setAccount_ledger([]);

                });
        }
        getCustomerInfo()
        return () => controller.abort();

    }, [id, fromDate, toDate]);

    return (
        <>
            <div className='card shadow m-4'>
                <div className="row">
                    <div className="col-6">
                        <div className="col-sm-6 col-lg-6 col-md-6">

                        </div>
                    </div>
                    <div className="col-6">
                        <div className="mt-3 row" >
                            <div className="col-md-5">
                                <label className="col-form-label ">From:</label>
                                <DatePicker className="form-control form-control" value={fromDate} required onChange={date => setFromDate(format(new Date(date), 'yyyy-MM-dd'))} />

                            </div>
                            <div className="col-md-5">
                                <label className="col-form-label ">To:</label>
                                <DatePicker className="form-control form-control" value={toDate} required onChange={date => setToDate(format(new Date(date), 'yyyy-MM-dd'))} />
                            </div>
                        </div>
                    </div>
                </div>



                <div id="printME" className='p-5'>
                    <div className='mb-5'>
                        <div className='text-center fs-3'>

                        </div>


                        <div className='row small my-2'>
                            <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div>
                                    <div> <strong>Customer</strong></div>
                                    <strong>{customer.first_name + "  " + customer.last_name} </strong>
                                    <p>YAKUB SOUTH CENTER, 67/(OLD),156(NEW),MIRPUR ROAD (2ND FLOOR) LAKE CIRCUS,KALABAGAN</p>
                                    <div className='mt-1'>Phone: {customer.mobile}  </div>
                                    <div>Email: info@smart-bd.com</div>
                                </div>
                            </div>
                            <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>

                            </div>
                            <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                                <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                                    <p>{fromDate && toDate ? `Customer Ledger from :${fromDate} to ${toDate}` : ``}</p>

                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="table-responsive">

                        <table className="table table-sm table-hover" >
                            <thead >
                                <tr >
                                    <th>Date</th>
                                    <th>Particulars</th>
                                    <th>Invoice/slip</th>

                                    <th>Debit(TK)</th>
                                    <th>Credit(TK)</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {account_ledger && account_ledger.length > 0 && (
                                    <>
                                        <tr>
                                            <td>{openingBalance?.created_at ? moment(openingBalance?.created_at).format('yy-MM-DD HH:mm:ss A') : '-'}</td>
                                            <td>Opening Balance</td>

                                            <td></td>
                                            <td></td>
                                            <td></td>

                                            <td>{openingBalance?.balance}</td>
                                        </tr>

                                        {account_ledger && account_ledger?.map((item, index) => (
                                            <>
                                                <tr>
                                                    <td>{moment(item?.created_at).format('yy-MM-DD HH:mm:ss A')}</td>
                                                    <td>{item?.note}</td>

                                                    <td className="text-info">{item?.reference}</td>
                                                    <td>{item?.debit}</td>
                                                    <td>{item?.credit}</td>
                                                    <td>{item?.balance}</td>

                                                </tr>

                                            </>
                                        ))}

                                        <tr >
                                            <td><strong>Total :</strong></td>
                                            <td></td>
                                            <td className="text-info"></td>
                                            <td ><strong>{total_debit_credit?.total_debit}</strong></td>
                                            <td ><strong>{total_debit_credit?.total_credit}</strong></td>
                                            <td></td>

                                        </tr>

                                    </>


                                )}


                            </tbody>

                        </table>

                    </div>
                </div>

                <div className='row m-5'>
                    <div className='col-md-6 col-lg-6'>
                        <div>

                        </div>
                    </div>
                    <div className='col-md-6 col-lg-6 text-end '>
                        {/* <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button> */}
                        <PrintButton contentId="printME" />

                    </div>
                </div>
            </div>

        </>
    )
}

export default ledger