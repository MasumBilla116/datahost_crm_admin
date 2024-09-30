import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Axios from '../../../../../../utils/axios';
import { FaFilePdf, FaPhone } from 'react-icons/fa';
import { PropagateLoading } from '../../../../../../components';
import Select2 from "../../../../../../components/elements/Select2";
import DataTable from 'react-data-table-component';
import { Button, Form, Modal } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import toast from "../../../../../../components/Toast/index";
import HotelLogo from '../../../../../../components/hotelLogo';
import BarcodeGenerator from '../../../../../../components/Barcode';
import Breadcrumbs from '../../../../../../components/Breadcrumbs';
import PrintButton from '../../../../../../components/elements/PrintButton';


const CreateForm = ({ onSubmit, vehicleBookingId, bookingDetails, loading }) => {

    const { http } = Axios();
    const [customerId, setCustomerId] = useState();
    const [customerName, setCustomerName] = useState();
    const [balance, setBalance] = useState();
    const [bookingCharge, setBooking_charge] = useState();
    const [payment, setPayment] = useState()
    const [accountList, setAccountList] = useState("");
    const accounts_options = accountList?.data;

    let customers = bookingDetails?.vehicleBookDetails;

    //  let item_name_options = {
    //     value: itemId || "",  
    //     label: itemName || "Select...",
    //   };


    useEffect(() => {
        const controller = new AbortController();
        async function getAllAccounts() {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, { action: "listAccounts", })
                .then((res) => {
                    setAccountList(res?.data);
                });
        }
        getAllAccounts()
        return () => controller.abort();

    }, [])






    let booking_charge = parseInt(bookingCharge)


    let dataset = { customerId, customerName, payment, booking_charge, action: "makeVehicleBookingPayments" }

    return (

        <Form>

            <div className="row" style={{ padding: "20px" }}>
                <div className="col-md-4">
                    <div><strong>Booking type : </strong><span>{bookingDetails?.booking_type}</span></div>
                    <div><strong>Customer Type : </strong><span>{bookingDetails?.customer_type}</span></div>
                    <div><strong>Vehicle Name : </strong><span>{bookingDetails?.vehicleBookDetails[0]?.vehicle_name}</span></div>
                    <div><strong>Total Customer : </strong><span>{bookingDetails?.total_customer}</span></div>

                    {/* <div><strong>Credit Limit : </strong><span></span></div>
                <div><strong>Available Credit : </strong><span></span></div>  */}
                </div>
                <div className="col-md-4">
                    <div><strong>Invoice Payment</strong><span></span></div>
                    <div><strong>{bookingDetails?.local_voucer}</strong><span></span></div>
                </div>
                <div className="col-md-4">
                    <div><strong>Invoicd Amount : </strong><span>{bookingDetails?.total_amount}</span></div>
                    <div><strong>date : </strong><span>{bookingDetails?.booking_date}</span></div>
                    <div><strong>Created By : </strong><span>{bookingDetails?.creator?.name}</span></div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">


                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Select Customer</Form.Label>
                        {true && (

                            <Select2
                                //    className="basic-multi-select"
                                options={customers?.map(({ customer_id, customerName, booking_charge }) => ({
                                    value: customer_id,
                                    label: customerName,
                                    booking_charge
                                }))}
                                onChange={(e) => {
                                    setCustomerId(e.value);
                                    setCustomerName(e.label);
                                    setBooking_charge(e.booking_charge);


                                }}
                            />

                        )}
                    </Form.Group>


                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Paid Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Paid Amount"
                            name='paid_amount'
                            defaultValue={bookingCharge}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Select Accounts</Form.Label>
                        <Select2
                            options={accounts_options?.map(({ id, account_name }) => ({ value: id, label: account_name }))}
                            onChange={(e) => setPayment(e?.value)}
                            name="account"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            closeMenuOnSelect={true}
                        />
                    </Form.Group>
                    <p> Balance: </p>
                </div>

                <div className="col-md-6">
                    {customerName ? <>
                        <div><strong>Final Amount to Pay : </strong><span>{bookingCharge}</span></div>

                        <div><strong>Due Amount : </strong><span>{bookingCharge}</span></div>
                    </>
                        :
                        null}
                </div>

            </div>


            <Button variant="primary" className="shadow rounded mb-3" style={{ marginTop: "5px" }} type="button" onClick={() => { onSubmit(dataset) }} >
                Payment
            </Button>
        </Form>
    );
};

