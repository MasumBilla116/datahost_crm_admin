import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState, useRef } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Button from '../../../../components/elements/Button';
import Form from '../../../../components/elements/Form';
import Label from '../../../../components/elements/Label';
import Select2 from '../../../../components/elements/Select2';
import Select from '../../../../components/elements/Select';
import TextInput from '../../../../components/elements/TextInput';
import toast from "../../../../components/Toast/index";
import Axios from '../../../../utils/axios';
import Link  from 'next/link';
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import { Typeahead } from 'react-bootstrap-typeahead';
import SubSectors from '../../../../components/account_sector/SubSectors';
import RadioButton from "../../../../components/elements/RadioButton";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { TextField } from '@mui/material';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { HeadSection } from '../../../../components';

const CreateVoucher = () => {
  
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [vouchers, setVourchers] = useState([]);
  
  const [invoice, setInvoice] = useState({
    voucher_type:"",
    account_id:null,  
    sector_id:null,
    sector_name:"",
    amount:null,
    tempAmount:null,
    amount_type:"",
    remarks: "",
    invoice_remarks:"",
    // invoice_date:"",
    total_debit:0,
    total_credit:0
  })
  const [invoice_date, set_invoice_date] = useState("");
  const [openDate, setOpenDate] = useState(false);

  const changeSector = (e)=>{
    if(e.value){
      setInvoice(prev=>({
        ...prev, sector_id :e?.value, sector_name: e.label
      }))
    }
  }
  

  const [sectorLists, setSectorList] = useState([]);
  const [accounts, setAccounts] = useState([]);

 
  const handleChange =(e)=>{
    if(e.name == 'account'){
      setInvoice(prev=>({
      ...prev, account_id:e.value
      }))
    }
    else{
      setInvoice(prev=>({
        ...prev, [e.target.name]:e.target.value
      }))
    }
  }

  const [option,setOption] = useState([]);

  const treeFilterData = function (jsonData,level="") {
    
    for (const parent of jsonData) {
       if (parent.children_recursive) {
        if(parent?.children_recursive?.length != 0){
          setOption((prev)=>([...prev,{
            value:parent.id,
            label:level+parent.title,
            disabled: true
          }]));
        }
        else{
          setOption((prev)=>([...prev,{
            value:parent.id,
            label:level+parent.title,
            disabled: false
          }]));
        }
     
        treeFilterData(parent.children_recursive,level+"----");
      } else {
        
        setOption((prev)=>([...prev,{value:parent.id, label:level+parent.title}]));

      }
    }

  }

  useEffect(()=>{
    setOption([])
    sectorLists.length && treeFilterData(sectorLists);
  },[sectorLists.length])

  useEffect(()=>{
    const controller = new AbortController();
        const sectorList = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`,{account_type: invoice.voucher_type,action: "getSubSectors"})
            .then((res)=>{
                setSectorList(res.data.data);
            });
          };
          sectorList()
        return ()=> controller.abort();
  },[invoice.voucher_type])

  useEffect(()=>{
    const controller = new AbortController();
        const accountList = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,{action: "getAccounts", acctype: "all"})
            .then((res)=>{
                setAccounts(res.data.data);
            });
          };
          accountList()
        return ()=> controller.abort();
  },[])

  const {http} = Axios();
  const router = useRouter();
  const { pathname } = router;

  const [itemLoading, setItemLoading] = useState(true)
  
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pending, setPending] = useState(false)
  const [pendingCat, setPendingCat] = useState(false)
    
  const [ind, setInd] = useState(1)

  const StoringData =(e) =>{
      e.preventDefault();
      
      // setInvoice(prev=>({
      //   ...prev, amount: null, amount_type: "", remarks: ""
      // }))
      
      setInd(()=> ind+1)

      setVourchers([...vouchers, 
        {
          id: ind,
          sector: invoice.sector_id,
          sectorName: invoice.sector_name,
          amount: invoice.amount,
          amountType: invoice.amount_type,
          remarks: invoice.remarks,
        }
      ]) 

      if(invoice.amount_type == "debit"){
        setInvoice(prev=>({
          ...prev, total_debit: (Number(invoice.total_debit) + Number(invoice.amount))
        }))
      }

      if(invoice.amount_type == "credit"){
        setInvoice(prev=>({
          ...prev, total_credit: (Number(invoice.total_credit) + Number(invoice.amount))
        }))
      }
      e.target.reset();
  }

    const [objedit, setObjEdit] = useState(false);
    const [arrayIndex, setArrayIndex] = useState();
    const [editId, setEditId] = useState('');

    function editobj(index, editId){
      
      setObjEdit(true)
      setArrayIndex(index)
      setEditId(editId)

      setInvoice(prev=>({
        ...prev, amount: vouchers[index]?.amount, tempAmount: vouchers[index]?.amount, amount_type: vouchers[index]?.amountType, 
                 remarks: vouchers[index].remarks,
      }))
    }
    

    const UpdateData =(e) =>{
      e.preventDefault();

      const newState = vouchers.map(obj => {
        if (obj.id === editId) {

          return {...obj, amountType: invoice.amount_type, amount: invoice.amount, remarks: invoice.remarks,
                  };

        }
        return obj;
      });
  
      setVourchers(newState);

      let varingAmount = Number(invoice.amount) -  Number(invoice.tempAmount);
      if(varingAmount != 0){
        if(invoice.amount_type == "debit"){
          setInvoice(prev=>({
            ...prev, total_debit: (Number(invoice.total_debit) + varingAmount)
          }))
        }
        if(invoice.amount_type == "credit"){
          setInvoice(prev=>({
            ...prev, total_credit: (Number(invoice.total_credit) + varingAmount)
          }))
        }
      }

      setObjEdit(false)
      
      e.target.reset();

    } 
    
    const [deleteId, setDeleteId] = useState(null);
    async function removeObjectFromArray(id, index){
      setDeleteId(id)

      setInvoice(prev=>({
        ...prev, 
           amount: vouchers[index].amount, amount_type: vouchers[index].amountType
      }))

      setVourchers(current =>
        current.filter(obj => {
          return obj.id !== id;
        }),
      );
    };

    useEffect(()=>{
      if(deleteId != null){
        if(invoice.amount_type == "debit"){
            setInvoice(prev=>({
              ...prev, total_debit: (Number(invoice.total_debit) - Number(invoice.amount))
            }))
        }

        if(invoice.amount_type == "credit"){
        setInvoice(prev=>({
            ...prev, total_credit: (Number(invoice.total_credit) - Number(invoice.amount))
        }))
        }
      }
    },[deleteId])

    
    async function submitForm(e) {
      e.preventDefault();
      setLoading(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`,{action: "createInvoice", ...invoice,invoice_date, vouchers})
      .then((res)=>{
        setLoading(false)
         notify("success", "successfully Added!");
         router.push(`/modules/accounts/vouchers/details/${res.data.data}`);
         setVourchers([])
         e.target.reset();
      })
      .catch((e)=>{
        setLoading(false)
        const msg = e.response?.data?.response;

         if(typeof(e.response?.data?.response) == 'string'){
          notify("error", `${e.response.data.response}`);
         }
         else{
          if(msg?.invoice_date){
            notify("error", `Invoice date must not be empty`);
          }
          if(msg?.voucher_type){
            notify("error", `Voucher type must not be empty`);
          }
          if(msg?.account_id){
            notify("error", `Account must not be empty`);
          }
         }
      });
    }


    const theme = createTheme({

      components: {
        MuiFormLabel: {
          styleOverrides: {
            asterisk: { color: "red" },
          },
        },
      },
  
    })
    
      //breadcrumbs
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'Accounts Vouchers', link: '/modules/accounts/vouchers' },
        { text: 'Create Vouchers', link: '/modules/accounts/vouchers/create' },
    ]
    return ( 

      <>
      <HeadSection title="Create Vouchers" />
      <div className="container-fluid ">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
            <div className="col-md-6">


            <div className="card account-voucer-card">

                <div className="card-body border-bottom">
                  <h4 className="card-title">Accountng Voucher</h4>
                </div>

                <div className="card-body border-bottom">
                  <div className="mb-3 row">          
                    <Label text="Voucher Type"/>
                    <div className="col-sm-10">
                    <Select value={invoice.voucher_type} name="voucher_type" onChange={handleChange}>
                    <option value="">Select Account type</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="revenue">Revenue</option>
                    <option value="expenditure">Expenditure</option>
                    </Select>
                    </div>
                  </div>

                  <div className="mb-3 row">
                    <Label text="Accounts From" />
                    <div className="col-sm-10">
                        <Select2
                            maxMenuHeight={140}
                            options={accounts?.map(({name, id}) => ({ value: id, label: name, name: "account" }))}
                            onChange={handleChange}
                        />
                    </div>
                   </div>
                </div>

            </div>

              {objedit ? (
                <div className="card">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Update Voucher</h4>
                </div>
                <form onSubmit={UpdateData}>
                  <div className="card-body"> 

                  <TextInput type="number" name="amount" label="Amount" value={invoice.amount} placeholder="Amount" required onChange={handleChange} />
                  
                  {/* <div className="mb-3 row">          
                  <Label text="Amount Type"/>
                  <div className="col-sm-10">
                    <div className=" align-content-start flex-gap">
                        <div>
                            <RadioButton
                                id="debit"
                                label="Debit"
                                name="amount_type"
                                value="debit"
                                checked={invoice?.amount_type == "debit"}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <RadioButton
                                id="credit"
                                label="Credit"
                                name="amount_type"
                                value="credit"
                                checked={invoice?.amount_type == "credit"}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                  </div>
                  </div> */}
                  
                  <TextInput label="Remarks" name="remarks" value={invoice.remarks} placeholder="Remarks"  onChange={handleChange} />

                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <button  className="btn-info">
                        Update
                      </button>
                      <button onClick={() => setObjEdit(false)} className="btn-dark">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              ) : (
              <div className="card">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Create Voucher</h4>
                </div>

                <form onSubmit={StoringData}>
                  <div className="card-body">

                  <div className="mb-3 row">          
                    <Label text="Select Sector"/>
                    <div className="col-sm-10">
                    {/* <Select id="sectorSelect" onChange={changeSector} >
                      <option value="0">none</option>
                      {sectorLists &&
                      sectorLists?.map((sect,ind)=>(
                      <>
                        <option value={sect.id} data_name={sect.title} >{sect.title}</option>
                        {sect?.children_recursive?.length != 0 && (
                          <SubSectors sect={sect} dot='----' />
                        )} 
                      </>
                      ))
                      }
                    </Select> */}

                    <Select2
                      options={option}
                      onChange={changeSector}
                      name="access_id"
                      maxMenuHeight={200}
                      isOptionDisabled={(option) => option.disabled}
                    />

                    </div>
                  </div>

                  <TextInput type="number" name="amount" label="Amount" placeholder="Amount" required onChange={handleChange} />
                  
                  <div className="mb-3 row">          
                  <Label text="Amount Type"/>
                  <div className="col-sm-10">
                    <div className=" align-content-start flex-gap">
                        <div>
                            <RadioButton
                                id="debit"
                                label="Debit"
                                name="amount_type"
                                value="debit"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <RadioButton
                                id="credit"
                                label="Credit"
                                name="amount_type"
                                value="credit"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                  </div>
                  </div>
                  
                  <TextInput label="Remarks" name="remarks" placeholder="Remarks"  onChange={handleChange} />

                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button  className="btn-info">
                        Add to Voucher
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              )}
              

            </div>

            <div className="col-6">
            <div className="card">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Items</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    id="multi_col_order"
                    className="table table-striped table-bordered display"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Sector</th>
                        <th>Debit Amount</th>
                        <th>Credit Amount</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers?.map((item, index)=>(
                        <>
                        {item.itemId !== null && (                                                   
                          <tr key={index}>
                            <td>{item.sectorName}</td>
                            <td>{(item.amountType == 'debit' ? item.amount : 0)}</td>
                            <td style={{textAlign: 'center'}}>{(item.amountType == 'credit' ? item.amount : 0)}</td>
                            <td>{item.remarks}</td>
                            <td>
                            <ul className="action">
                                <li>
                                  <Link href="#">
                                    <a onClick={() => editobj(index, item.id)}>
                                      <EditIcon />
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                <Link href='#'>
                                   <a onClick={() => removeObjectFromArray(item.id, index)}>
                                     <DeleteIcon />
                                   </a>
                                </Link>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        )}
                        </>
                      ))}
                      
                    </tbody>
                    {/* {invoice.total_credit != 0 && invoice.total_debit != 0 && */}
                    <tr style={{background: 'pink'}}>
                      <td colspan="1" style={{textAlign: 'right'}}>total debit: </td>
                      <td>{invoice.total_debit}</td>
                      <td  style={{textAlign: 'left'}}>total credit: {invoice.total_credit}</td>
                      <td colspan="2"></td>
                    </tr>
                    {/* } */}
                  </table>
                  
                  <form onSubmit={submitForm}>

                      <div className="mb-3 row col-md-12">
                         <label className="col-md-3 col-form-label ">Invoice Remarks:</label>
                        <div className="col-md-5">
                          <input type="text" name="invoice_remarks" placeholder="Voucher Remarks" className="form-control" onChange={handleChange}/>
                        </div>
                      </div>
                      
                      
                      <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Invoice Date:</label>
                        <div className="col-sm-5">
                          {/* <input type="date" name="invoice_date" onChange={handleChange} className="form-control" id="date" /> */}
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker

                              size={1}
                              label="Enter the date"
                              open={openDate}
                              onClose={() => setOpenDate(false)}
                              value={invoice_date}
                              inputFormat="yyyy-MM-dd"
                              onChange={(event) => {
                                set_invoice_date(format(new Date(event), 'yyyy-MM-dd'));
                              }}


                              variant="inline"
                              openTo="year"
                              views={["year", "month", "day"]}

                              renderInput={(params) =>
                                <ThemeProvider theme={theme}>
                                  <TextField onClick={() => setOpenDate(true)} fullWidth={true} size='small' {...params} required />
                                </ThemeProvider>
                              }
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                      {loading ? 
                      <button disabled={loading} className="btn-danger rounded" style={{float: 'right'}}>
                         Processing...
                      </button>
                      : 
                      <button disabled={loading} className="btn-info rounded" style={{float: 'right'}}>
                            Create Voucher
                      </button> 
                      }
                  </form>    
                </div>
              </div>
            </div>
          </div>
            
        </div>
    </div>
      </>
     );
}
 
export default CreateVoucher; 
