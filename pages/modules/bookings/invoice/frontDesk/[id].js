import MyToast from "@mdrakibul8001/toastify";
import Button from '@mui/material/Button';
import { addMinutes, isAfter, parseISO } from 'date-fns';
import * as moment from 'moment';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Form, Modal } from "react-bootstrap";
import { FaEdit, FaMoneyBillWave } from 'react-icons/fa';
import { HeadSection } from "../../../../../components";
import ActiveCurrency from "../../../../../components/ActiveCurrency";
import BarcodeGenerator from "../../../../../components/Barcode";
import PropagateLoading from '../../../../../components/PropagateLoading';
import themeContext from "../../../../../components/context/themeContext";
import DeleteIcon from "../../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../../components/elements/EditIcon";
import PrintButton from "../../../../../components/elements/PrintButton";
import Select2 from "../../../../../components/elements/Select2";
import { decrypt } from "../../../../../components/helpers/helper";
import HotelLogo from "../../../../../components/hotelLogo";
import Axios from '../../../../../utils/axios';
import { getSSRProps } from "../../../../../utils/getSSRProps";
import { getBookingStatus } from "../../../../../utils/utils";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.bkng.paymnt_rcv",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};


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

  let dataset = { action: "checkInDateTime", booking_id: bookingId }
  // let dataset = { action: "checkInDateTime", booking_id: bookingId }

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

  let dataset = { action: "checkOutDateTime", booking_id: bookingId, refund: 'no' }

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


//Extra time payemt
const ExtraTimeForm = ({ onSubmit, bookingId }) => {

  let dataset = { action: "extraTimePayemnt", booking_id: bookingId }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to paymet extra time?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='error' className="shadow rounded" onClick={() => onSubmit(dataset)}>
          Confirm
        </Button>
      </Modal.Footer>
    </>
  );
};
//late time payemt

const CancelForm = ({ onSubmit, bookingId }) => {

  let dataset = { action: "cancelBooking", booking_id: bookingId }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to reject this booking?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='error' className="shadow rounded" onClick={() => onSubmit(dataset)}>
        Reject
        </Button>
      </Modal.Footer>
    </>
  );
};

