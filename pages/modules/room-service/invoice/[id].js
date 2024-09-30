import MyToast from '@mdrakibul8001/toastify';
import Button from '@mui/material/Button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import moment from "moment";
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Card, Form, Modal } from 'react-bootstrap';
import BarcodeGenerator from "../../../../components/Barcode";
import HeadSection from '../../../../components/HeadSection';
import PrintButton from "../../../../components/elements/PrintButton";
import Select2 from '../../../../components/elements/Select2';
import { decrypt } from '../../../../components/helpers/helper';
import HotelLogo from "../../../../components/hotelLogo";
import Axios from '../../../../utils/axios';

//Create New Payment
const PaymentCollectionForm = ({ onSubmit, invoiceId, invoiceType, customerId }) => {

  const { http } = Axios();

  const [payment, setPayment] = useState({
    invoice_id: invoiceId,
    invoice_type: invoiceType,
    payee: customerId,
  });


  const handleChange = (e) => {
    setPayment(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  //Fetch all Accounts
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAllAccounts = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
        action: "listAccounts"
      })
        .then((res) => {
          if (isSubscribed) {
            setAccounts(res.data?.data)
          }
        })
        .catch((err) => console.log(err))
    }
    fetchAllAccounts();
    return () => isSubscribed = false;
  }, []);



  let dataset = { ...payment, action: "roomServiceMakePayment" }

  return (<>
    <Form>
      <div className="row">
        <Form.Group className="mb-2 col-6">
          <Form.Label>Payment Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Payment Amount"
            name="amount"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-2 col-6">
          <Form.Label>Payment Account</Form.Label>
          <Select2
            maxMenuHeight={140}
            options={accounts.map(
              ({ id, account_name }) => ({ value: id, label: account_name })
            )}
            onChange={(e) =>
              setPayment((prev) => ({
                ...prev,
                account_id: e.value,
              }))
            }
          />
        </Form.Group>
      </div>

      <Form.Group className="mb-2">
        <Form.Label>Payment Reference</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Payment Reference"
          name="reference"
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Comments</Form.Label>
        <Form.Control
          as="textarea"
          rows="3"
          placeholder="Enter Comments..."
          name="remark"
          onChange={handleChange}
        />
      </Form.Group>

      <div className="row">
        <div className="col-md-12 d-flex">
          <Button variant="contained" color="success" className="shadow rounded ms-auto" style={{ marginTop: "5px" }} onClick={() => onSubmit(dataset)} block="true" >
            Collect Payment
          </Button>
        </div>
      </div>
    </Form>
  </>);
};