const vehicleBookDetails = () => {
    const { http } = Axios();
    const router = useRouter();
    const { isReady, query: { id } } = router;
    const [initialLoading, setInitialLoading] = useState(true);
    const [vclBookingVoucher, setVclBookingVoucher] = useState([]);
    const [customerInfo, setCustomerInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // Toastify setup;
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);


    useEffect(() => {
        let isSubscribed = true;
        const getVehicleBookingInfo = async () => {

            if (!isReady) {
                console.log('fetching...')
                return;
            }


            let body = {}
            body = {
                action: "getVehicleBookingInfo",
                vehicleBookingId: id
            }


            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking`, body)
                .then((res) => {
                    if (isSubscribed) {

                        setVclBookingVoucher(res?.data?.data);
                        setCustomerInfo(res?.data?.data?.vehicleBookDetails)

                        setInitialLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err + <br /> + 'Something went wrong !')
                })
        }

        getVehicleBookingInfo();
        return () => isSubscribed = false;
    }, [id, isReady])


    const columnData = [
        {
            name: <span className='fw-bold' >SL</span>,
            selector: (row, index) => index + 1,
            width: "10%"
        },
        {
            name: <span className='fw-bold' >Customer Name</span>,
            selector: row => row?.customerName,
            width: "70%"
        },


        {
            name: <span className='fw-bold' >Booking Charge</span>,
            selector: row => row?.booking_charge,
            width: "10%"
        },

        {
            name: <span className='fw-bold' >Payment</span>,
            selector: row => row?.is_paid === 1 ? "Paid" : "Due",
        }

    ];


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
        pdf.save('print.pdf');
    };


    const submitForm = async (items) => {
        let isSubscribed = true;
        setLoading(true);

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/transport/vehicle-booking`, items)
            .then((res) => {
                if (isSubscribed) {
                    notify("success", "successfully Added!");
                    handleClose();
                    setLoading(false);
                }

            })

            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
                setLoading(false);
            });

        return () => isSubscribed = false;
    }
    const { pathname } = router;
    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Booking', link: '/modules/transport/vehiclesBooking/manageVehiclesBooking' },
        { text: 'View Booking', link: '/modules/transport/vehiclesBooking/manageVehiclesBooking/view/[id]' },
    ]



    return (
        <>
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}

            <div className='card shadow pb-5 m-4'>
                <div id="printME" className='p-5'>
                    <div>
                        <div className='text-center fs-3'>
                            {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                            <HotelLogo id={id} invoiceName="Vehicles Booking"/>

                        </div>

                        {initialLoading ?
                            <div className="my-5 mx-3 text-center">
                                <PropagateLoading />
                            </div>
                            :
                            <div className='row small my-2'>
                                <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                    {/* <div>
                                <strong>Voucher Remarks: {invoices?.remarks} </strong>
                            </div> */}
                                </div>
                                <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                                    {/* <div>
                                        <strong>Voucher Number:  </strong>
                                        <strong>{vclBookingVoucher?.local_voucer}</strong>
                                    </div>
                                    <div>(Bar Code)</div> */}
                                    <BarcodeGenerator value={vclBookingVoucher?.local_voucer} />
                                </div>
                                <div className='row small my-2'>
                                    <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                                        <div>
                                            <strong>Booking ID: {vclBookingVoucher?.id} </strong>
                                            <div><strong>Vehicle Name: {customerInfo[0].vehicle_name} </strong></div>

                                        </div>
                                    </div>
                                    <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                                        <div>
                                            {/* <strong>Voucher# </strong>
                                            <span>voucher</span> */}
                                        </div>
                                        <div>
                                            {/* (Bar Code) */}

                                        </div>
                                    </div>
                                    <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                                        <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                                            <div><strong>Booking Type:</strong><span>{vclBookingVoucher?.booking_type}</span></div>
                                            <div><strong>Customer Type:</strong><span>{vclBookingVoucher?.customer_type}</span></div>
                                            <div className='mt-2'><strong>Total Amount:</strong><span>{vclBookingVoucher?.total_amount}</span></div>
                                            <div><strong>Voucher Date:</strong><span>{vclBookingVoucher?.booking_date}</span></div>
                                            <div><strong>Booking Time:</strong><span>{vclBookingVoucher?.booking_time}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div>
                        <DataTable
                            columns={columnData}
                            data={customerInfo}
                            striped
                        />


                        <div className='mb-2 pt-4 row border-top'>
                            <div className='col-sm-12 col-lg-8 col-md-8'>
                                {/* <div><span className='fw-bold' >In Word: {getPascalCase(converter.toWords(rcvBckVoucher?.total_amount)) + " TAKA Only"}</span></div> */}
                            </div>
                            <div className='row text-end col-sm-12 col-lg-4 col-md-4'>
                                <div className='row col-sm-3 col-lg-3 col-md-3'>
                                    <div><span className='fw-bold' >Total :</span></div>

                                </div>
                                <div className='row col-sm-12 col-lg-6 col-md-6 '>
                                    <div><span>{vclBookingVoucher?.total_amount} Tk</span></div>
                                </div>

                            </div>
                        </div>

                        <div className='d-flex justify-content-between my-4'>
                            <div className='w-25 mt-5'>
                                <div><hr /></div>
                                <div className='text-center fw-bolder'>Reciever's signature </div>
                            </div>
                            <div className='w-25 text-center pt-5 mt-5'>
                                (company logo)
                            </div>
                            <div className='w-25 mt-5'>
                                <div ><hr /></div>
                                <div className='text-center fw-bolder'>For managebeds computer</div>
                            </div>
                        </div>
                    </div>
                    <div className='row m-0'>
                        <div className='col-md-6 col-lg-6'>
                            <div>
                                <Button variant='info' onClick={handleShow} > <span className='fs-5'></span>Payment</Button>
                            </div>


                            {/* Create Modal Form */}
                            <Modal dialogClassName="modal-lg" show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Create Payment</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <CreateForm onSubmit={submitForm} vehicleBookingId={id} bookingDetails={vclBookingVoucher} loading={loading} />
                                </Modal.Body>
                            </Modal>
                            {/* End Create Modal Form */}
                        </div>
                        <div className='col-md-6 col-lg-6 text-end'>
                            {/* <Button variant='success' className='' onClick={handleDownloadPdf}  ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button> */}
                            <PrintButton contentId="printME" />

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default vehicleBookDetails