import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Button from '../../../../../components/elements/Button';
import Form from '../../../../../components/elements/Form';
import Label from '../../../../../components/elements/Label';
import Select2 from '../../../../../components/elements/Select2';
import Select from '../../../../../components/elements/Select';
import TextInput from '../../../../../components/elements/TextInput';
import toast from "../../../../../components/Toast/index";
import Axios from '../../../../../utils/axios';
import Link  from 'next/link';
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import SubSectors from '../../../../../components/account_sector/SubSectors';
import RadioButton from "../../../../../components/elements/RadioButton";
import { HeadSection } from '../../../../../components';
import Breadcrumbs from '../../../../../components/Breadcrumbs';

const CreateVoucher = () => {
  
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

    const {http} = Axios();
    const router = useRouter();

    const { pathname } = router;
    const { id } = router.query;

    const [vouchers, setVouchers] = useState([]);
    const [deletedVouchers, setDeletedVouchers] = useState([])


    const [invoice, setInvoice] = useState({
        voucher_type:"",
        account_id:null,
        account_name:"",  
        sector_id:null,
        sector_name:"",
        amount:null,
        amount_type:"",
        remarks: "",
        invoice_remarks:"",
        invoice_date:"",
        total_debit:0,
        total_credit:0
      })

    const [sectorLists, setSectorList] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const changeSector = (e)=>{
      if(e.value){
        setInvoice(prev=>({
          ...prev, sector_id :e?.value, sector_name: e.label
        }))
      }
    }

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
    
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pending, setPending] = useState(false)

    const [switcher, setSwitcher] = useState(true);

    useEffect(()=>{
      const controller = new AbortController();
        async function getVoucherInfo(){
          if(switcher){  
          await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`,{action: "getInvoiceInfo", invoice_id: id})
            .then((res)=>{
                setInvoice(prev=>({
                    ...prev, invoice_date : res?.data?.data?.voucher_date, voucher_type : res?.data?.data?.voucher_type, account_id : res?.data?.data?.account_id,
                    account_name : res?.data?.data?.account?.account_name, total_debit : res?.data?.data?.total_debit, total_credit : res?.data?.data?.total_credit,
                    invoice_remarks : res?.data?.data?.remarks
                }))
                setInd(res?.data?.data?.last_invoice_id)

                let i;
                const voucherArr = [];
                for(i=0; i < res?.data?.data?.invoice_list.length; i++){
                  voucherArr.push({
                      id: res?.data?.data?.invoice_list[i].id,
                      sector: res?.data?.data?.invoice_list[i].sector,
                      sectorName: res?.data?.data?.invoice_list[i].sectorName,
                      amount: (res?.data?.data?.invoice_list[i].debit == 0 ? res?.data?.data?.invoice_list[i].credit : res?.data?.data?.invoice_list[i].debit),
                      amountType: (res?.data?.data?.invoice_list[i].debit == 0 ? "credit" : "debit"),
                      remarks: res?.data?.data?.invoice_list[i].remarks,
                  })
                }
                setVouchers(voucherArr)
            });
          }
        }

        router.isReady && getVoucherInfo()
    
        return ()=> controller.abort();

    },[id])
    
    const [ind, setInd] = useState()

    const StoringData =(e) =>{
      e.preventDefault();
      
      setInd(()=> ind+1)

      setVouchers([...vouchers, 
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

    const [deleteId, setDeleteId] = useState(null);
    async function removeObjectFromArray(id, index){
      setDeleteId(id)
      setDeletedVouchers([...deletedVouchers, 
        {
          id: vouchers[index]?.id,
          sector: vouchers[index]?.sector,
          sectorName: vouchers[index]?.sectorName,
          amount: vouchers[index]?.amount,
          amountType: vouchers[index]?.amountType,
          remarks: vouchers[index]?.remarks,
        }
      ]) 

      setInvoice(prev=>({
        ...prev, 
           amount: vouchers[index].amount, amount_type: vouchers[index].amountType
      }))

      setVouchers(current =>
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
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`,{action: "updateVoucher", invoice_id: id, ...invoice, vouchers, deletedVouchers})
      .then((res)=>{
        setLoading(false)
         notify("success", "successfully Updated!");
         router.push('/modules/accounts/vouchers');
         setVourchers([])
         e.target.reset();
      })
      .catch((e)=>{
        setLoading(false)
        const msg = e.response?.data?.response;
         if(typeof(e.response?.data?.response) == 'string'){
          notify("error", `${e.response?.data?.response}`);
         }
         else{
          if(msg?.invoice_date){
            notify("error", `Invoice date must not be empty`);
          }
          if(msg?.customer_type){
            notify("error", `Customer type must not be empty`);
          }
         }
      });
     }


           //breadcrumbs
           const breadcrumbs = [
            { text: 'Dashboard', link: '/dashboard' },
            { text: 'Accounts Vouchers', link: '/modules/accounts/vouchers' },
            { text: 'Update Vouchers', link: '/modules/accounts/vouchers/update/[id]' },
        ]

    return ( 
      <>
      <HeadSection title="Update Accounts Voucher" />
      <div className="container-fluid ">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
            <div className="col-md-6">
                <div className="card account-voucer-card">
                    <div className="card-body border-bottom">
                        <h4 className="card-title">Accounts Voucher</h4>
                    </div>
                    <div className="card-body border-bottom">
                        <div className="mb-3 row">          
                            <Label text="Voucher Type"/>
                            <div className="col-sm-10">
                                <Select disabled="true" value={invoice.voucher_type} name="voucher_type" onChange={handleChange}>
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
                                isDisabled={true}
                                maxMenuHeight={140}
                                options={accounts?.map(({name, id}) => ({ value: id, label: name, name: "account" }))}
                                onChange={handleChange}
                                value={{value: invoice.account_id, label: invoice.account_name}}
                                />
                            </div>
                        </div>
                    </div>
                </div>

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
             
              
            </div>

            <div className="col-md-6">
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
                                {/* <li>
                                  <Link href="#">
                                    <a onClick={() => editobj(index, item.id)}>
                                      <EditIcon />
                                    </a>
                                  </Link>
                                </li> */}
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

                    {invoice.net_total != 0 &&
                    <tr style={{background: 'pink'}}>
                        <td colspan="1" style={{textAlign: 'right'}}>total debit: </td>
                        <td>{invoice.total_debit}</td>
                        <td  style={{textAlign: 'left'}}>total credit: {invoice.total_credit}</td>
                        <td colspan="2"></td>
                    </tr>
                    }
                  </table>
                  
                  <form onSubmit={submitForm}>

                      <div className="mb-3 row col-md-12">
                         <label className="col-md-3 col-form-label ">Invoice Remarks:</label>
                        <div className="col-md-5">
                          <input type="text" value={invoice.invoice_remarks} name="invoice_remarks" placeholder="Voucher Remarks" className="form-control" onChange={handleChange}/>
                        </div>
                      </div>
                      
                      <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Invoice Date:</label>
                        <div className="col-sm-5">
                          <input type="date" defaultValue={invoice.invoice_date} name="invoice_date" onChange={handleChange} className="form-control" id="date" />
                        </div>
                      </div>

                      {loading ? 
                      <button disabled={loading} className="btn-danger rounded" style={{float: 'right'}}>
                         Processing...
                      </button>
                      : 
                      <button disabled={loading} className="btn-info rounded" style={{float: 'right'}}>
                          Update Voucher
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