function Invoice() {
  const { http } = Axios();
  const { notify } = MyToast();
  const router = useRouter();
  const {
    isReady,
    query: {
      id,
    }
  } = router;
  console.log("id: ", id);

  const { pathname } = router;

  const [invoice, setInvoice] = useState({});


  //set params id
  const [invoiceId, setInvoiceId] = useState(null);

  useEffect(() => {
    if (!isReady) {
      console.log('preccessing...')
      return;
    }

    setInvoiceId(decrypt(id));

  }, [isReady]);


  //fetch invoice info and items array
  const fetchSingleServiceInfo = useCallback(async () => {
    if (!isReady) {
      console.log('preccessing...');
      return;
    }
    let isSubscribed = true;

    let body = {
      action: "getSingleRoomServiceUpdateInfo",
      inv_id: invoiceId
    }
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/room-service`, body)
      .then(res => {
        if (isSubscribed) {
          // console.log(res.data?.data);
          setInvoice(res.data?.data);
        }
      })
      .catch(e => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response.data.response}`);
        }
      });

    return () => isSubscribed = false;

  }, [invoiceId, isReady]);

  useEffect(() => {
    fetchSingleServiceInfo();
  }, [fetchSingleServiceInfo]);

  //sum all items total price 
  if (invoice?.inv_items_arr?.length > 0) {

    var sumPrice = invoice?.inv_items_arr.reduce((sum, item) => parseInt(sum) + parseInt(item.totalPrice), 0); 

  } else {
    var sumPrice = 0;
  }

  //Print function
  const handleDownloadPdf = async () => {
    notify('info', 'Invoice Downloading ....')
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
    pdf.save(`${invoice?.inv_info?.inv_number}.pdf`);
  };

  //Payment Collection Modal Action
  const [showPayment, setShowPayment] = useState(false);
  const handleClosePaymentModal = () => setShowPayment(false);
  const handleOpenPaymentModal = () => setShowPayment(true);

  const paymentForm = async (formData) => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/payment/slip`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", `${res?.data?.response}`);
          handleClosePaymentModal();
        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }

      });

    return () => isSubscribed = false;
  }


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Room Services', link: '/modules/bookings/room-service/view-all-inv' },
    { text: 'View Room Services', link: '/modules/bookings/room-service/invoice/[id]' },

  ];

  return (<>
    <HeadSection title="Room Service Invoice" />
    <div className='container-fluid'>
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className='row'>
        <div className='col-12 col-md-12'>
          <Card>
            {/* Payment Collection Modal Form */}
            <Modal dialogClassName="modal-sm" show={showPayment} onHide={handleClosePaymentModal}>
              <Modal.Header closeButton>
                <Modal.Title>Payment Collection</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <PaymentCollectionForm onSubmit={paymentForm} invoiceId={invoiceId} invoiceType={invoice?.inv_info?.inv_type} customerId={invoice?.inv_info?.customer_id} />
              </Modal.Body>
            </Modal>
            {/* End Payment collection Modal Form */}
            <Card.Body>

              <div className="invoice-123" id="printableArea">
                <div className="row pt-3">

                  <div id="printME">
                    <div className="col-md-12">
                      <div className='' style={{ margin: '44px', padding: '10px' }}>
                        <div className='text-center fs-3'>
                          {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                          <HotelLogo id={id} invoiceName="Room Service Invoice" />

                        </div>

                        <div className='row small my-2'>
                          <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                            <div>
                              {/* <div style={{ fontWeight: 'bold', fontSize: '16px' }}><strong>Invoice Type :</strong><span >Room Service</span></div> */}
                              <div><strong>Name: {invoice?.inv_info?.first_name} {invoice?.inv_info?.last_name}</strong></div>
                              <div><strong>Address: {invoice?.inv_info?.address} </strong></div>
                              <div> <strong>Phone:  {invoice?.inv_info?.mobile}</strong></div>
                            </div>
                          </div>
                          <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                            <BarcodeGenerator value={invoice?.inv_info?.inv_number} />
                          </div>
                          <div className='row col-sm-4 col-lg-4 col-md-4 my-2 ms-auto'>
                            <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                              <div><strong>Invoice No:</strong><span className="mx-2 font-weight-bold">{invoice?.inv_info?.inv_number}</span></div>
                              <div><strong>Order Date-Time:</strong><span className="mx-2 font-weight-bold"> {moment(invoice?.inv_info?.created_at).format('yy-MM-DD HH:mm:ss A')}</span></div>
                              <div><strong>Order Status:</strong><span className="mx-2 font-weight-bold"> {invoice?.inv_info?.order_status}</span></div>
                              <div><strong className="">Paid:</strong><span className="font-weight-bold"> ${invoice?.inv_info?.paid}</span> <span>||</span> <strong className="">Due:</strong> <span className="font-weight-bold"> ${invoice?.inv_info?.due}</span></div>
                            </div>
                          </div>
                        </div>

                      </div>
                      {/* </div> */}

                      {/* <div className="col-md-12" > */}
                      <div className="table-responsive mt-5">
                        <table className="table table-hover no-wrap">
                          <thead>
                            <tr>
                              <th className="text-center">#</th>
                              <th>Food Item</th>
                              <th className="text-end">Quantity</th>
                              <th className="text-end">Unit Cost</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice?.inv_items_arr && invoice?.inv_items_arr.map((item, index) => (<Fragment key={index}>
                              <tr>
                                <td className="text-center">{index + 1}</td>
                                <td>{item?.name}</td>
                                <td className="text-end">{item?.quantity}</td>
                                <td className="text-end">{item?.price}</td>
                                <td className="text-end">{item?.totalPrice}</td>
                              </tr>
                            </Fragment>))}

                          </tbody>
                        </table>
                      </div>
                      {/* </div> */}

                      {/* <div className="col-md-12"> */}
                      <div className="pull-right mt-4 text-end">
                        <p>Sub - Total amount: ${sumPrice}</p>
                        <p>vat (0%) : $0</p>
                        <hr />
                        <h3>
                          <b>Total :</b> ${sumPrice}
                        </h3>
                      </div>
                      <div className="clearfix" />
                      <hr />

                    </div>
                  </div>

                  <div className='col-md-12'>
                    <div className="text-end">
                      {/* <Button variant='contained' color='error' className='p-2 me-4' type="button" onClick={handleOpenPaymentModal} >
                        Proceed to payment
                      </Button> */}

                      <PrintButton contentId="printME" />

                    </div>
                  </div>



                </div>
              </div>


            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  </>)
}

export default Invoice