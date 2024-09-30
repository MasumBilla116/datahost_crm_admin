import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DeleteIcon, EditIcon, Label, Select2, TextInput } from '../../../../../components';
import toast from "../../../../../components/Toast/index";
import Axios from '../../../../../utils/axios';



const UpdateInvoice = () => {

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  // const [item, setItem]= useState({
  //   itemData:[
  //     {id: 0, code: 'select value', name: '', inventory_category_id: '', description: ''},

  //   ],
  // })

  const { http } = Axios();
  const router = useRouter();
  const { id } = router.query;

  const [invoice, setInvoice] = useState([]);
  const [deletedInvoice, setdeletedInvoice] = useState([])

  const [date, setDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [test, setTest] = useState("");
  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryData, setCategoryData] = useState();
  const [itemCode, setItemCode] = useState("");
  const [itemCodeName, setItemCodeName] = useState("");
  const [item_obj, setItemObj] = useState();
  //const [code_obj, setCodeObj] = useState();
  const [remarks, setRemarks] = useState("");
  const [totalRemarks, setTotalRemarks] = useState("");
  const [quantity, setQuantity] = useState();
  const [getItems, setItems] = useState();
  const items_options = getItems?.data;
  const [getItemCategories, setItemCategories] = useState("");
  const categories_options = getItemCategories.data;
  const [switcher, setSwitcher] = useState(true);
  const [itemLoading, setItemLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)
  const [total, setTotal] = useState(0);

  const [initialLoading, setInitailLoading] = useState(true);

  let item_name_options = { value: itemId || '', label: itemName || 'Select...' };

  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)
  const [pendingCat, setPendingCat] = useState(true)
  const [supplierID, setSupplierID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierNamePending, setSupplierNamePending] = useState(true);

  const [disable, setDisable] = useState(true);

  // const [itemListLoading, setItemListLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController();
    async function getInvoiceDetails() {
      if (switcher) {
        if (!invoice.length) {
          await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, { action: "getInvoiceDetails", supplier_invoice_id: id })
            .then((res) => {
              console.log(res?.data?.data[0].remarks)
              setRemarks(res?.data?.data[0]?.item_remarks)
              setTotalRemarks(res?.data?.data[0]?.common_remarks)
              setDate(res?.data?.data[0]?.created_at)
              setTotalAmount(parseInt(res?.data?.data[0]?.totalAmount))
              setInvoice(res?.data?.data)
              setInitailLoading(false);
              setDisable(false)
            });
        }
      }
    }

    async function getAllItems() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, { action: "getAllItems" })
        .then((res) => {
          setItems(res?.data);
          setSupplierNamePending(false)
        });
    }
    const categoryList = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`, { action: "getAllCategories" })
        .then((res) => {
          setItemCategories(res.data);
          setCatPending(false)
        });
    };

    router.isReady && getInvoiceDetails()
    getItemByCategory()
    getAllItems();
    getSuppliers();
    categoryList();
    getItemByCode();
    return () => controller.abort();

  }, [id, categoryId, itemCode])


  const [ind, setInd] = useState(1)

  const StoringData = (e) => {
    setTotalAmount(totalAmount + total);
    console.log(totalAmount);
    console.log(total);
    e.preventDefault();
    e.target.reset();
    setInd(() => ind + 1)

    if (item_name_options.value == '') {
      //   setInvoice([...invoice,
      //   {
      //     id: ind,
      //     // catId: categoryId,
      //     // catName: categoryName,
      //     itemCode: itemCode,
      //     itemCodeName: itemCodeName,
      //     itemId: itemId,
      //     itemName: itemName,
      //     remarks: remarks,
      //     item_qty: quantity
      //   }
      //   ])
      // }
      // else {
      //   setInvoice([...invoice,
      //   {
      //     id: ind,
      //     // catId: categoryId,
      //     // catName: categoryName,
      //     itemCode: itemCode,
      //     itemCodeName: itemCodeName,
      //     itemId: item_name_options.value,
      //     itemName: item_name_options.label,
      //     remarks: remarks,
      //     item_qty: quantity
      //   }
      //   ])
      //   setItemObj(null)
      // }
      // setDisPercentage("")
      // setDisRate("")
      // setUnitPrice("")
      // setTotal("")
      // setQuantity("")
      // setRemarks("")
    }
    setInvoice([...invoice,
    {
      id: ind,
      unitPrice: unitPrice,
      item_qty: quantity,
      unitPrice: unitPrice,
      total: total,
      itemId: itemId,
      itemName: itemName,
      item_remarks: remarks,
      status: 1,
      // isReturn: status,
      // item_qty: quantity,
      // bonusPercentage: disPercentage,
      // bonusRate: disRate
    }
    ])
  }

  const [objedit, setObjEdit] = useState(false);
  const [arrayIndex, setArrayIndex] = useState();
  const [editId, setEditId] = useState('');
  const [editedItemId, setEditedItemId] = useState('');
  const [editedItemName, setEditedItemName] = useState('');

  const selected_category_options = { value: categoryId, label: categoryName };
  const selected_code_options = { value: itemCode, label: itemCodeName };
  const selected_item_options = { value: itemId, label: itemName };
  const [catPending, setCatPending] = useState(true);
  const [supplier, setSupplier] = useState([]);
  const [supplierInv, setSupplierInv] = useState("");
  const [tempTotal, setTempTotal] = useState(0);

  const getSuppliers = async () => {
    let body: any = {}
    body = {
      action: "getAllSupplier",
    }
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
      body
    ).then(result => {
      setSupplier(result.data.data);
    });

  }

  function editobj(index, editId) {
    setObjEdit(true)
    setArrayIndex(index)
    setEditId(editId)
    setQuantity(invoice[index]?.item_qty)
    setRemarks(invoice[index]?.item_remarks)
    setItemId(invoice[index]?.itemId)
    setItemName(invoice[index]?.itemName)
    setCategoryId(invoice[index]?.catId)
    setCategoryName(invoice[index]?.catName)
    setItemCode(invoice[index]?.itemCode)
    setItemCodeName(invoice[index]?.itemCodeName)
    setUnitPrice(invoice[index]?.unitPrice)
    setTotal(invoice[index]?.unitPrice * invoice[index]?.item_qty)
    setTempTotal(invoice[index]?.unitPrice * invoice[index]?.item_qty);
  }

  const UpdateData = (e) => {
    e.preventDefault();

    const newState = invoice.map(obj => {
      if (obj.id === editId) {
        if (item_name_options.value == '') {
          return { ...obj, itemCode: itemId, itemCodeName: itemCodeName, itemId: itemId, itemName: itemName, common_remarks: totalRemarks, item_remarks: remarks, item_qty: quantity, unitPrice: unitPrice };
        }
        else {
          return { ...obj, itemCode: itemId, itemCodeName: itemCodeName, itemId: item_name_options.value, itemName: item_name_options.label, common_remarks: totalRemarks, item_remarks: remarks, item_qty: quantity, unitPrice: unitPrice };
        }
      }
      return obj;
    });

    setInvoice(newState);
    e.target.reset();
    setObjEdit(false)
    setTotalAmount(totalAmount - tempTotal + total);
  }

  async function removeObjectFromArray(id, index) {

    setTotalAmount(totalAmount - invoice[index].item_qty * invoice[index].unitPrice)
    setdeletedInvoice([...deletedInvoice,
    invoice[index]
    ])

    setInvoice(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );

  };

  const changeCategory = (e) => {
    if (e.value) {
      setCategoryId(e.value);
      setCategoryName(e.label);
    }
  }

  const getItemByCategory = async () => {
    let isSubscribed = true;
    if (categoryId !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, { action: "getAllItems", })
        .then((res) => {
          if (isSubscribed) {
            console.log(res);
            setCategoryData(res.data.data);
            setPending(false)
          }
        });
    }
    return () => isSubscribed = false;
  }

  const changeItem = (e) => {
    if (e.value) {
      setItemCode(e.value)
      setItemCodeName(e.label)
    }
  }

  const getItemByCode = async () => {
    let isSubscribed = true;
    if (itemCode !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`, { action: "getItemByCode", id: itemCode })
        .then((res) => {
          if (isSubscribed) {
            //setItemObj(res.data.data);
            setItemId(res.data.data.id);
            setItemName(res.data.data.name);
            setPending(false)
            setSwitcher(false);
          }
        });
    }
    return () => isSubscribed = false;
  }

  const changeItemCode = (e) => {
    if (e.value) {
      console.log(quantity)
      setItemId(e.value);
      setItemName(e.label);
      setItemCodeName(e.code)
      setUnitPrice(e.unitCost)
      // setTotal(e.unitCost * quantity);
    }
  }

  // const getCodeByItem = async()=>{
  //   let isSubscribed = true;
  //   if(itemId !== ""){
  //     setPendingCode(true)
  //     await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,{action: "getCodeByItem",id: test})
  //     .then((res)=>{
  //       if(isSubscribed){

  //         setCodeObj(res.data.data);

  //         setPendingCode(false)
  //       }
  //     });
  //   }
  //   return ()=> isSubscribed=false;
  // }

  async function submitForm(e) {
    e.preventDefault();
    console.log(totalRemarks)
    setLoading(true)
    invoice.map((item, index) => { delete item.common_remarks; delete item.totalAmount; })
    deletedInvoice.map((itm, ind) => { deletedInvoice[ind].status = 0; delete itm.totalAmount; delete itm.common_remarks; })
    let body = {
      action: "updateInvoice",
      invoice: invoice,
      status: true,
      localInvoice: supplierInv,
      supplierID: supplierID,
      supplier_invoice_id: id,
      totalRemarks: totalRemarks,
      totalAmount: totalAmount,
      inv_date: date,
      deletedInvoice: deletedInvoice
      // inv_id: SupplierInvoiceNumber,
      // supplierID: supplierID,
      // supplierName: supplierName
    }
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`, body)
      .then((res) => {
        console.log(res)
        setLoading(false)
        console.log(res)
        notify("success", "successfully Updated!");
        // setVourchers([])
        e.target.reset();
      })
      .catch((e) => {
        setLoading(false)
        const msg = e.response?.data?.response;

        if (typeof (e.response?.data?.response) == 'string') {
          notify("error", `${e.response?.data?.response}`);
        }
        else {
          if (msg?.date) {
            notify("error", `${msg?.date?.Date}`);
          }
        }
      });
  }
  const [totalCost, setTotalCost] = useState("");
  // const [totalCost, setTotalCost] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);

  const handleTotal = (e) => {
    if (e.target.name == 'unitCost') {
      setUnitPrice(e.target.value)
      setTotal(Number(e.target.value) * Number(quantity));
      // setTotalCost(Number(e.target.value) * Number(quantity));
    }
    else {
      setQuantity(e.target.value);
      setTotal(Number(e.target.value) * Number(unitPrice))
      // setTotalCost(Number(e.target.value) * Number(unitPrice));
    }

  }
  const [supplierDetails, setSupplierDetails] = useState([]);
  const [supplierInfoloading, setSupplierInfoLoading] = useState(true);

  const fetchSupplierDetails = async (id) => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`, { action: "getSupplierByID", id: id })
      .then((res) => {
        setSupplierDetails(res?.data?.data);
        setSupplierInfoLoading(false)
      });
  }
  // console.log(invoice)
  console.log(supplier)
  return (

    <>
      <div className="container-fluid ">
        <div className="row">
          {/* //-------------------- Supplier Name -------------------- */}
          <div className="col-md-6">
            <div className="card shadow p-3">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">
                  <strong className='fw-bolder'>
                    Invoice Info
                  </strong>
                </h4>
              </div>
              <div className="card-body">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="table-responsive " style={{ minHeight: "400px", overflowX: "hidden" }}>
                    <div className="mb-3 row">

                      {/* Discount calculation */}
                      {/* <div className="mb-3 row">
                        <Label text="Discount Type" />
                        <div className="col-sm-9 col-lg-9 col-md-7">
                          <Select2
                            options={discount_options}
                            onChange={(e) => {
                              setDisTotalType(e)
                            }}
                            defaultValue={{ value: "0", label: "None" }}
                          />
                        </div>
                      </div>
                      {disTotalType?.label === "Percentage" && <TextInput type="number" label="Discount rate" placeholder="0%" onChange={(e) => totalDiscountPercentage(e)} value={totalDisPercentage} />}
                      {disTotalType?.label === "Plain" && <TextInput type="number" label="Discount" placeholder="0" onChange={(e) => totalDiscountRate(e)} value={totalDisRate} />} */}
                      {/* <TextInput type="number" label="Paid" name="supplierInvoiceNumber" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                      <TextInput type="number" label="Due" name="supplierInvoiceNumber" placeholder="Due" value={grandTotal - paidAmount} /> */}
                      <TextInput type="text" label="Supplier Inv No" name="supplierInvoiceNumber" value={supplierInv} placeholder="Supplier Invoice Number" required onChange={(e) => setSupplierInv(e.target.value)} />
                      <Label text="Select Supplier" />
                      {supplierNamePending && <div className="col-sm-9 col-lg-9 col-md-7 ">
                        <Select2
                          options={supplier?.map(({ id, name }) => ({ value: id, label: name }))}
                          onChange={(e:any) => {
                            setSupplierID(e.value);
                            setSupplierName(e.label);
                            fetchSupplierDetails(e.value)
                          }}
                          defaultValue={{ value: "", label: "loading..." }}
                        />
                      </div>}
                      {!supplierNamePending && <div className="col-sm-9 col-lg-9 col-md-7">
                        <Select2
                          options={supplier?.map(({ id, name }) => ({ value: id, label: name }))}
                          onChange={(e:any) => {
                            setSupplierID(e.value);
                            setSupplierName(e.label);
                            fetchSupplierDetails(e.value)
                          }}
                        />
                      </div>}
                    </div>
                    <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Invoice Remarks:</label>
                      <div className="col-md-5">
                        <input type="text" placeholder="Invoice Remarks" className="form-control" disabled={disable} onChange={(e) => setTotalRemarks(e.target.value)} />
                      </div>
                    </div>

                    <div className="mb-3 row col-md-12">
                      <label className="col-md-3 col-form-label ">Invoice Date:</label>
                      <div className="col-sm-5">
                        <input type="date" name="inv_date" disabled={disable} onChange={(e) => setDate(e.target.value)} className="form-control" id="date" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* //-------------------- Supplier Name Ends-------------------- */}
          {/* //-------------------- Supplier Name Details-------------------- */}
          <div className="col-md-6">
            <div className="card shadow p-3" >
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">
                  <strong className='fw-bolder'>
                    Supplier Details
                  </strong>
                </h4>
              </div>
              <div className="card-body">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="table-responsive" style={{ height: "400px", overflowX: "hidden" }}>
                    {supplierDetails?.map((info) => {
                      return (
                        <>
                          <TextInput type="text" label="Name" placeholder="Total Cost" disabled value={!!!info.name ? "Not Found" : info.name} />
                          <TextInput type="text" label="Type" placeholder="Total Cost" disabled value={info.type} />
                          <TextInput type="text" label="Contact Number" placeholder="Total Cost" disabled value={info.contact_number} />
                          <TextInput type="text" label="Email" placeholder="Total Cost" disabled value={info.email} />
                          <TextInput type="text" label="Priority" placeholder="Total Cost" disabled value={info.priority} />
                          <TextInput type="text" label="Description" placeholder="Total Cost" disabled value={info.description} />
                          <TextInput type="text" label="Tax id" placeholder="Total Cost" disabled value={info.tax_id} />
                          <TextInput type="text" label="Bank name" placeholder="Total Cost" disabled value={info.bank_name} />
                          <TextInput type="text" label="Bank account number" placeholder="Total Cost" disabled value={info.bank_acc_number} />
                          <TextInput type="text" label="Address" placeholder="Total Cost" disabled value={info.address} />
                          <TextInput type="text" label="Country name" placeholder="Total Cost" disabled value={info.country_name} />
                          <TextInput type="text" label="Amount" placeholder="Total Cost" disabled value={!!!info?.amount ? "No invoice found" : info.amount} />
                          </>
                      )
                    })}
                    {supplierInfoloading && <div className='text-center' style={{ marginTop: "150px" }}>
                      <div className="spinner-grow spinner-grow-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="spinner-grow spinner-grow-sm mx-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="spinner-grow spinner-grow-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* //-------------------- Supplier Name Details Ends-------------------- */}

        <div className="row">
          <div className="col-md-6">
            {/* -------------------- Invoice Update Starts -------------------- */}
            {objedit ? (
              <div className="card shadow p-3">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Update Invoice</h4>
                </div>
                <form onSubmit={UpdateData}>
                  <div className="card-body">
                    {pending &&
                      <div className="mb-3 row">
                        <Label text="Select Item" />
                        <div className="col-sm-10">
                          <Select2
                            options={categoryData?.map(({ id, name }) => ({ value: id, label: name }))}
                            onChange={changeItemCode}
                            value={{ value: "", label: "loading..." }}
                          />
                        </div>
                      </div>
                    }
                    {!pending &&
                      <div className="mb-3 row">
                        <Label text="Select Item" />
                        <div className="col-sm-10">
                          <Select2
                            options={categoryData?.map(({ id, name, code, unit_cost }) => ({ value: id, label: name, code: code, unitCost: unit_cost }))}
                            value={item_name_options}
                            onChange={changeItemCode}
                          />
                        </div>
                      </div>}

                    <TextInput type="number" label="Unit Cost" name="unitCost" value={unitPrice} placeholder="Unit Price" required onChange={handleTotal} />
                    <TextInput type="number" label="Qty" value={quantity} required onChange={handleTotal} />
                    <TextInput type="text" label="Total" placeholder="Total Cost" disabled value={total} />
                    <TextInput label="Remarks" placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />

                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button variant='success' className='me-2' type='dubmit'>
                        Update
                      </Button>
                      <Button variant='danger' onClick={() => setObjEdit(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              //  -------------------- Invoice Update Ends  --------------------
            ) : (
              //-------------------- Invoice Entry Starts --------------------
              <div className="card shadow p-3">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Create Invoice</h4>
                </div>
                <form onSubmit={StoringData}>
                  <div className="card-body">
                    {!catPending && <div className="mb-3 row">
                      <Label text="Select Category" />
                      <div className="col-sm-10">
                        <Select2
                          options={categories_options?.map(({ id, name }) => ({ value: id, label: name }))}
                          onChange={changeCategory}
                        />
                      </div>
                    </div>}
                    {catPending && <div className="mb-3 row">
                      <Label text="Select Category" />
                      <div className="col-sm-10">
                        <Select2
                          options={categories_options?.map(({ id, name }) => ({ value: id, label: name }))}
                          onChange={changeCategory}
                          defaultValue={{ value: "", label: "loading..." }}
                        />
                      </div>
                    </div>}

                    {/* {pendingCode &&
                    <div className="mb-3 row">          
                    <Label text="Select Item Code"/>
                    <div className="col-sm-10">
                    <Select2
                        options={items_options?.map(({ id, code }) => ({ value: id, label: code}))}
                        onChange={changeItem}
                    />
                    </div>
                    </div>
                    } */}

                    {/* {itemLoading &&
                    <div className="mb-3 row">          
                    <Label text="Select Item Code"/>
                    <div className="col-sm-10">
                    <Select2
                        options={item?.itemData?.map(({ id, code }) => ({ value: id, label: code}))}
                        onChange={changeItem}
                        //defaultValue={item_code_options} 
                    />
                    </div>
                    </div>
                    } */}

                    <div className="mb-3 row">
                      <Label text="Select Item Code" />
                      <div className="col-sm-10">
                        <Select2
                          options={items_options?.map(({ id, code }) => ({ value: id, label: code }))}
                          onChange={changeItem}
                          value={selected_code_options}
                        />
                      </div>
                    </div>
                    {pending &&
                      <div className="mb-3 row">
                        <Label text="Select Item" />
                        <div className="col-sm-10">
                          <Select2
                            options={categoryData?.map(({ id, name, code }) => ({ value: id, label: name, code: code }))}
                            onChange={changeItemCode}
                            defaultValue={{ value: "", label: "loading..." }}
                          />
                        </div>
                      </div>
                    }
                    {!pending &&
                      <div className="mb-3 row">
                        <Label text="Select Item" />
                        <div className="col-sm-10">
                          <Select2
                            options={categoryData?.map(({ id, name, unit_cost }) => ({ value: id, label: name, unitCost: unit_cost }))}
                            defaultValue={item_name_options}
                            // onChange={changeItemCode}
                            onChange={(e) => {
                              console.log(e)
                              setItemId(e.value);
                              setItemName(e.label);
                              setUnitPrice(e.unitCost);
                              //console.log(e.unitCost);
                            }}
                          />
                        </div>
                      </div>
                    }

                    {/* <TextInput type="number" label="Qty" placeholder="item qty" required onChange={(e) => setQuantity(e.target.value)} /> */}
                    <TextInput type="number" label="Unit Cost" name="unitCost" value={unitPrice} placeholder="Unit Price" required onChange={handleTotal} />
                    <TextInput type="number" label="Qty" name="qty" placeholder="item qty" required onChange={handleTotal} />
                    <TextInput type="text" label="Total" placeholder="Total Cost" disabled value={total} />
                    <TextInput type="text" label="Remarks" placeholder="Remarks" onChange={(e) => setRemarks(e.target.value)} />
                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button
                        className="shadow rounded"
                        variant="primary"
                        type="submit"
                      >
                        Add to Invoice
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              //-------------------- Invoice Entry Ends --------------------
            )}
          </div>
          {/* //-------------------- Invoice Items Display Starts -------------------- */}
          <div className="col-6">
            <div className="card shadow p-3" style={{ minHeight: "625px", overflowX: "hidden" }}>
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
                        <th>id</th>
                        <th>Item Name</th>
                        <th>Remarks</th>
                        <th>Unit price</th>
                        <th>Qty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice?.map((item, index) => (
                        <>
                          {item.itemId !== null && (
                            <tr key={index}>
                              <td>{item.id}</td>
                              <td>{item.itemName}</td>
                              <td>{item.item_remarks}</td>
                              <td>{item.unitPrice}</td>
                              <td>{item.item_qty}</td>
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

                  </table>

                  {!!totalAmount &&
                    <>
                      <hr />
                      <div className='text-end fw-bold'>Total Amount: <span>{totalAmount}</span></div>
                    </>}
                  {initialLoading && < div className='text-center my-5'>Loading....</div>}
                  <form onSubmit={submitForm}>
                    <Button className="shadow rounded-3 my-4"
                      variant="primary"
                      type="submit" style={{ float: 'right' }}>
                      Update Invoice
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* //-------------------- Invoice Items Display Ends -------------------- */}
        </div>
      </div>
    </>
  );
}
export default UpdateInvoice;