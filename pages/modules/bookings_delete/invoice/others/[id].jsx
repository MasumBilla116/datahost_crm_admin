import MyToast from "@mdrakibul8001/toastify";
import Button from '@mui/material/Button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import Link from "next/link";
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Form, Modal } from "react-bootstrap";
import { FaEdit, FaFilePdf, FaMoneyBillWave } from 'react-icons/fa';
import BarcodeGenerator from "../../../../../components/Barcode";
import DeleteIcon from "../../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../../components/elements/EditIcon";
import Select2 from "../../../../../components/elements/Select2";
import { decrypt } from "../../../../../components/helpers/helper";
import HotelLogo from "../../../../../components/hotelLogo";
import PropagateLoading from '../../../../../components/PropagateLoading';
import Axios from '../../../../../utils/axios';

// Component
const CreateForm = ({ onSubmit, bookingMasterId }) => {

  // cutome http
  const { http } = Axios();

  // state
  const [bookingNotes, setBookingNotes] = useState({
    booking_master_id: bookingMasterId,
    note: "",
  })

  // handler
  const handleChange = (e) => {
    setBookingNotes(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  //data set
  let dataset = { ...bookingNotes, action: "createBookingNote" }

  return (
    <Form>
      <Form.Group controlId="formBasicName" >
        <Form.Label>Note</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Write a booking note..."
          name='note'
          onChange={handleChange}
        />
      </Form.Group>
      <Button variant='contained' color='primary' className="shadow rounded" style={{ marginTop: "5px" }} onClick={() => onSubmit(dataset)} block="true">
        Create
      </Button>
    </Form>
  );
};

const EditForm = ({ onSubmit, noteId }) => {
  // custome http
  const { http } = Axios();

  // state
  const [loading, setLoading] = useState(true);
  const [noteInfo, setNoteInfo] = useState({
    note: "",
    booking_note_id: noteId,
  })

  // handler
  const handleChange = (e) => {
    setNoteInfo(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  // fetch data
  const fetchBookingNoteInfo = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/notes`, { action: "bookingNoteInfo", booking_note_id: noteId })
      .then((res) => {
        if (isSubscribed) {
          setNoteInfo(prev => ({
            ...prev,
            note: res.data?.data?.note,
          }))
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });
    return () => isSubscribed = false;
  }, [noteId]);

  // useEffect
  useEffect(() => {
    fetchBookingNoteInfo();
  }, [fetchBookingNoteInfo])

  // data set
  let dataset = { ...noteInfo, action: "updateBookingNote" }

  return (
    <Form >
      <Form.Group controlId="formBasicName" >
        <Form.Label>Note</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Write a booking note..."
          name='note'
          onChange={handleChange}
          defaultValue={noteInfo?.note}
        />
      </Form.Group>
      <Button variant='contained' color='primary' className="shadow rounded" style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset)}
      >
        update
      </Button>
    </Form>
  );
};

const DeleteForm = ({ onSubmit, noteId }) => {
  // data set
  let dataset = { action: "removeBookingNote", booking_note_id: noteId }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='error' className="shadow rounded" onClick={() => onSubmit(dataset)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

const CheckInForm = ({ onSubmit, bookingId }) => {
  // data set
  let dataset = { action: "checkInDateTime", booking_id: bookingId }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to Check In?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='info' className="shadow rounded" onClick={() => onSubmit(dataset)}>
          Check In
        </Button>
      </Modal.Footer>
    </>
  );
};

//CheckOut
const CheckOutForm = ({ onSubmit, bookingId }) => {

  let dataset = { action: "checkOutDateTime", booking_id: bookingId }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to Check Out?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='error' className="shadow rounded" onClick={() => onSubmit(dataset)}>
          Check Out
        </Button>
      </Modal.Footer>
    </>
  );
};

//CheckOut
const CancelForm = ({ onSubmit, bookingId }) => {

  let dataset = { action: "cancelBooking", booking_id: bookingId }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to cancel this booking?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='error' className="shadow rounded" onClick={() => onSubmit(dataset)}>
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
};
//See All Dues
const AllDuesModal = ({ bookingId, customerId }) => {
  const { http } = Axios();
  const [customer, setCustomer] = useState({});

  const [dues, setDues] = useState([]);


  let dataset = { action: "seeAllDuesCustomer", booking_id: bookingId, customer_id: customerId }

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, dataset)
        .then(res => {

          setCustomer(res.data?.data?.customer);
          setDues(res.data?.data?.all_dues);
        })
        .catch(err => console.log(err));
    })();
    return () => abortController.abort();
  }, [bookingId, customerId]);

  return (
    <>
      <Modal.Body>
        <p>Customer Name: {`${customer?.first_name} ${customer?.last_name}`}</p>
        <table className="table table-bordered text-start">
          <thead>
            <tr>
              <th scope="col" className="col-md-1">SL.</th>
              <th scope="col" className="col-md-9">Description</th>
              <th scope="col" className="col-md-2">Dues</th>
            </tr>
          </thead>
          <tbody>
            {!!dues?.length === true && dues?.map((item, index) => (<Fragment key={index}>
              <tr>
                <td scope="row">{index + 1}</td>
                <td>{item?.description}</td>
                <td>{item?.due_amount}</td>
              </tr>
            </Fragment>))}
          </tbody>
        </table>
      </Modal.Body>
    </>
  );
};

//Refund
const RefundForm = ({ onSubmit, bookingId, refundable, refundDetails, refundAmount }) => {

  const [RefundAmount, setRefundAmount] = useState(refundAmount);

  useEffect(() => {
    !!refundable && setRefundAmount(refundable);
  }, [])

  let dataset = { action: "refund", booking_id: bookingId, refund_amount: RefundAmount }

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label>Refundable Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Refundable Amount"
            name="refund_amount"
            value={RefundAmount}
            onChange={(e) => {
              const enteredValue = parseFloat(e.target.value);
              const newRefundAmount = isNaN(enteredValue) ? 0 : enteredValue;

              if (newRefundAmount > refundAmount) {
                setRefundAmount(refundAmount);
              } else {
                setRefundAmount(newRefundAmount);
              }
            }}
            disabled={refundDetails.calculation_type !== "custom_calculate"}
          />

        </Form.Group>
        <Form.Group>
          <Button variant="contained" color="success" className="shadow rounded float-right" style={{ marginTop: "15px" }} onClick={() => onSubmit(dataset)} block="true" >
            Refund
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};


//Create New Payment
const PaymentCollectionForm = ({ onSubmit, bookingMasterId, invoiceType, customerId, selectedRows }) => {



  const { http, user, token } = Axios();

  const totalDueAmount = selectedRows.reduce((total, row) => {
    if (row?.restaurant_invoices) {
      return total + parseFloat(row?.restaurant_invoices?.due_amount);
    } else if (row?.vehicle_booking) {
      return total + parseFloat(row?.vehicle_booking?.due_amount);
    } else if (row?.cust_room_service) {
      return total + parseFloat(row?.cust_room_service?.due_amount);
    }else if (row?.customer_booking_master) {
      return total + parseFloat(row?.customer_booking_master?.due_amount);
    }
    return total;
  }, 0);

  const [payment, setPayment] = useState({
    booking_master_id: bookingMasterId,
    invoice_type: invoiceType,
    payee: customerId,
    amount: totalDueAmount
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



  let dataset = { ...payment,selectedRows, action: "createPaymentSlip" }

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
            defaultValue={totalDueAmount}
            disabled
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

function viewInvoice() {

  const { notify } = MyToast();
  const { http, user, token } = Axios();
  const router = useRouter();
  const {
    isReady,
    query: {
      id,
    }
  } = router;

  const { pathname } = router;


  const [params, setParams] = useState(null);

  const [bookingInfo, setBookingInfo] = useState(null);
  const [bookingDaysCount, setBookingDaysCount] = useState(null);
  const [adnlAdults, setAdnlAdults] = useState(null);
  const [adnlChilds, setAdnlChilds] = useState(null);
  const [bookingDaysInfo, setBookingDaysInfo] = useState(null);
  const [baseTotalTarrif, setBaseTotalTarrif] = useState("");
  const [totalAdditionalAmount, setTotalAdditionalAmount] = useState(null);
  const [slotInfo, setSlotInfo] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState([]);
  const [bookingNotes, setBookingNotes] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [logoDetails, setLogoDetails] = useState([]);
  const [account_ledger, setAccount_ledger] = useState([]);
  const [account_ledgerTry, setAccount_ledgerTry] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);


  //Fetch booking Info
  const fetchBookinInfo = useCallback(async () => {
    if (!isReady) {
      console.log('preccessing...')
      return;
    }
    const params = decrypt(id);

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "hotelLogo" })
      .then((res) => {
        // console.log("logo calling", res)
        // setLogoDetails(res.data?.data);
      })
      .catch((err) => {
        console.log('logo calling error', err)
      });


    setInitialLoading(true);
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, { action: "bookingInfo", booking_id: params })
      .then(async (res) => {
        if (isSubscribed) {

          setBookingInfo(res?.data?.data?.bookingInfo);
          setBookingDaysCount(res?.data?.data?.bookingDaysCount);
          setAdnlAdults(res?.data?.data?.adnl_adults);
          setAdnlChilds(res?.data?.data?.adnl_childs);
          setBookingDaysInfo(res?.data?.data?.bookingDays);
          setBaseTotalTarrif(res?.data?.data?.baseTotalTarrif);
          setTotalAdditionalAmount(res?.data?.data?.total_additional_price);
          setSlotInfo(res?.data?.data?.slotInfo);
          setPaymentSlip(res?.data?.data?.payment_slips);

          setBookingNotes(res.data?.data?.booking_notes);
          setInitialLoading(false)

          setInitialLoading(false)



        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
        // setInitialLoading(false)
      });

    return () => isSubscribed = false;

  }, [isReady])

  useEffect(() => {
    fetchBookinInfo();
  }, [fetchBookinInfo,])




  const customerLedgerTry = async () => {
      const booking_id = decrypt(id);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`,
      { customer_id: bookingInfo?.customer_id, booking_id: booking_id, action: "customerLedgerHistoryNew" }
    ).then((res) => {
      setAccount_ledgerTry(res?.data?.data);
      setLoading(false);
    }).catch((error) => {
      console.log('fetching sector list error', error);
    });
  };

  useEffect(() => {
    if(id != null || id != undefined){
      customerLedgerTry()
    }
  }, [bookingInfo?.customer_id,id]);

  //Print function
  const handleDownloadPdf = async () => {
    const element = document.getElementById('printME');

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${bookingInfo?.invoice_id}.pdf`);
    } catch (error) {
      console.error('Error creating PDF:', error);
    }

  };






  //Create Note
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm = async (notes) => {
    let isSubscribed = true;

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/notes`, notes)
      .then((res) => {
        if (isSubscribed) {
          notify("success", `${res?.data?.response}`);
          handleClose();
          // fetchBookingNotes();
          fetchBookinInfo();

        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.note) {
            notify("error", `${msg?.note?.Note}`);
          }

        }

      });

    return () => isSubscribed = false;
  }

  //Edit form
  const [showEdit, setShowEdit] = useState(false);
  const [noteId, setNoteId] = useState(null);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (note_id) => {
    setShowEdit(true);
    setNoteId(note_id)
  }

  const updateForm = async (formData) => {
    let isSubscribed = true;
    // setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/notes`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleCloseEdit();
          // setPending(false);
          // fetchBookingNotes();
          fetchBookinInfo();

        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.note) {
            notify("error", `${msg.note.Note}`);
          }

        }
        //  setPending(false);
      });

    // fetchItemList();

    return () => isSubscribed = false;
  }

  //Delete Note
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleOpenDelete = (note_id) => {
    setShowDelete(true);
    setNoteId(note_id);
  }

  const deleteForm = async (formData) => {
    let isSubscribed = true;
    // setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/notes`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Note has been successfully removed !");
          handleCloseDelete();
          // fetchBookingNotes();
          fetchBookinInfo()

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
          customerLedgerTry();
          fetchBookinInfo();

        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        //  else{
        //   if(msg?.note){
        //     notify("error", `${msg?.note?.Note}`);
        //   }

        //  }

      });

    return () => isSubscribed = false;
  }

  //Checkin Modal
  const [showCheckIn, setShowCheckIn] = useState(false);
  const handleCloseCheckInModal = () => setShowCheckIn(false);
  const handleOpenCheckInModal = () => {
    setShowCheckIn(true);
  }

  const submitCheckInForm = async (formData) => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "You have checked in successfully!");
          handleCloseCheckInModal();
          fetchBookinInfo()

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

  //Checkin Modal
  const [showCheckOut, setShowCheckOut] = useState(false);
  const handleCloseCheckOutModal = () => setShowCheckOut(false);
  const handleOpenCheckOutModal = () => {
    setShowCheckOut(true);
  }

  const submitCheckOutForm = async (formData) => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Checkout Done!");
          handleCloseCheckOutModal();
          fetchBookinInfo()

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
  //Cancel Modal
  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancelModal = () => setShowCancel(false);
  const handleOpenCancelModal = () => {
    setShowCancel(true);
  }

  const submitCancelForm = async (formData) => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Successfully canceled this booking!");
          handleCloseCancelModal();
          fetchBookinInfo()

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

  //See All Other Dues
  const [showAllDues, setShowAllDues] = useState(false);
  const handleCloseDuesModal = () => setShowAllDues(false);
  const handleOpenDuesModal = () => {
    setShowAllDues(true);
  }

  //Refund Modal
  const [showRefund, setShowRefund] = useState(false);
  const handleCloseRefundModal = () => setShowRefund(false);
  const handleOpenRefundModal = () => {
    setShowRefund(true);
  }

  const submitRefundForm = async (formData) => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Amount has been refunded!");
          handleCloseRefundModal();
          fetchBookinInfo()

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





  const [basicInfo, setBasicInfo] = useState({});
  // fetch data
  const headerInfo = async () => {
    await http
      .get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/slim/getChannelDetails/${bookingInfo?.channel_id}`,
        {
          headers: {
            "slim-request-authorization-uid": user?.id,
            "slim-request-authorization-key": token,
          },
        }
      )
      .then((res) => {
        setBasicInfo(res.data.results);
      })
      .catch((error) => {
        console.log("fetching sector list error", error);
      });
  };

  // useEffect
  useEffect(() => {
    headerInfo();
  }, [bookingInfo?.channel_id]);



  const handleCheckboxChange = (event, ledger) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedRows(prevSelectedRows => [...prevSelectedRows, ledger]);
    } else {
      setSelectedRows(prevSelectedRows =>
        prevSelectedRows.filter(row => row.id !== ledger.id)
      );
    }
  };



  const [refundDetails, setRefundDetails] = useState(null);
  const [refundAmount, setRefundAmount] = useState(null);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const customerServices = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/service`,
        { action: "getAllService" }
      ).then((res) => {
        setRefundDetails(res?.data?.data[0])
        //  setRefundAmount(res?.data?.data[0]?.amount)
        const afterRefund = (parseFloat(bookingInfo?.net_amount) + parseFloat(totalDueAmount) + parseFloat(totalAmount)) - ((parseFloat(bookingInfo?.net_amount) + parseFloat(totalDueAmount) + parseFloat(totalAmount)) * ((res?.data?.data[0]?.amount) / 100));
        setRefundAmount(afterRefund)

        setLoading(false);
      }).catch((error) => {
        console.log('fetching sector list error', error);
      });
    };
    customerServices()
    return () => controller.abort();
  }, [bookingInfo?.customer_id]);

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-12">

          <div className='card shadow'>

            {/* Note Create Modal Form */}
            <Modal dialogClassName="modal-sm" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Create Booking Note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CreateForm onSubmit={submitForm} bookingMasterId={bookingInfo?.booking_master_id} />
              </Modal.Body>
            </Modal>
            {/* End Create Modal Form */}
            {/* Note Create Modal Form */}
            <Modal dialogClassName="modal-sm" show={showEdit} onHide={handleCloseEdit}>
              <Modal.Header closeButton>
                <Modal.Title>Update Booking Note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <EditForm onSubmit={updateForm} noteId={noteId} />
              </Modal.Body>
            </Modal>
            {/* End Create Modal Form */}
            {/* Note Delete Modal Form */}
            <Modal show={showDelete} onHide={handleCloseDelete}>
              <Modal.Header closeButton></Modal.Header>

              <DeleteForm onSubmit={deleteForm} noteId={noteId} />

            </Modal>
            {/* End Create Modal Form */}
            {/* Check-In Modal */}
            <Modal show={showCheckIn} onHide={handleCloseCheckInModal}>
              <Modal.Header closeButton></Modal.Header>

              <CheckInForm onSubmit={submitCheckInForm} bookingId={bookingInfo?.booking_master_id} />

            </Modal>
            {/* End Check-In Modal */}

            {/* Check-In Modal */}
            <Modal show={showCheckOut} onHide={handleCloseCheckOutModal}>
              <Modal.Header closeButton></Modal.Header>

              <CheckOutForm onSubmit={submitCheckOutForm} bookingId={bookingInfo?.booking_master_id} />

            </Modal>
            {/* End Check-In Modal */}

            {/* Cancel Modal */}
            <Modal show={showCancel} onHide={handleCloseCancelModal}>
              <Modal.Header closeButton></Modal.Header>

              <CancelForm onSubmit={submitCancelForm} bookingId={bookingInfo?.booking_master_id} />

            </Modal>
            {/* End Cancel Modal */}

            {/* See All Dues Modal */}
            <Modal show={showAllDues} dialogClassName="modal-lg" onHide={handleCloseDuesModal}>
              <Modal.Header closeButton>All Dues List</Modal.Header>

              <AllDuesModal bookingId={bookingInfo?.booking_master_id} customerId={bookingInfo?.customer_id} />

            </Modal>
            {/* End Dues Modal */}

            {/* Payment Collection Modal Form */}
            <Modal dialogClassName="modal-sm" show={showPayment} onHide={handleClosePaymentModal}>
              <Modal.Header closeButton>
                <Modal.Title>New payment collection</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <PaymentCollectionForm onSubmit={paymentForm} selectedRows={selectedRows} bookingMasterId={bookingInfo?.booking_master_id} invoiceType={bookingInfo?.invoice_type} customerId={bookingInfo?.customer_id} />

              </Modal.Body>
            </Modal>
            {/* End Payment collection Modal Form */}

            {/* Refund Modal */}
            <Modal show={showRefund} onHide={handleCloseRefundModal}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                {/* <RefundForm onSubmit={submitRefundForm} bookingId={bookingInfo?.booking_master_id} refundable={bookingInfo?.refund_amount} /> */}
                <RefundForm onSubmit={submitRefundForm} bookingId={bookingInfo?.booking_master_id} refundable={bookingInfo?.refund_amount} refundDetails={refundDetails} refundAmount={refundAmount} />

              </Modal.Body>

            </Modal>
            {/* End Refund Modal */}



            <div className='card-body'>

              <div id="printME">
                <div className='' style={{ margin: '44px', padding: '10px' }}>
                  <div className=''>
                    <div className='text-center fs-3'>
                      {/* <h1 className='mb-3'>(Company Logo)</h1> */}
                      {/* {logoDetails?.uploadsData?.length > 0 && ( */}
                      {/* <HotelLogo /> */}


                      <HotelLogo id={bookingInfo?.booking_master_id} invoiceName="Hotel Booking Invoice" />

                    </div>
                    {initialLoading
                      ?
                      <div className="my-5 mx-3 text-center">
                        <PropagateLoading />
                      </div>
                      :
                      <div className='row small my-2'>
                        <div className='col-sm-4 col-lg-4 col-md-4 my-2'>
                          <div>
                            {/* <div style={{ fontWeight: 'bold', fontSize: '16px' }}><strong>Invoice Type :</strong><span >Hotel Booking</span></div> */}
                            <div className="text-capitalize">{bookingInfo?.first_name } {bookingInfo?.last_name != null && bookingInfo?.last_name}</div>
                            <strong>{bookingInfo?.address} </strong>
                            {!!bookingInfo?.mobile && <div className='mt-1'>Phone:  {bookingInfo?.mobile}</div>}
                            {bookingInfo?.email && <div>Email: {bookingInfo?.email}</div>}
                          </div>
                        </div>
                        <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                          {/* <div>
                                      <strong>Invoice# </strong>
                                      <span>{bookingInfo?.invoice_id}</span>
                                  </div> */}
                          {/* <div>(Bar Code)</div> */}
                          <BarcodeGenerator value={bookingInfo?.invoice_id} />
                        </div>
                        <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                          <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                            <div><strong>Booking Status:</strong><span className="mx-2 font-weight-bold"> {bookingInfo?.booking_status === 0 ? 'Cancelled' : 'Active'}</span></div>
                            <div><strong>Booking Date & Time:</strong></div>
                            <div><span> {bookingInfo?.createInvoiceTime}</span></div>
                            <div><strong>Check-In Date & Time:</strong></div>
                            <div><span> {bookingInfo?.checkin_at}</span></div>
                            <div><strong>Check-Out Date & Time:</strong></div>
                            <div><span> {bookingInfo?.checkout_at}</span></div>
                            <div><strong>Payment Status:</strong><span className="mx-2 font-weight-bold"> {bookingInfo?.total_due > 0 ? 'Due' : 'PAID'}</span></div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <div className='table-responsive'>
                    <table className="table table-bordered text-center">
                      <thead>
                        <tr>
                          <th scope="col" style={{ width: '40%' }}>Room Information</th>
                          <th scope="col">From</th>
                          <th scope="col">To</th>
                          <th scope="col">{bookingInfo?.checkout_type !== 'hourly' ? 'Days(s)' : 'Hour(s)'}</th>
                          <th scope="col">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td scope="row">
                            {`${bookingInfo?.room_type_name} (Room No.${bookingInfo?.room_no ? bookingInfo?.room_no : "Not Assign Yet"}) 
                                Included in base price 
                                
                                , 
                                
                               [Adult: ${adnlAdults}, Child: ${adnlChilds}]
                                
                                `
                            }
                          </td>
                          <td>{bookingInfo?.date_from}</td>
                          <td>{bookingInfo?.date_to}</td>
                          <td>{bookingInfo?.checkout_type !== 'hourly' ? bookingDaysCount?.count_days : slotInfo?.hour}</td>
                          <td>
                            {!initialLoading && typeof bookingDaysInfo?.length !== 'undefined' && <>
                              <span>Base price: {bookingDaysInfo && bookingDaysInfo.map((price, index) => (<Fragment key={index}>
                                {`${Number(price?.tarrif_amount)}`}{index + 1 !== bookingDaysInfo?.length ? `+` : ``}
                              </Fragment>))} = {`${Number(baseTotalTarrif?.total_tarrif)}`}</span> <br />
                              <span>Additional price: {bookingDaysInfo && bookingDaysInfo.map((price, index) => (<Fragment key={index}>
                                {`${Number(price?.adult_amount) + Number(price?.child_amount)}`}{index + 1 !== bookingDaysInfo?.length ? `+` : ``}
                              </Fragment>))} = {Number(totalAdditionalAmount)}</span>
                            </>}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="row">
                    <div className="col-md-8">
                    {paymentSlip.length > 0 && <div className="row">
                        <h5 className='mb-2'><u>Payment History</u></h5>

                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th scope="col">SL.</th>
                              <th scope="col" style={{ textAlign: 'left' }}>Payment Slip</th>
                              {/* <th scope="col">Payment Date</th> */}
                              <th scope="col">Payment Method</th>
                              <th scope="col" style={{ textAlign: 'right', width: '20%' }}>Payment Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentSlip && paymentSlip.map((paySlip, index) => (
                              <Fragment key={index}>
                                <tr>
                                  <td scope="row">{index + 1}</td>
                                  <td style={{ textAlign: 'left' }}>{paySlip?.slip_number} <br /> <span style={{ fontSize: '0.7em', color: 'gray' }}>{moment(paySlip?.payment_date).format('DD-MM-YYYY')}</span></td>
                                  {/* <td>{moment(paySlip?.payment_date).format('DD-MM-YYYY')}</td> */}
                                  <td>{paySlip?.ac_type}</td>
                                  <td style={{ textAlign: 'right' }}>{paySlip?.amount}</td>
                                </tr>
                              </Fragment>
                            ))}

                          </tbody>
                        </table>
                      </div>}



                      {account_ledgerTry && <div className="row">
                        <h5 className='mb-2'><u>Purchase History</u></h5>
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th scope="col" style={{ width: '5%' }}>Select</th>
                              <th scope="col" style={{ textAlign: 'left' }}>Invoice/Slip</th>
                              <th scope="col" style={{ textAlign: 'right', width: '20%' }}>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {account_ledgerTry && account_ledgerTry.data && account_ledgerTry.data.map((item, index) => (
                              <Fragment key={index}>
                                <tr>
                                  <td>
                                    <input
                                      type="checkbox"
                                      onChange={event => handleCheckboxChange(event, item)}
                                      checked={selectedRows.includes(item)}
                                    />
                                  </td>
                                  <td style={{ textAlign: 'left' }}>
                                    {item.restaurant_invoices && item.restaurant_invoices.inv_id && (
                                      <>
                                        {item.restaurant_invoices.inv_id} <br /> <span style={{ fontSize: '0.7em', color: 'gray' }}>{moment(item.restaurant_invoices.created_at).format("DD/MM/YYYY")} </span>
                                      </>
                                    )}
                                    {item.customer_booking_master && item.customer_booking_master.inv_id && (
                                      <>
                                        {item.customer_booking_master.inv_id} <br /> <span style={{ fontSize: '0.7em', color: 'gray' }}> {moment(item.customer_booking_master.created_at).format("DD/MM/YYYY")}</span>
                                      </>
                                    )}
                                    {item.vehicle_booking && item.vehicle_booking.inv_id && (
                                      <>
                                        {item.vehicle_booking.inv_id} <br /> <span style={{ fontSize: '0.7em', color: 'gray' }}> {moment(item.vehicle_booking.created_at).format("DD/MM/YYYY")}</span>
                                      </>
                                    )}
                                    {item.cust_room_service && item.cust_room_service.inv_id && (
                                      <>
                                        {item.cust_room_service.inv_id} <br /> <span style={{ fontSize: '0.7em', color: 'gray' }}> {moment(item.cust_room_service.created_at).format("DD/MM/YYYY")}</span>
                                      </>
                                    )}
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    {item.restaurant_invoices && item.restaurant_invoices.due_amount}
                                    {item.customer_booking_master && item.customer_booking_master.due_amount}
                                    {item.vehicle_booking && item.vehicle_booking.due_amount}
                                    {item.cust_room_service && item.cust_room_service.due_amount}
                                  </td>
                                </tr>
                              </Fragment>
                            ))}
                            <tr>
                              <td colSpan="2" className="text-right">Total Amount:</td>
                              <td style={{ textAlign: 'right' }}>
                                {account_ledgerTry && account_ledgerTry.data && account_ledgerTry.data.reduce((acc, item) => {
                                  return acc + (parseFloat(item.customer_booking_master?.due_amount || 0) + parseFloat(item.restaurant_invoices?.due_amount || 0) + parseFloat(item.vehicle_booking?.due_amount || 0) + parseFloat(item.cust_room_service?.due_amount || 0));
                                }, 0)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>}


                    </div>
                    <div className="col-md-4">
                      <div className='float-right'>
                        <div style={{ paddingRight: "20px" }}>
                          <table className='table table-price-details'>
                            <tbody>
                              <tr style={{ borderBottom: '2px solid black', borderTop: 'hidden' }}>
                                <td>Sub Total</td>
                                <td>{bookingInfo?.sub_total}</td>
                              </tr>
                              <tr>
                                <td>Discount </td>
                                <td>{bookingInfo?.promo_discount}</td>
                              </tr>
                              <tr>
                                <td>Additional Discount </td>
                                <td>{bookingInfo?.additional_discount}</td>
                              </tr>
                              <tr>
                                <td>Tax </td>
                                <td>{bookingInfo?.total_tax}</td>
                              </tr>
                              <tr style={{ borderBottom: '2px solid black' }}>
                                <td>Grand Total</td>
                                <td>{bookingInfo?.net_amount}</td>
                              </tr>
                              <tr>
                                <td>Total Payable </td>
                                <td>{bookingInfo?.net_amount}</td>
                              </tr>
                              <tr>
                                <td>Other Dues</td>
                                <td>{bookingInfo?.other_dues}</td>
                              </tr>
                              <tr>
                                <td>Total Paid</td>
                                <td>{bookingInfo?.total_paid}</td>
                              </tr>
                              {bookingInfo?.refund_amount &&
                                <tr>
                                  <td>Total Refundable</td>
                                  <td>{bookingInfo?.refund_amount}</td>
                                </tr>
                              }
                              <tr style={{ borderTop: '2px solid black' }}>
                                <td>Remaining Due</td>
                                {/* <td>{bookingInfo?.total_due}</td> */}
                                <td>{bookingInfo?.customer_remaining_due?.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="">

                    {

                      bookingInfo?.channel_id &&
                      <div className="d-flex flex-column justify-content-end align-items-right text-right mt-5">
                        <small className={`uppercase`}>Booking By</small>
                        <div className="align-self-end" style={{
                          // height: "90px",
                          // width: " 90px",
                          boxShadow: "0 0 5px #ddd",
                          background: "#f8f8f8",
                          padding: "0",
                          textAlign: "right",
                        }}>
                          {basicInfo?.logo_source ?

                            <img
                              className="my-1"
                              src={`${process.env.NEXT_PUBLIC_CHANNEL_FILE_SOURCE_URL}/${basicInfo.logo_source}`}
                              alt="Hotel Logo"
                              style={{
                                height: "90px",
                                objectFit: "cover",
                              }}
                            />
                            :
                            <img
                              src="https://www.shutterstock.com/image-vector/logo-hotel-vector-260nw-1353597998.jpg"
                              alt="Hotel Logo"
                              style={{
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          }
                        </div>
                        <h5>{basicInfo?.channel_name?.toUpperCase()}</h5>

                      </div>

                    }

                    {/* <p style={{ fontSize: '12px' }}>Remarks: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores consectetur deserunt voluptatem aliquam nobis in.</p> */}
                  </div>
                </div>
              </div>

            </div>

            <div className='row m-5'>
              <div className='col-md-6 col-lg-6'>

               { 
               
              //  bookingInfo?.refund_amount === null &&
               <div className='flex-gap'>

                  {(bookingInfo?.other_dues > 0 || bookingInfo?.total_due > 0) &&
                    <div>
                      <Button variant="contained" color="secondary" onClick={handleOpenPaymentModal}><span className='mx-2'><FaMoneyBillWave /></span>Payment Collection</Button>
                    </div>
                  }

                  <div>
                    <Button variant="contained" color="primary" onClick={handleOpenRefundModal}><span className='mx-1'><FaMoneyBillWave /></span>Refund</Button>
                  </div>

                  {bookingInfo?.checkin_at === null &&
                    <div>
                      <Button variant="contained" color="info" onClick={handleOpenCheckInModal}>Check In</Button>
                    </div>
                  }
                  {bookingInfo?.checkin_at !== null && bookingInfo?.checkout_at === null &&
                    <div>
                      <Button variant="contained" color="warning" onClick={handleOpenCheckOutModal} >Check Out</Button>
                    </div>
                  }
                  <div>
                    <Button variant="contained" color="error" onClick={handleOpenCancelModal} >Cancel</Button>
                  </div>
                  <div>
                   
                    <Link href={`/modules/bookings/ledger/customer/${bookingInfo?.customer_id}`}>
                      <a className="btn btn-info">View Ledger</a>
                    </Link>
                  
                  </div>
                </div>}

              </div>
              <div className='col-md-6 col-lg-6 text-end'>
                <div>
                  <Button variant='contained' color='success' onClick={handleDownloadPdf} ><span className='fs-5 me-1'><FaFilePdf /></span>Print Invoice</Button>
                </div>
              </div>
            </div>

            <div>
              <hr></hr>
            </div>

            <div className="row m-5">
              <div className="col-md-12">
                <div className="d-flex align-items-center">
                  <div>
                    <h5><u>Invoice Notes</u></h5>
                  </div>
                  <div className="ms-auto">
                    <Button variant="contained" color="secondary" size="small" onClick={handleShow}> <span className='fs-5 mx-2'><FaEdit /></span>Add Note</Button>
                  </div>
                </div>

                <table className="table table-bordered text-center mt-3">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '1%' }}>SL.</th>
                      <th scope="col" style={{ width: '50%' }}>Note</th>
                      <th scope="col">Created By</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeof bookingNotes?.length !== 'undefined' && bookingNotes.map((note, index) => (<Fragment key={index}>
                      <tr>
                        <td scope="row">{index + 1}</td>
                        <td>{note.note}</td>
                        <td>{note.action_created}</td>
                        <td>{moment(note.created_at).format('DD/MM/YYYY HH:MM A')}</td>
                        <td>
                          <ul className="action">
                            <li>
                              <a href="#" onClick={(e) => { e.preventDefault(); handleShowEdit(note.id) }}>
                                <EditIcon />
                              </a>
                            </li>
                            <li>
                              <a href="#" onClick={(e) => { e.preventDefault(); handleOpenDelete(note.id) }}>
                                <DeleteIcon />
                              </a>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    </Fragment>))
                    }

                  </tbody>
                </table>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default viewInvoice;