// booking approve modal
const BookingApproveForm = ({ onSubmit, bookingId }) => {
  let dataset = { action: "approveBooking", booking_id: bookingId }
  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to <strong>approve</strong> this booking?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='error' className="shadow rounded" onClick={() => onSubmit(dataset)}>
          Approve
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
        <p>Customer Name: {`${customer?.first_name} ${customer?.last_name ?? customer?.last_name}`}</p>
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

//RejectRefund
const RejectRefundForm = ({ onSubmit, bookingId, refundable }) => {
  const [RefundAmount, setRefundAmount] = useState(refundable);
  useEffect(() => {
    !!refundable && setRefundAmount(refundable);
  }, [])

  let dataset = { action: "rejectRefund", booking_id: bookingId, refund_amount: RefundAmount }

  return (
    <>
      {/* <Form>
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
          />

        </Form.Group>
        <Form.Group>
          <Button variant="contained" color="success" className="shadow rounded float-right" style={{ marginTop: "15px" }} onClick={() => onSubmit(dataset)} block="true" >
            Refund
          </Button>
        </Form.Group>
      </Form> */}


      <Modal.Body>
        <Modal.Title>Are you sure to <strong>refundable</strong> this booking?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='contained' color='error' className="shadow rounded" onClick={() => onSubmit(dataset)}>
          Refund
        </Button>
      </Modal.Footer>
    </>
  );
};


//Create New Payment
const PaymentCollectionForm = ({ onSubmit, bookingMasterId, invoiceType, customerId, selectedRows }) => {


  // return;
  const { http } = Axios();
  const totalDueAmount = selectedRows.reduce((total, row) => {
    if (row?.restaurant_invoices) {
      return total + parseFloat(row?.restaurant_invoices?.due_amount);
    } else if (row?.vehicle_booking) {
      return total + parseFloat(row?.vehicle_booking?.due_amount);
    } else if (row?.cust_room_service) {
      return total + parseFloat(row?.cust_room_service?.due_amount);
    } else if (row?.customer_booking_master) {
      return total + parseFloat(row?.customer_booking_master?.due_amount);
    } else if (row?.customer_hourly_due) {
      return total + parseFloat(row?.customer_hourly_due?.due_amount);
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



  let dataset = { ...payment, selectedRows, action: "createPaymentSlip" }

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

function viewInvoice(accessPermissions) {

  const { notify } = MyToast();
  const { http } = Axios();
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
  const [account_ledger, setAccount_ledger] = useState([]);
  const [account_ledgerTry, setAccount_ledgerTry] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [remainingDue, setRemainingDue] = useState(0)
  const [latePaymentInfo, setLatePaymentInfo] = useState({})
  const [initialLoading, setInitialLoading] = useState(true);
  const [assignRoomBookingStatus,setAssignRoomBookingStatus] = useState(false);

  //Fetch booking Info
  const fetchBookingInfo = useCallback(async () => {
    setInitialLoading(true);
    const params = decrypt(id);

    try {
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, {
        action: "bookingInfo",
        booking_id: params
      });



      setBookingInfo(res?.data?.data?.bookingInfo);
      setBookingDaysCount(res?.data?.data?.bookingDaysCount);
      setAdnlAdults(res?.data?.data?.adnl_adults);
      setAdnlChilds(res?.data?.data?.adnl_childs);
      setBookingDaysInfo(res?.data?.data?.bookingDays);
      setBaseTotalTarrif(res?.data?.data?.baseTotalTarrif);
      setTotalAdditionalAmount(res?.data?.data?.total_additional_price);
      setSlotInfo(res?.data?.data?.slotInfo);
      setPaymentSlip(res?.data?.data?.payment_slips);
      setBookingNotes(res?.data?.data?.booking_notes); 
      setAssignRoomBookingStatus( res?.data?.data?.bookingDays[0]?.room_id ? true : false);

    } catch (err) {
      console.log("Server Error:", err);
    } finally {

      setInitialLoading(false);

    }
  }, [isReady, id]);

  useEffect(() => {
    fetchBookingInfo();
  }, [fetchBookingInfo, account_ledgerTry, latePaymentInfo?.id]);


  

  useEffect(() => {

    setLoading(true);
    const controller = new AbortController();
    const customerLedger = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`,
        { customer_id: bookingInfo?.customer_id, action: "customerLedgerHistory" }
      ).then((res) => {
        setAccount_ledger(res?.data?.data?.account_ledger);
        setLoading(false);
      }).catch((error) => {
        console.log('fetching sector list error', error);
      });
    };
    customerLedger()
    return () => controller.abort();
  }, [bookingInfo?.customer_id]);


  const [totalDueAmounts, setTotalDueAmount] = useState(null);

  const customerLedgerTry = async () => {
    const params = decrypt(id);
    let body = {
      booking_id: params, customer_id: bookingInfo?.customer_id,
    }
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`,
      { booking_id: params, customer_id: bookingInfo?.customer_id, action: "customerLedgerHistoryNew" }
    ).then((res) => {
      setAccount_ledgerTry(res?.data?.data);
      setLoading(false);
    }).catch((error) => {
      console.log('fetching sector list error', error);
    });
  };

  useEffect(() => {
    if (bookingInfo?.customer_id !== null || bookingInfo?.customer_id !== undefined) {
      customerLedgerTry()
    }
  }, [bookingInfo?.customer_id, fetchBookingInfo]);


  // Function to calculate total due amount
  const calculateTotalDueAmount = (data) => {
    if (!data || !Array.isArray(data)) {
      return 0;
    }

    let totalDueAmount = 0;
    data.forEach((item) => {
      if (item.restaurant_invoices && item.restaurant_invoices.due_amount) {
        totalDueAmount += parseFloat(item.restaurant_invoices.due_amount);
      } else if (item.vehicle_booking && item.vehicle_booking.due_amount) {
        totalDueAmount += parseFloat(item.vehicle_booking.due_amount);
      } else if (item.cust_room_service && item.cust_room_service.due_amount) {
        totalDueAmount += parseFloat(item.cust_room_service.due_amount);
      } else if (item.customer_hourly_due && item.customer_hourly_due.due_amount) {
        totalDueAmount += parseFloat(item.customer_hourly_due.due_amount);
      } else if (item.customer_booking_master && item.customer_booking_master.due_amount) {
        totalDueAmount += parseFloat(item.customer_booking_master.due_amount);
      }
    });

    return totalDueAmount.toFixed(2);
  };

  const totalDueAmount = calculateTotalDueAmount(account_ledgerTry?.data);

  // Function to calculate total amount
  const calculateTotalAmount = (paymentSlip) => {
    let totalAmount = 0;
    paymentSlip?.forEach((item) => {
      totalAmount += parseFloat(item.amount);
    });
    return totalAmount.toFixed(2);
  };
  const totalAmount = calculateTotalAmount(paymentSlip);
  const handleDownloadPdf = () => {
    const printContent = document.getElementById('printME');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    } else {
      console.error("Element with ID 'printME' not found.");
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
          fetchBookingInfo();
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
          fetchBookingInfo();
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
          fetchBookingInfo()

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

    // fetchBookingInfo();
    //  return;
    let isSubscribed = true;

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking/payment/slip`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", `${res?.data?.response}`);
          handleClosePaymentModal();
          customerLedgerTry();
          fetchBookingInfo();
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
          fetchBookingInfo()

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
    if (remainingDue > 0) {

      notify("error", "PLease clear the due");
    } else {

      setShowCheckOut(true);
    }
  }

  /**Extra Time Paymetn start */
  const [showExtraTime, setShowExtraTime] = useState(false);
  const handleCloseExtraTimeModal = () => setShowExtraTime(false);
  const handleOpenExtraTimeModal = () => {
    // if (remainingDue > 0) {
    //   notify("error", "PLease clear the due");
    // } else {
    //   setShowExtraTime(true);
    // }

    setShowExtraTime(true);

  }
  /**Extra Time Paymetn end */

  const submitCheckOutForm = async (formData) => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Checkout Done!");
          handleCloseCheckOutModal();
          // fetchBookinInfo()
          fetchBookingInfo()
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


  const submitExtraTimeForm = async (formData) => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        notify("success", "Creation Done");
        handleCloseExtraTimeModal();
        fetchlatePaymetInfo();
        customerLedgerTry();
        fetchBookingInfo();

        // router.reload(window.location.pathname);

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
      });


  }

  // submitExtraTimeForm
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
          fetchBookingInfo()

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


  // @@ Booking approve handler

  const [showBookingApprove, setShowBookingApprove] = useState(false);
  const handleCloseBookingApproveModal = () => setShowBookingApprove(false);
  const handleOpenBookingApproveModal = () => {
    setShowBookingApprove(true);
  }
  const submitBookingApprove = async (formData) => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Successfully approve this booking!");
          handleCloseBookingApproveModal();
          fetchBookingInfo();
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
          fetchBookingInfo()
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

  //Refund Modal
  const [showRejectRefund, setShowRejectRefund] = useState(false);
  const handleCloseRejectRefundModal = () => setShowRejectRefund(false);
  const handleOpenRejectRefundModal = () => {
    setShowRejectRefund(true);
  }


  const submitRejectRefundForm = async (formData) => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Amount has been refunded!");
          handleCloseRejectRefundModal();
          fetchBookingInfo()
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




  const [loading, setLoading] = useState(true);
  const [logoDetails, setLogoDetails] = useState([]);
  const fetchLogoImages = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "hotelLogo" })
      .then((res) => {
        if (isSubscribed) {
          setLogoDetails(res.data?.data);
          setLoading(false);
        }
      })

      .catch((err) => {
        setLoading(false);
      });


    return () => (isSubscribed = false);
  }, []);

  const fetchlatePaymetInfo = useCallback(async () => {
    const params = decrypt(id);
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, { booking_id: params, action: "extraTimePayemntInfo" })
      .then((res) => {

        setLatePaymentInfo(res.data?.data);
        setLoading(false);

      })

      .catch((err) => {
        setLoading(false);
      });

  }, [id]);
  useEffect(() => {
    fetchlatePaymetInfo();
  }, [fetchlatePaymetInfo]);
  // extraTimePayemntInfo

  useEffect(() => {
    fetchLogoImages();
  }, [fetchLogoImages]);



  useEffect(() => {
    if (account_ledgerTry && account_ledgerTry.data) {
      setSelectedRows(account_ledgerTry.data);
    }
  }, [account_ledgerTry]);

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

  const totalDebit = account_ledger.reduce((acc, curr) => acc + parseFloat(curr.debit), 0);
  const totalCredit = account_ledger.reduce((acc, curr) => acc + parseFloat(curr.credit), 0);
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


  useEffect(() => {
    if (bookingInfo && totalDueAmount !== null && totalAmount !== null) {
      const netAmount = parseFloat(bookingInfo?.net_amount) ?? 0;
      const totalDue = parseFloat(totalDueAmount) ?? 0;
      const totalAmt = parseFloat(totalAmount) ?? 0;
      const roomBookingDue = parseFloat(bookingInfo?.total_due) ?? 0;

      // const remainingDue = (netAmount + totalDue + totalAmt + roomBookingDue) - (netAmount + totalAmt);
      const remainingDue = (totalDue);
      setRemainingDue(remainingDue);
    }
  }, [bookingInfo, totalDueAmount, totalAmount, latePaymentInfo?.id]);
 
  
  // const[hotelCheckoutValue,setHotelCheckoutValue] = useState();
  const context = useContext(themeContext);
  const { hoteItemList } = context;
  const [hotelCheckoutValue, setHotelCheckoutValue] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const hotelNameItem = hoteItemList.find(item => item?.config_name === 'Check-Out');
    if (hotelNameItem?.config_value) {
      setHotelCheckoutValue(hotelNameItem.config_value);
    }
  }, [hoteItemList]);

  useEffect(() => {
    if (hotelCheckoutValue && bookingInfo?.date_to) {
      // Ensure the time is in 'HH:mm' format
      const [hours, minutes] = hotelCheckoutValue.split(':');
      const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      const combinedDateTimeString = `${bookingInfo.date_to}T${formattedTime}`;
      const combinedDateTime = parseISO(combinedDateTimeString);
      const adjustedDateTime = addMinutes(combinedDateTime, 59);
      const now = new Date();
      if (isAfter(now, adjustedDateTime)) {
        setShowButton(true);
      } else {
        console.log("Current time is not after the adjusted DateTime.");
      }
    }
  }, [hotelCheckoutValue, bookingInfo?.date_to]);

  return (
    <div className="container-fluid ">
      <HeadSection title="Booking Invoice" />
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
            <Modal dialogClassName="modal-sm" show={showEdit} onHide={handleCloseEdit}>
              <Modal.Header closeButton>
                <Modal.Title>Update Booking Note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <EditForm onSubmit={updateForm} noteId={noteId} />
              </Modal.Body>
            </Modal>
            <Modal show={showDelete} onHide={handleCloseDelete}>
              <Modal.Header closeButton></Modal.Header>
              <DeleteForm onSubmit={deleteForm} noteId={noteId} />
            </Modal>
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

            {/* Extra Time  Modal Start */}
            <Modal show={showExtraTime} onHide={handleCloseExtraTimeModal}>
              <Modal.Header closeButton></Modal.Header>

              <ExtraTimeForm onSubmit={submitExtraTimeForm} bookingId={bookingInfo?.booking_master_id} />

            </Modal>

            {/* Extra Time  Modal End */}

            {/* handleCloseExtraTimeModal showExtraTime */}

            {/* booking approve modal */}
            <Modal show={showBookingApprove} onHide={handleCloseBookingApproveModal}>
              <Modal.Header closeButton></Modal.Header>
              <BookingApproveForm onSubmit={submitBookingApprove} bookingId={bookingInfo?.booking_master_id} />
            </Modal>

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
            <Modal dialogClassName="modal-md" show={showPayment} onHide={handleClosePaymentModal}>
              <Modal.Header closeButton>
                <Modal.Title>New payment collection</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <PaymentCollectionForm selectedRows={selectedRows} onSubmit={paymentForm} bookingMasterId={bookingInfo?.booking_master_id} invoiceType={bookingInfo?.invoice_type} customerId={bookingInfo?.customer_id} />
              </Modal.Body>
            </Modal>
            {/* End Payment collection Modal Form */}

            {/* Refund Modal */}
            <Modal show={showRefund} onHide={handleCloseRefundModal}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <RefundForm onSubmit={submitRefundForm} bookingId={bookingInfo?.booking_master_id} refundable={bookingInfo?.refund_amount} refundDetails={refundDetails} refundAmount={refundAmount} />
              </Modal.Body>

            </Modal>
            {/* End Refund Modal */}


            {/* Refund Modal */}
            <Modal show={showRejectRefund} onHide={handleCloseRejectRefundModal}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <RejectRefundForm onSubmit={submitRejectRefundForm} bookingId={bookingInfo?.booking_master_id} refundable={bookingInfo?.total_paid} />
              </Modal.Body>

            </Modal>
            {/* End Refund Modal */}


            <div className='card-body'>

              <div id="printME">
                <div className='' style={{ margin: '44px', padding: '10px' }}>
                  <div className=''>
                    <div className='text-center fs-3'>
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
                          <table>
                            <tbody>
                              <tr>
                                <th style={{ width: "60px" }}>Name</th>
                                <th style={{ width: "10px" }}>:</th>
                                <td className="text-capitalize">{bookingInfo?.first_name}
                                  {bookingInfo?.last_name ?? bookingInfo?.last_name}
                                </td>
                              </tr>
                              <tr>
                                <th>Email</th>
                                <th>:</th>
                                <td>{bookingInfo?.email !== undefined ? bookingInfo?.email : "---"}</td>
                              </tr>
                              <tr>
                                <th>Phone</th>
                                <th>:</th>
                                <td>{bookingInfo?.mobile !== undefined ? bookingInfo?.mobile : "---"}</td>
                              </tr>
                              <tr>
                                <th>Address</th>
                                <th>:</th>
                                <td>{bookingInfo?.address !== undefined ? bookingInfo?.address : "---"} </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className='text-center col-sm-4 col-lg-4 col-md-4 my-2'>
                          <BarcodeGenerator value={bookingInfo?.invoice_id} />
                        </div>
                        <div className='row col-sm-4 col-lg-4 col-md-4 my-2'>
                          <div className='ms-auto col-sm-8 col-lg-8 col-md-8'>
                            <table>
                              <tbody>
                                <tr>
                                  <th style={{ width: "150px" }}>Booking Status</th>
                                  <th style={{ width: "10px" }}>:</th>
                                  <td>{getBookingStatus(bookingInfo?.booking_status,true)} </td>
                                </tr>
                                <tr>
                                  <th>Booking Date & Time</th>
                                  <th>:</th>
                                  <td>{bookingInfo?.createInvoiceTime !== null ? bookingInfo?.createInvoiceTime : "---"}</td>
                                </tr>
                                <tr>
                                  <th>Check-In Date & Time</th>
                                  <th>:</th>
                                  <td>{bookingInfo?.checkin_at !== null ? bookingInfo?.checkin_at : "---"}</td>
                                </tr>
                                <tr>
                                  <th>Check-Out Date & Time</th>
                                  <th>:</th>
                                  <td>{bookingInfo?.checkout_at !== null ? bookingInfo?.checkout_at : "---"} </td>
                                </tr>
                                <tr>
                                  <th>Payment Status</th>
                                  <th>:</th>

                                  {/* <td>{bookingInfo?.total_due > 0 ? <span className="text-dark-danger font-weight-bold">Due</span> : <span className="text-success font-weight-bold" >Paid</span>}</td> */}
                                  <td>
                                    {parseInt(bookingInfo?.refund_amount) > 0 ? (
                                      <span className="text-warning font-weight-bold">Refund</span>
                                    ) : bookingInfo?.total_due > 0 ? (
                                      <span className="text-dark-danger font-weight-bold">Due</span>
                                    ) : (
                                      <span className="text-success font-weight-bold">Paid</span>
                                    )}
                                  </td>

                                </tr>

                              </tbody>
                            </table>
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
                            {`${bookingInfo?.room_type_name} (Room No.${bookingInfo?.room_no}) 
                                Included in base price [ Adult: ${bookingInfo?.room_type_adults}, 
                                Child: ${bookingInfo?.room_type_childs}], Additional Guest: [Adult: ${adnlAdults}, Child: ${adnlChilds}]`
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

                      {account_ledgerTry?.data?.length > 0 &&
                        <div className="row">
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
                                      {item.customer_hourly_due && item.customer_hourly_due.inv_id && (
                                        <>
                                          {item.customer_hourly_due.inv_id} <br /> <span style={{ fontSize: '0.7em', color: 'gray' }}>{moment(item.customer_hourly_due.created_at).format("DD/MM/YYYY")} </span>
                                        </>
                                      )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                      <ActiveCurrency />{item.restaurant_invoices && item.restaurant_invoices.due_amount}
                                      {item.customer_booking_master && item.customer_booking_master.due_amount}
                                      {item.vehicle_booking && item.vehicle_booking.due_amount}
                                      {item.cust_room_service && item.cust_room_service.due_amount}
                                      {item.customer_hourly_due && item.customer_hourly_due.due_amount}
                                    </td>
                                  </tr>
                                </Fragment>
                              ))}
                              <tr>
                                <td colSpan="2" className="text-right">Total Amount:</td>
                                <td style={{ textAlign: 'right' }}>
                                  <ActiveCurrency />
                                  {account_ledgerTry && account_ledgerTry.data && account_ledgerTry.data.reduce((acc, item) => {
                                    return acc + (parseFloat(item.customer_booking_master?.due_amount || 0) +
                                      parseFloat(item.restaurant_invoices?.due_amount || 0) +
                                      parseFloat(item.vehicle_booking?.due_amount || 0) +
                                      parseFloat(item.cust_room_service?.due_amount || 0) +
                                      parseFloat(item.customer_hourly_due?.due_amount || 0));
                                  }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

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
                              <tr style={{ borderTop: 'hidden' }}>
                                <td>Base Price</td>
                                <td>
                                  <ActiveCurrency />
                                  {bookingInfo?.sub_total}</td>
                              </tr>
                              <tr>
                                <td>Discount </td>
                                <td>
                                  <ActiveCurrency />
                                  {bookingInfo?.promo_discount}</td>
                              </tr>
                              <tr style={{ borderBottom: '2px solid black', borderTop: 'hidden' }}>
                                <td>Additional Discount </td>
                                <td>
                                  <ActiveCurrency />
                                  {bookingInfo?.additional_discount}</td>
                              </tr>


                              <tr >
                                <td>Sub Total</td>
                                {/* <td>{parseFloat(bookingInfo?.sub_total) - (parseFloat(bookingInfo?.promo_discount) + parseFloat(bookingInfo?.additional_discount))}</td> */}
                                <td>
                                  <ActiveCurrency />
                                  {(parseFloat(bookingInfo?.sub_total || 0) -
                                    (parseFloat(bookingInfo?.promo_discount || 0) +
                                      parseFloat(bookingInfo?.additional_discount || 0)))
                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                              </tr>
                              <tr >
                                <td > Room Tax </td>
                                <td>
                                  {/* <ActiveCurrency /> */}
                                  
                                  {parseInt(bookingInfo?.total_tax)} (%)</td>
                              </tr>
                              {/* <tr style={{ borderBottom: '2px solid black' }}>
                                <td>Invoice Due</td>
                                <td>{totalDueAmount}</td>
                              </tr> */}
                              <tr >
                                <td>Grand Total</td>
                                {/* <td>{parseFloat(bookingInfo?.net_amount) + parseFloat(totalDueAmount) + parseFloat(totalAmount)}</td> */}
                                <td>
                                  <ActiveCurrency />
                                  {(parseFloat(totalDueAmount || 0) + parseFloat(totalAmount || 0))
                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                              </tr>
                              <tr>
                                <td>Total Paid</td>
                                {/* <td>{parseFloat(bookingInfo?.total_paid) + parseFloat(totalAmount)}</td> */}
                                {/* <td>{parseFloat(totalAmount)}</td> */}
                                <td>
                                  <ActiveCurrency />
                                  {parseFloat(totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>

                              </tr>

                              <tr style={{ borderTop: '2px solid black' }}>
                                <td>Remaining Due </td>
                                <td>
                                  <ActiveCurrency />
                                  {parseFloat(remainingDue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}


                                </td>
                              </tr>

                              {bookingInfo?.refund_amount && <tr style={{ borderBottom: 'hidden' }}>
                                <td>Total Refund</td>
                                <td>
                                  <ActiveCurrency />
                                  {parseFloat(bookingInfo?.refund_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}


                                </td>
                              </tr>}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {
              <div className='row m-5'>
                <div className='col-md-6 col-lg-6'>

                  {

                    <div className='flex-gap'>

                      {((bookingInfo?.status === 1) || (bookingInfo?.status === 2) || (bookingInfo?.status === 3) || (bookingInfo?.status === 4) || (bookingInfo?.status === 0)) && <>


                        { // status = 3
                          // true || false
                          bookingInfo?.status !== 1  && bookingInfo?.status !== 0 && bookingInfo?.status !== 2 && <>
                            <div>
                              <Button variant="contained" color="success" onClick={handleOpenBookingApproveModal} >Approve</Button>
                            </div>
                            {/* <div>
                              <Button variant="contained" color="error" onClick={handleOpenCancelModal} >Reject</Button>
                            </div> */}
                          </>
                        }


                        {
                          // bookingInfo?.status !== 0 &&
                          bookingInfo?.status !== 1  && bookingInfo?.status !== 0 && bookingInfo?.status !== 2 &&
                          <div>
                            <Button variant="contained" color="error" onClick={handleOpenCancelModal} >Reject</Button>
                          </div>
                        }

                        {
                          // bookingInfo?.status !== 0 && 
                          (bookingInfo?.status !== 1) && (parseInt(bookingInfo?.total_paid) > 0) && (bookingInfo?.status === 0) &&  (bookingInfo?.payment_status !== 4) &&
                          <div>
                            <Button variant="contained" color="secondary" onClick={handleOpenRejectRefundModal}>
                              {/* <span className='mx-2'><FaMoneyBillWave /></span>Reject And refund */}
                              <span className='mx-2'><FaMoneyBillWave /></span>Refund
                            </Button>
                          </div>
                        }





                        {(remainingDue > 0) && (bookingInfo?.status === 1) && (bookingInfo?.checkout_at === null) &&
                          <div>
                            <Button variant="contained" color="secondary" onClick={handleOpenPaymentModal}>
                              <span className='mx-2'><FaMoneyBillWave /></span>Payment Collection
                            </Button>
                          </div>
                        }

                        {/* <div>
                        {
                          (bookingInfo?.status !== 1) && (parseInt(bookingInfo?.total_paid) > 0) &&
                          // (parseInt(bookingInfo?.total_paid) > 0) &&
                          <Button variant="contained" color="warning" onClick={handleOpenRefundModal}><span className='mx-1'><FaMoneyBillWave /></span>Refund</Button>
                        }
                      </div> */}

                      {((bookingInfo?.status !== 0 && bookingInfo?.status !== 1) && assignRoomBookingStatus) &&
                        <div>
                          <Button variant="contained" color="info" onClick={handleOpenCheckInModal}>Check In</Button>
                        </div>
                      }

                        {(bookingInfo?.status === 1) && (bookingInfo?.checkout_at === null) &&
                          <>


                            {
                              showButton && (latePaymentInfo?.id === undefined) ? (
                                <div>
                                  <Button variant="contained" color="secondary" onClick={handleOpenExtraTimeModal}>
                                    Calculate Extra Time
                                  </Button>

                                </div>
                              ) : (
                                <div>
                                  <Button variant="contained" color="warning" onClick={handleOpenCheckOutModal} >Check Out</Button>
                                </div>
                              )


                            }



                            {/* <div>
                          <Button variant="contained" color="warning" onClick={handleOpenCheckOutModal} >Check Out</Button>
                        </div> */}
                          </>
                        }

                      </>

                      }




                      <div>
                        <a className="btn btn-info text-light">View Ledger</a>
                      </div>
                    </div>

                  }
                </div>
                <div className='col-md-6 col-lg-6 text-end'>
                  <div>

                    <PrintButton contentId="printME" />
                  </div>
                </div>
              </div>
            }

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