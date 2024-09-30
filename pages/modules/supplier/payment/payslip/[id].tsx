import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Switch from "react-switch";
import Axios from '../../../../../utils/axios';
import toast from "../../../../../components/Toast/index";
import MyToast from "@mdrakibul8001/toastify"
import { Label, Select2, HeadSection, RadioButton } from '../../../../../components';
import PropagateLoading from '../../../../../components/PropagateLoading';
import converter from 'number-to-words';
import ReactLoading from "react-loading";
import { Modal } from "react-bootstrap";
import HotelLogo from '../../../../../components/hotelLogo';
import { FaPhone, FaEdit, FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import BarcodeGenerator from '../../../../../components/Barcode';
import Breadcrumbs from '../../../../../components/Breadcrumbs';
import PrintButton from '../../../../../components/elements/PrintButton';





const Payslip = () => {
  const { http } = Axios();
  const router = useRouter();
  const {
    isReady,
    query: {
      id,
    }
  } = router;

  const { pathname } = router;
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const [open, setOpen] = useState(false);

  function getPascalCase(string: String) {
    var splitStr = string.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  useEffect(() => {
    let isSubscribed = true;

    if (!isReady) {
      console.log('fetching...')
      return;
    }

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, { action: "getPaySlipById", id: id })
      .then((res) => {
        if (isSubscribed) {
          setDetails(res?.data?.data[0]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    }

  }, [id, isReady])


  const handleCancel = async () => {

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, { action: "returnPayslip", id: id })
      .then((res) => {
        setOpen(false)
        router.push('/modules/purchase/supplier/payment/')
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false);
      });
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
    pdf.save('print.pdf');
  };


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Payslip List', link: '/modules/purchase/supplier/payment' },
    { text: 'View', link: '/modules/purchase/supplier/payment/payslip/[id]' },
  ];

  return (
    <>
      <div>
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className='card shadow pb-5 m-4'>
          <div id="printME" className='p-5'>
            <div>
              <div className='text-center fs-3'>
                {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                <HotelLogo id={id} invoiceName="Supplier Payment"/>
                
              </div>
              <div className='row small my-2'>
                <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}><strong>Payment Type :</strong><span > {details.payment_type}</span></div>
                  <div><strong>Paid To : </strong><span>{details.name}</span></div>
                  <div><strong>phone : </strong><span>{details.contact_number}</span></div>
                  <div><strong>Email : </strong><span>{details.email || "NA"}</span></div>
                  <div><strong>Address : </strong><span>{details.address || "NA"}</span></div>
                  <div><strong>Payment Type : </strong><span>{details.payment_type}</span></div>
                  {/* <div><strong>Balance : </strong><span>{invoices.customer?.balance || "NA"}</span></div>  */}
                </div>
                <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                  {/* <div>
                                    <strong>Voucher Number:  </strong>
                                    <strong>{invoices?.voucher_number}</strong>
                                </div>
                                <div>(Bar Code)</div> */}
                  <BarcodeGenerator value={details.slip} />
                </div>
                <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                  <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                    <div><strong>Paid From : </strong><span>{details.account_name}</span></div>
                    <div><strong>Pay Type : </strong><span>{details.pay_type}</span></div>
                    {/* <div><strong>Date : </strong><span>{details.payment_date}</span></div> */}
                    <div><strong>Date and Time : </strong><span>{details.created_at}</span></div>
                    <div><strong>Created By : </strong><span>{details.createdBy}</span></div>

                    <div><strong>Remarks : </strong><span>{details.remark}</span></div>
                    {/* <div><strong>Payment Status : </strong><span>{(invoices?.is_paid == 1 || invoices?.paid_amount > 0) ? 'Payment Processing Done' : 'Pending'}</span></div> */}
                  </div>
                </div>
              </div>
            </div>

            <div>

              <div className="row mt-10">
                <div className="col-md-6">
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-7">
                      Net Total:
                    </div>
                    <div className="col-md-5">
                      {details.amount}
                    </div>
                  </div>
                </div>
              </div>




              <hr />
              <div className="row">
                <div className="col-md-6">
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-7">
                      Grand Total:
                    </div>
                    <div className="col-md-5">
                      {details.amount}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-7">
                      In WORD:
                    </div>
                    <div className="col-md-5">
                      {details?.amount && getPascalCase(converter.toWords(details?.amount)) + " $ Only"}
                    </div>
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
          </div>
          <div className='row m-0'>
            <div className='col-md-6 col-lg-6'>

              <Button className="w-50" variant="danger" onClick={() => setOpen(true)}>Cancel Payment</Button>
            </div>
            <div className='col-md-6 col-lg-6 text-end'>
              {/* <Button variant='success' className='' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button> */}
              <PrintButton contentId="printME" />

            </div>
          </div>

        </div>

      </div>

      {/* //Cancel Modal// */}
      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Modal.Title className='fs-5'>Are you sure to cancel <span className='fw-bolder'>{details?.name}'s payment ?</span> ?</Modal.Title>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="success" onClick={() => setOpen(false)}>
            Discard
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Confirm
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  )
}

export default Payslip
