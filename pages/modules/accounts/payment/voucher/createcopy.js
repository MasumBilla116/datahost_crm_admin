import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import format from 'date-fns/format';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import RadioButton from '../../../../../components/elements/RadioButton';
import Select2 from '../../../../../components/elements/Select2';
import Axios from '../../../../../utils/axios';
import MyToast from '@mdrakibul8001/toastify';

const create = () => {
    const {http} = Axios();
    const {notify} = MyToast();
    const [validated, setValidated] = useState(false);


    const voucherTypeOptions = [
        { value: 'payment', label: 'Payment' },
        { value: 'received', label: 'Received' }
      ];
    const ledgerType = [
        { value: 'employee', label: 'Employee' },
        { value: 'bank_account', label: 'Bank Account' },
        { value: 'cash_in_hand', label: 'Cash in Hand' },
        { value: 'customers', label: 'Customers' },
        { value: 'suppliers', label: 'Suppliers' },
        { value: 'service_provider', label: 'Service Provider' },
        { value: 'laundry_operators', label: 'Laundry Operators' }
      ];

    const [ledgerFromOptions,setLedgerFromOptions] = useState([]);
    const [ledgerToOptions,setLedgerToOptions] = useState([]);

    const [selectedLadgerFrom,setSelectedLadgerFrom] = useState([]);
    const [selectedLadgerTo,setSelectedLadgerTo] = useState([]);

      const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
      const [openDate, setOpenDate] = useState(false)

      const [chequeDate, setChequeDate] = useState(format(new Date(), 'yyyy-MM-dd'));
      const [openChkDate, setOpenChkDate] = useState(false)


      const [voucher, setVoucher] = useState({
        voucher_type:"",
        voucher_no:"",
        date:format(new Date(), 'yyyy-MM-dd'),
        payment_type:"",
        bank_name:"",
        cheque_no:"",
        cheque_date:format(new Date(), 'yyyy-MM-dd'),
        ledger_type_from:"",
        ledger_type_to:"",
        from_account:"",
        to_account:"",
        ledger_from_balance:0,
        ledger_to_balance:0,
        amount:"",
        amount_word:""

      });


      useEffect(()=>{

            if(voucher?.ledger_type_from == 'customers' && ledgerFromOptions.length > 0){
              setSelectedLadgerFrom(ledgerFromOptions.map(
                  ({id,title,first_name,last_name,balance})=>({value:id, label:`${title} ${first_name} ${last_name}`, balance:balance, name:'from_account'})
              ));
            }
            else if(voucher?.ledger_type_from == 'employee' && ledgerFromOptions.length > 0){
              setSelectedLadgerFrom(ledgerFromOptions.map(
                  ({id,name,balance})=>({value:id, label: name,balance:balance, name:'from_account'})
              ));
            }
            else if(voucher?.ledger_type_from == 'bank_account' && ledgerFromOptions.length > 0){
              setSelectedLadgerFrom(ledgerFromOptions.map(
                  ({id,account_name,balance})=>({value:id, label: account_name,balance:balance, name:'from_account'})
              ));
            }
            else if(voucher?.ledger_type_from == 'cash_in_hand' && ledgerFromOptions.length > 0){
              setSelectedLadgerFrom(ledgerFromOptions.map(
                  ({id,account_name,balance})=>({value:id, label: account_name,balance:balance, name:'from_account'})
              ));
            }
            else if(voucher?.ledger_type_from == 'suppliers' && ledgerFromOptions.length > 0){
              setSelectedLadgerFrom(ledgerFromOptions.map(
                  ({id,name,balance})=>({value:id, label: name,balance:balance, name:'from_account'})
              ));
            }
            else if(voucher?.ledger_type_from == 'laundry_operators' && ledgerFromOptions.length > 0){
              setSelectedLadgerFrom(ledgerFromOptions.map(
                  ({id,operator_name,balance})=>({value:id, label: operator_name,balance:balance, name:'from_account'})
              ));
            }
            else{
                setSelectedLadgerFrom([]);
            }
        // }
      },[voucher?.ledger_type_from,ledgerFromOptions])

      //filter for ledgerFromOptionTo/ 
      useEffect(()=>{

            if(voucher?.ledger_type_to == 'customers' && ledgerToOptions.length > 0){
              setSelectedLadgerTo(ledgerToOptions.map(
                  ({id,title,first_name,last_name,balance})=>({value:id, label:`${title} ${first_name} ${last_name}`,balance:balance, name:'to_account'})
              ));
            }
            else if(voucher?.ledger_type_to == 'employee' && ledgerToOptions.length > 0){
              setSelectedLadgerTo(ledgerToOptions.map(
                  ({id,name,balance})=>({value:id, label: name,balance:balance, name:'to_account'})
              ));
            }
            else if(voucher?.ledger_type_to == 'bank_account' && ledgerToOptions.length > 0){
              setSelectedLadgerTo(ledgerToOptions.map(
                  ({id,account_name,balance})=>({value:id, label: account_name,balance:balance, name:'to_account'})
              ));
            }
            else if(voucher?.ledger_type_to == 'cash_in_hand' && ledgerToOptions.length > 0){
              setSelectedLadgerTo(ledgerToOptions.map(
                  ({id,account_name,balance})=>({value:id, label: account_name,balance:balance, name:'to_account'})
              ));
            }
            else if(voucher?.ledger_type_to == 'suppliers' && ledgerToOptions.length > 0){
              setSelectedLadgerTo(ledgerToOptions.map(
                  ({id,name,balance})=>({value:id, label: name,balance:balance, name:'to_account'})
              ));
            }
            else if(voucher?.ledger_type_to == 'laundry_operators' && ledgerToOptions.length > 0){
              setSelectedLadgerTo(ledgerToOptions.map(
                  ({id,operator_name,balance})=>({value:id, label: operator_name,balance:balance, name:'to_account'})
              ));
            }
            else{
                setSelectedLadgerTo([]);
            }
      },[voucher?.ledger_type_to,ledgerToOptions])


      const handleChange =(e)=>{
        if(e.name === "voucher_type"){
            setVoucher(prev=>({
                ...prev, voucher_type:e.value
            }))
        }else if(e.name === "ledger_type_from"){
            setVoucher(prev=>({
                ...prev, ledger_type_from:e.value
            }))
        }
        else if(e.name === "ledger_type_to"){
            setVoucher(prev=>({
                ...prev, ledger_type_to:e.value
            }))
        }
        else if(e.name === "from_account"){
            setVoucher(prev=>({
                ...prev, from_account:e.label, ledger_from_balance:e.balance
            }))
        }
        else if(e.name === "to_account"){
            setVoucher(prev=>({
                ...prev, to_account:e.label,ledger_to_balance:e.balance
            }))
        }
        else{

            setVoucher(prev=>({
            ...prev, [e.target.name]:e.target.value
            }))
        }
      }


      // filter ledger type from
      const ledgerFrom = useCallback(async () => {

        let isSubscribed = true;
    
        await http
          .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/payment/voucher`, {
            action: "searchLedgerFrom", ledger_from:  voucher?.ledger_type_from
          })
          .then((res) => {
            if (isSubscribed) {
              setLedgerFromOptions(res.data.data);
            }
          })
          .catch((err) => {
            console.log("Something went wrong !");
          });
    
        return () => (isSubscribed = false);
      }, [voucher?.ledger_type_from]);
    
      useEffect(() => {
        ledgerFrom();
      }, [ledgerFrom]);

      const ledgerTo = useCallback(async () => {
        let isSubscribed = true;
    
        await http
          .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/payment/voucher`, {
            action: "searchLedgerTo",ledger_from:  voucher?.ledger_type_to
          })
          .then((res) => {
            if (isSubscribed) {
                setLedgerToOptions(res.data.data);
            }
          })
          .catch((err) => {
            console.log("Something went wrong !");
          });
    
        return () => (isSubscribed = false);
      }, [voucher?.ledger_type_to]);
    
      useEffect(() => {
        ledgerTo();
      }, [ledgerTo]);


    const [errorMsgArr,setErrorMsgArr] = useState([]);
   

      const submitForm=async(e)=> {
        e.preventDefault();
        setErrorMsgArr([]);
        let body={action: "creatPaymentVoucher", ...voucher}
        let isSubscribed = true;

        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/payment/voucher`,body)
        .then((res)=>{
          if(isSubscribed){
            notify("success", "successfully Added!");
            setValidated(false);
            setErrorMsgArr([]);

          }
    
        })
        .catch((e)=>{
          const msg = e.response?.data?.response;
    
           if(typeof(msg) == 'string'){
            notify("error", `${msg}`);
           }
           else{
                for (const field in msg) {
                  const errorMessage = msg[field][Object.keys(msg[field])[0]];
                  setErrorMsgArr(prev=>([...prev, Object.keys(msg[field])[0]]))
                  notify("error", `${errorMessage}`);
                }
           }

           setValidated(true);
        });
    
        return ()=>isSubscribed=false;
      }

  return (
    <div className='container-fluid'>
        <div className="row">
            <div className="col-md-12">
                <div className='card'>
                    <div className="card-body border-bottom">
                        <h4 className="card-title">Create Payment Voucher</h4>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={submitForm}>
                            <div className="row mb-3">
                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>Voucher Type</Form.Label>
                                    <Select2
                                        options={voucherTypeOptions?.map(({value,label})=>({value:value,label:label, name:"voucher_type"}))}
                                        onChange={handleChange}
                                        required
                                   
                                    />
                                    
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>Voucher No.</Form.Label>
                                    <Form.Control type="text" name="voucher_no" onChange={handleChange} placeholder="Enter Voucher No." required />
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>Date</Form.Label>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                        // label="Date"
                                        open={openDate}
                                        onClose={() => setOpenDate(false)}
                                        value={selectedDate}
                                        inputFormat="yyyy-MM-dd"
                                        onChange={(event) => {
                                            setSelectedDate(format(new Date(event), 'yyyy-MM-dd'));
                                            setVoucher((prev)=>({...prev, date:format(new Date(event), 'yyyy-MM-dd')}));
                                        }}
                                        renderInput={(params) =>
                                            <TextField onClick={() => setOpenDate(true)} fullWidth={true} size='small' {...params} required />
                                        }
                                        />
                                    </LocalizationProvider>
                                </Form.Group>

                            </div>

                            <div className="row ">
                                <Form.Group controlId="formBasicEmail" className='col-md-6 flex-gap align-content-start'>
                                    <RadioButton
                                        id="cash"
                                        label="Cash"
                                        name="payment_type"
                                        value="cash"
                                        onChange={handleChange}
                                    />

                                    <RadioButton
                                        id="cheque"
                                        label="Cheque"
                                        name="payment_type"
                                        value="cheque"
                                        onChange={handleChange}

                                    />

                                </Form.Group>
                            </div>

                            {voucher?.payment_type == "cheque" && <Fragment>
                                <div className='row mb-3'>
                                    <Form.Group controlId="formBasicEmail" className='col-md-4'>
                                        <Form.Label>Bank Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Voucher No." name='bank_name' onChange={handleChange} required/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail" className='col-md-4'>
                                        <Form.Label>Cheque Number</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Cheque No." name='cheque_no' onChange={handleChange} required/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail" className='col-md-4'>
                                        <Form.Label>Cheque Date</Form.Label>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                            // label="Date"
                                            open={openChkDate}
                                            onClose={() => setOpenChkDate(false)}
                                            value={chequeDate}
                                            inputFormat="yyyy-MM-dd"
                                            onChange={(event) => {
                                                setChequeDate(format(new Date(event), 'yyyy-MM-dd'));
                                                setVoucher((prev)=>({...prev, cheque_date:format(new Date(event), 'yyyy-MM-dd')}));
                                            }}
                                            renderInput={(params) =>
                                                <TextField onClick={() => setOpenChkDate(true)} fullWidth={true} size='small' {...params} required />
                                            }
                                            />
                                        </LocalizationProvider>
                                    </Form.Group>
                                </div>
                            </Fragment>
                            }

                            <div className="row mb-3">
                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>Ledger Type (From) </Form.Label>
                                    <Select2
                                        options={ledgerType?.map(({value,label})=>({value:value,label:label, name:"ledger_type_from"}))}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                
                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>Ledger Type (To)</Form.Label>
                                    <Select2
                                        options={ledgerType?.map(({value,label})=>({value:value,label:label, name:"ledger_type_to"}))}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                            <div className="row mb-3">
                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>From (Ledger)</Form.Label>
                                  
                                    <Select2
                                        options={selectedLadgerFrom}
                                        onChange={handleChange}
                                    />
                                 
                                  
                                    <Form.Text className='text-dark'>current balance: {voucher?.ledger_from_balance}</Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>To (Ledger)</Form.Label>
                                    <Select2
                                        options={selectedLadgerTo}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className='text-dark'>current balance: {voucher?.ledger_to_balance}</Form.Text>
                                </Form.Group>
                            </div>
                            <div className="row mb-3">
                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control type="number" placeholder="Enter amount" name='amount' onChange={handleChange} required/>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail" className='col-md-6'>
                                    <Form.Label>Amount In Words</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Amount in Words" name='amount_word' onChange={handleChange} required/>
                                </Form.Group>
                            </div>

                            
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default create