import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Select2 from "../../../../components/elements/Select2";

import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { Button, Form } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import { DeleteIcon, HeadSection } from '../../../../components';
import PropagateLoading from '../../../../components/PropagateLoading';
import toast from "../../../../components/Toast/index";
import Axios from '../../../../utils/axios';
import { getSSRProps } from '../../../../utils/getSSRProps';


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.prchs.crt_invc" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const CreateInvoice = ({accessPermissions}) => {

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const router = useRouter();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [openDate, setOpenDate] = useState(false);
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [disType, setDisType] = useState();
  const [disTotalType, setDisTotalType] = useState();
  const [disPercentage, setDisPercentage] = useState("");
  const [totalDisPercentage, setTotalDisPercentage] = useState("");
  const [totalDisRate, setTotalDisRate] = useState("");
  const [disRate, setDisRate] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const [getItems, setItems] = useState("");
  const [totalRemarks, setTotalRemarks] = useState("");
  const [supplier, setSupplier] = useState([]);       /**Getting Suppliers */

  const [allSupplier, setAllSupplier] = useState([]);       /**Getting Suppliers */
  const items_options = getItems.data;

  /** Category Part*/
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryData, setCategoryData] = useState();
  const [itemCode, setItemCode] = useState("");
  const [itemCodeName, setItemCodeName] = useState("");
  const [item_obj, setItemObj] = useState();
  const [getItemCategories, setItemCategories] = useState("");
  const categories_options = getItemCategories.data;
  /**End Category Part*/

  const [SupplierInvoiceNumber, setSupplierInvoiceNumber] = useState("INV-");
  const [supplierID, setSupplierID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [localInv, setLocalInv] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [catPending, setCatPending] = useState(true);

  const [inv_item_ids, setInvItemIds] = useState([]);


  // let item_name_options = { value: item_obj?.id || '', label: item_obj?.name || 'Select...' };
  let item_name_options = { value: itemId || '', label: itemName || 'Select...' };
  var options = [];


  const [invoice, setInvoice] = useState([]);
  const [ind, setInd] = useState(1)

  const reset = () => {
    setRemarks("");
    setTotal(0);
    setQuantity(0)
    setUnitPrice(0)
    setItemCode("");
    setItemId("");
    setItemCodeName("")
    setCatPending(true)
    setItemName("")
    setItemId("")
  }

  const StoringData = (e) => {
    e.preventDefault();
    setGrandTotal(parseInt(grandTotal) + parseInt(total));
    // setQuantity("")
    // e.target.reset();

    setInd(() => ind + 1)

    setInvoice([...invoice,
    {
      id: ind,
      unitPrice: parseInt(unitPrice),
      qty: parseInt(quantity),
      total: parseInt(total),
      itemId: itemId,
      itemName: itemName,
      remarks: remarks,
      itemCode: itemCode,
      itemCodeName: itemCodeName
    }
    ])
    reset()
  }

  const [objedit, setObjEdit] = useState(false);
  const [arrayIndex, setArrayIndex] = useState();
  const [editId, setEditId] = useState();
  const [status, setStatus] = useState(false)

  const selected_category_options = { value: categoryId, label: categoryName };
  const selected_code_options = { value: itemCode, label: itemCodeName };
  const [selected_item_options, setSelected_item_options] = useState({ value: itemId, label: itemName });
  const [pending, setPending] = useState(true);

  const [tempTotal, setTempTotal] = useState(0);

  async function editobj(index, editId) {
    setObjEdit(true)
    setArrayIndex(index)
    setEditId(editId)
    setQuantity(invoice[index]?.qty)
    setRemarks(invoice[index]?.remarks)
    setItemId(invoice[index]?.itemId)
    setItemName(invoice[index]?.itemName)
    setCategoryId(invoice[index]?.catId)
    setCategoryName(invoice[index]?.catName)
    setItemCode(invoice[index]?.itemCode)
    setItemCodeName(invoice[index]?.itemCodeName)
    setUnitPrice(invoice[index].unitPrice)
    setTotal(invoice[index].total);
    setItemId(invoice[index].itemId);
    setTempTotal(invoice[index].total);
  }

  const increment_qty=(index, editId)=>{

    const newState = invoice.map(obj => {
      if (obj.id === editId) {
        
          return { ...obj,  qty: (parseInt(obj.qty) + 1), total: (obj.unitPrice * (parseInt(obj.qty) + 1)) };
    

      }
      return obj;
    });

    setInvoice(newState);


  }

  const changeItemQty=(e,index, editId)=>{

    const newState = invoice.map(obj => {
      if (obj.id === editId) {
        
          return { ...obj,  qty: e.target.value, total: (obj.unitPrice * parseInt(e.target.value)) };
    

      }
      return obj;
    });

    setInvoice(newState);

  }

  //Decrement the total qty
  const decrement_qty=(index, editId)=>{

    const newState = invoice.map(obj => {
      if (obj.id === editId && obj.qty > 0) {
        
          return { ...obj,  qty: (obj.qty - 1), total: (obj.unitPrice * (obj.qty - 1)) };
    

      }
      return obj;
    });

    setInvoice(newState);


  }

  //update grand total price
  useEffect(()=>{
    let priceArr = [];
    const updateGrand = invoice.map(obj=>{
      priceArr.push(obj.total);
    });

    const totalPrice = priceArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0); 

    setGrandTotal(totalPrice);

  },[invoice]);

  const UpdateData = (e) => {
    e.preventDefault();
    const newState = invoice.map(obj => {
      if (obj.id === editId) {
        if (item_name_options.value == '') {
          return { ...obj, itemId: itemId, itemName: itemName, remarks: remarks, qty: quantity, unitPrice: unitPrice, total: total };
        }
        else {
          return { ...obj, itemId: item_name_options.value, itemName: item_name_options.label, remarks: remarks, qty: quantity, unitPrice: unitPrice, total: total };
        }
      }
      return obj;
    });

    setInvoice(newState);
    e?.target.reset();
    setObjEdit(false)
    setGrandTotal(parseInt(grandTotal) - parseInt(tempTotal) + parseInt(total));
    reset()
  }

  async function removeObjectFromArray(id, itemId) {
    setInvoice(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );

    //remove itemId from array

    const indexToRemove = inv_item_ids.indexOf(itemId);

    if (indexToRemove !== -1) {
      inv_item_ids.splice(indexToRemove, 1);
    }

  };

  const changeCategory = (e) => {
    if (e.value) {
      setCategoryId(e.value);
      setCategoryName(e.label);
    }
  }
  const changeItem = (e) => {
    if (e.value) {
      setItemCode(e.value)
      setItemCodeName(e.label)
    }
  }
  async function submitForm(e) {
    e.preventDefault();
    if (supplierName && SupplierInvoiceNumber) {
      setLoading(true)
      let body = {
        action: "createSupplierInvoiceItem",
        invoice: invoice,
        status: true,
        localInv: localInv,
        totalRemarks: totalRemarks,
        inv_id: SupplierInvoiceNumber,
        inv_date: date,
        supplierID: supplierID,
        supplierName: supplierName
      }

      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, body)
        .then((res) => {
          setLoading(false)
          notify("success", "successfully Added!");
          // setInvoice([])
          router.push(`/modules/purchase/invoice`)
        })
      setGrandTotal(0)
    }
    else {
      notify("error", "fields must not be empty");
    }
  }

  const handleTotal = (e) => {
    if (e.target.name == 'unitCost') {
      setUnitPrice(e.target.value)
      setTotal(parseInt(e.target.value) * parseInt(quantity).toFixed(2));
      setTotalCost(parseInt(e.target.value) * parseInt(quantity));
    }
    else {
      setQuantity(e.target.value);
      setTotal((parseInt(e.target.value) * parseInt(unitPrice)).toFixed(2))
      setTotalCost(parseInt(e.target.value) * parseInt(unitPrice));
    }

  }
  const discountPercentage = (e) => {
    const disPercenatge = e.target.value;
    if (totalCost && disPercenatge >= 0 && disPercenatge < 101) {
      setDisPercentage(disPercenatge);
      const totalCostAfterDiscount = (totalCost - ((totalCost / 100) * disPercenatge))
      setTotal(totalCostAfterDiscount)
    }
  }
  const discountRate = (e) => {
    const disAmount = e.target.value;
    if (totalCost && disAmount <= totalCost) {
      setDisRate(disAmount);
      setTotal(totalCost - disAmount);
    }
  }

  const discount_options = [{ value: '2', label: 'Percentage' }, { value: '1', label: 'Plain' }];

  const totalDiscountPercentage = (e) => {
    const disPercenatge = e.target.value;
    if (grandTotal && disPercenatge >= 0 && disPercenatge < 101) {
      // grandTotalCost = grandTotal;
      setTotalDisPercentage(disPercenatge);
      const totalCostAfterDiscount = (grandTotal - ((grandTotal / 100) * disPercenatge))
      setGrandTotal(totalCostAfterDiscount)
    }
  }

  const totalDiscountRate = (e) => {
    const disAmount = e.target.value;
    if (grandTotal && disAmount <= grandTotal) {
      setTotalDisRate(disAmount);
    }
  }
  let supplierInvNumber = "";

  useEffect(() => {
    const controller = new AbortController();
    const getSuppliers = async () => {
      let body = {}
      body = {
        action: "getAllSupplier",
      }
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
        body
      ).then(result => {
        setSupplier(result.data.data);
      });

    }
    const getAllSupplierInvoice = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, { action: "getAllSupplierInvoice" })
        .then((res) => {
          setAllSupplier(res?.data?.data);

          //Generating Local-Inv operation starts here ----------------
          var today = new Date();
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear().toString().slice(-2);
          today = yyyy + mm;

          const LocalINVMiddlefix = today + "-";
          if (res?.data?.data?.length) {
            const LocalINVPrefix = (res?.data?.data[res?.data?.data.length - 1]?.local_invoice).slice(0, 3);
            const LocalINVPostfix = (res?.data?.data[res?.data?.data.length - 1]?.local_invoice).slice(-4)
            const LocalINVPostfixIncrement = parseInt(LocalINVPostfix) + 1;
            const LocalINVPostfixIncrementStr = ("0000" + LocalINVPostfixIncrement).slice(-4)
            setLocalInv(LocalINVPrefix + LocalINVMiddlefix + LocalINVPostfixIncrementStr);
          }
          else {
            setLocalInv("LP-" + LocalINVMiddlefix + "0001");
          }
          //Generating Local-Inv operation end here ----------------

        }).catch((err) => { console.log(err) });
    }
    getAllSupplierInvoice()
    getSuppliers();
    return () => controller.abort();
  }, [])

  useEffect(() => {
    const controller = new AbortController();

    async function getAllItems() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, { action: "getAllItems", })
        .then((res) => {
          setItems(res.data);
          setPending(false);
        });
    }
    const categoryList = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`, { action: "getAllCategories" })
        .then((res) => {
          setItemCategories(res.data);
          setCatPending(false)
        });
    };
    const getItemByCode = async () => {
      let isSubscribed = true;
      if (itemCode !== "") {
        setPending(true)
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`, { action: "getItemByCode", id: itemCode })
          .then((res) => {
            if (isSubscribed) {
              setItemId(res.data.data?.id);
              setUnitPrice(res?.data?.data?.unit_cost)
              setTotal(res?.data?.data?.unit_cost * quantity)
              setItemName(res.data.data?.name);
              setPending(false)
            }
          });
      }
      return () => isSubscribed = false;
    }
    getAllItems();
    categoryList()
    getItemByCode()

    return () => controller.abort();

  }, [])
  // supplierInvNumber = String("000000000000000" + (Number(supplierInv) + 1)).slice(-15);

  const [supplierDetails, setSupplierDetails] = useState([]);
  const [supplierInfoloading, setSupplierInfoLoading] = useState(false);

  const fetchSupplierDetails = async (id) => {
    setSupplierDetails([])
    setSupplierInfoLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`, { action: "getSupplierByID", id: id })
      .then((res) => {
        setSupplierDetails(res?.data?.data);
        setSupplierInfoLoading(false)
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

  });


  const { pathname } = router;

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Supplier ', link: '/modules/purchase/invoice' },
    { text: 'Create Supplier ', link: '/modules/purchase/invoice/inv-item' },
  ];

  return (
    <>
      <div className="container-fluid ">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Create Invoice" />
        <div className="row">
          <div className="col-md-12 p-xs-2 ">
            <div className="card shadow">
              <div className="border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className='fw-bolder'>
                    Create New Purchase Invoice
                  </strong>
                </h4>
                {/* <div> 
                  <strong className='fw-bolder'>
                    # {localInvNumber}
                  </strong>
                </div> */}
              </div>
              <div className="card-body">
                <Form>
                  <div className='row' className='mb-4' style={{borderBottom:'2px solid gray'}}>
                    <div className='col-md-12 p-0'>
                      <div className='mb-5 row'>
                        <Form.Group className='col-md-6'>
                          <Form.Label>Supplier Name:</Form.Label>
                          
                          {true && 
                          <>
                          <Select2
                            maxMenuHeight={140}
                            className=""
                            options={supplier?.map(({ id, name,contact_number }) => ({ value: id, label:`${name} - ${contact_number}`, contact_number:contact_number }))}
                            onChange={(e) => {
                              setSupplierID(e.value);
                              setSupplierName(e.label.split(' - ')[0]);
                              fetchSupplierDetails(e.value)
                            }}
                          />
                          </>
                          }

                          {false && <>
                            <Select2
                              maxMenuHeight={140}
                              className=""
                              options={supplier?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={(e) => {
                                setSupplierID(e.value);
                                setSupplierName(e.label);
                                fetchSupplierDetails(e.value)
                              }}
                              defaultValue={{ value: "", label: "loading..." }}
                            />
                          </>

                    
                          }
                        
                        </Form.Group>

                        <Form.Group className='col-md-6'>
                          <Form.Label>Purchase Date</Form.Label>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker

                              size={1}
                              label="Enter the date"
                              open={openDate}
                              onClose={() => setOpenDate(false)}
                              value={date}
                              inputFormat="yyyy-MM-dd"
                              onChange={(event) => {
                                setDate(format(new Date(event), 'yyyy-MM-dd'));
                              }}


                              // variant="inline"
                              // openTo="year"
                              // views={["year", "month", "day"]}

                              renderInput={(params) =>
                                <ThemeProvider theme={theme}>
                                  <TextField onClick={() => setOpenDate(true)} fullWidth={true} size='small' {...params} required />
                                </ThemeProvider>
                              }
                            />
                          </LocalizationProvider>
                        </Form.Group>
                      </div>

                      {/* {supplierDetails?.map((info) => {
                        return (
                          <>
                            <div className='pr-5 m-auto'>
                              <div className='mb-1'>
                                <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Name: </span>{info?.name}</span>&nbsp;
                                <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Contact number: </span>{info?.contact_number}</span>&nbsp;
                                <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Address: </span>{info?.address}</span>&nbsp;
                                <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Balance: </span>{info?.balance}</span>&nbsp;
                              </div>
                            </div>
                          </>
                        )
                      })}
                      {supplierInfoloading && <div className='text-center'>
                        <div className="text-center">
                          <PropagateLoading />
                        </div>
                      </div>} */}




                    </div>

                  </div>
                  <div className="row mt-2 mb-3">
                    <Form.Group>
                      <Form.Label>Item Select</Form.Label>
                      <Select2
                        // className="select-bg"
                        options={items_options?.map(({ id, name, unit_cost, code }) => ({ value: id, label:`${code}--${name}`, unitCost: unit_cost, code: code }))}
                        value={item_name_options}
                        onChange={(e) => {
                          setItemCode(e.value);
                          setItemCodeName(e.code)
                          setItemId(e.value);
                          setItemName(e.label.split('--')[1]);
                          setUnitPrice(e.unitCost);

                          //if already selected, not selected
                          if (!inv_item_ids.includes(e.value)) {
                            setInvItemIds(prev=>[...prev, e.value]);
                            setInd(() => ind + 1);
  
                            setInvoice((prev)=>[...prev,{
                              id: ind,
                              unitPrice: parseInt(e.unitCost),
                              qty: parseInt(1),
                              total: parseInt(e.unitCost),
                              itemId: e.value,
                              itemName: e.label.split('--')[1],
                              remarks: remarks,
                              itemCode: e.value,
                              itemCodeName: e.code
                            }]) 
                          }
                

                        }}
                      />
                    </Form.Group>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 table-responsive">
                    <Table striped bordered hover>
                      <thead className='border-0' style={{backgroundColor:"#337AB7",color:"#ffffff"}}>
                        <tr className='text-center'>
                          <th className='fw-bolder'>Item Name</th>
                          <th className='fw-bolder'>Item Code</th>
                          <th className='fw-bolder'>Unit Cost</th>
                          <th className='fw-bolder'>Quantity</th>
                          <th className='fw-bolder'>Total</th>
                          {/* <th className='fw-bolder'>Remarks</th> */}
                          <th className='fw-bolder'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice?.map((item, index) => (
                          <>
                            {item.itemId !== null && (
                              <tr className='text-center' key={index}>
                                {/* <td>{item.id}</td> */}
                                <td>{item.itemName}</td>
                                <td>{item.itemCodeName}</td>
                                <td>{item.unitPrice}</td>
                                <td style={{width:"200px"}}>

                                  <div className="input-group ">
                                    <span className="input-group-btn">
                                      <Button 
                                        variant='danger'
                                        onClick={()=>decrement_qty(index, item.id)}
                                      >
                                        <i className="fa fa-minus text-white" />
                                      </Button>
                                    </span>
                                    <input
                                      typ="number"
                                      value={item.qty}
                                      className="form-control no-padding text-center"
                                      onChange={(e)=>changeItemQty(e,index, item.id)}
                                      
                                    />
                                    <span className="input-group-btn">
                                      <Button
                                        variant='primary'
                                        onClick={()=>increment_qty(index, item.id)}
                                        
                                      >
                                        <i className="fa fa-plus text-white" />
                                      </Button>
                                    </span>
                                  </div>



                                </td>
                                <td>{(item.qty * item.unitPrice).toFixed(2)}</td>
                                {/* <td>{item.remarks}</td> */}
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
                                        <a onClick={() => { removeObjectFromArray(item.id,item.itemId) }}>
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
                    </Table>
                    </div>

                    <div className='row mt-4 mb-3'>
                        <Form.Group controlId="formBasicName" className='col-md-6'>
                          <Form.Label>Remarks</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder="Enter Category Description"
                            name='remarks'
                            value={totalRemarks} 
                            onChange={(e) => setTotalRemarks(e.target.value)}
                            
                          />
                        </Form.Group>
                      </div>

                    {!!grandTotal && <div className='text-end fw-bold mb-3 me-2'>Total Amount: <span>{grandTotal && Number(grandTotal).toFixed(2)}</span></div>}
                        <div className="text-end">
                          {accessPermissions.createAndUpdate &&<Button variant="success" style={{ float: 'right' }} disabled={!invoice.length} onClick={submitForm}>
                            Create Invoice
                          </Button>}
                        </div>

                  </div>


                </Form>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default CreateInvoice;