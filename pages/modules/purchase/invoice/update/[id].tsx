import * as moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  DeleteIcon,
  EditIcon,
  Label,
  Select2,
  TextInput,
} from "../../../../../components";
import toast from "../../../../../components/Toast/index";
import Axios from "../../../../../utils/axios";
import DatePicker from "react-datepicker";
// import MRI_Uploader from '../../../../components/MRIfileManager/MRI_Uploader';
import PropagateLoading from "../../../../../components/PropagateLoading";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

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
  const {
    isReady,
    query: { id },
  } = router;

  const [invoice, setInvoice] = useState([]);
  const [deletedInvoice, setdeletedInvoice] = useState([]);
  const [newInvoice, setNewInvoice]: any = useState([]);

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
  const [quantity, setQuantity] = useState(1);
  const [getItems, setItems] = useState();
  const items_options = getItems?.data;
  const [getItemCategories, setItemCategories] = useState("");
  const categories_options = getItemCategories.data;
  const [switcher, setSwitcher] = useState(true);
  const [itemLoading, setItemLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState<Number>(0);
  const [total, setTotal] = useState<Number>(0);

  const [initialLoading, setInitailLoading] = useState(true);

  let item_name_options = {
    value: itemId || "",
    label: itemName || "Select...",
  };

  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [pendingCat, setPendingCat] = useState(true);
  const [supplierID, setSupplierID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierNamePending, setSupplierNamePending] = useState(true);
  const [SupplierInvoiceNumber, setSupplierInvoiceNumber] = useState();

  const [disable, setDisable] = useState(true);
  const [localInv, setLocalInv] = useState("loading...");
  const [supplier, setSupplier] = useState([]);
  const [InvoiceSupplierName, setInvoiceSupplierName] = useState("");

  const [updateCount, setUpdateCount] = useState(1);
  const [supplierDetails, setSupplierDetails] = useState([]);
  const [supplierInfoloading, setSupplierInfoLoading] = useState(false);

  // const [itemListLoading, setItemListLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController();

    async function getAllItems() {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, {
          action: "getAllItems",
        })
        .then((res) => {
          setItems(res?.data);
          setSupplierNamePending(false);
        });
    }
    const categoryList = async () => {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,
          { action: "getAllCategories" }
        )
        .then((res) => {
          setItemCategories(res.data);
          setCatPending(false);
        });
    };

    // const getSuppliersDetails = async () => {
    //     let body: any = {}
    //     body = {
    //         action: "getInvoiceByID",
    //         id: id
    //     }
    //     await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
    //         body
    //     ).then(result => {
    //         setLocalInv(result?.data?.data[0]?.local_invoice);
    //         setInvoiceSupplierName(result?.data?.data[0]?.supplier_name)
    //         setSupplierInvoiceNumber(result?.data?.data[0]?.supplier_invoice)
    //         setSupplierID(result?.data?.data[0]?.supplier_id)
    //         setTotalRemarks(result?.data?.data[0]?.remarks)
    //         setDate(result?.data?.data[0]?.created_at)
    //     });

    // }
    // router.isReady && getInvoiceDetails()
    // fetchSupplierDetails()
    // getSuppliersDetails()
    getItemByCategory();
    getAllItems();
    getSuppliers();
    categoryList();
    getItemByCode();
    return () => controller.abort();
  }, [id, categoryId, itemCode]);

  useEffect(() => {
    const getInvoiceDetails = async () => {
      if (!invoice.length) {
        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
            { action: "getInvoiceDetails", supplier_invoice_id: id }
          )
          .then((res) => {
            setRemarks(res?.data?.data[0]?.item_remarks);
            setTotalRemarks(res?.data?.data[0]?.common_remarks);
            setDate(res?.data?.data[0]?.created_at);
            setItemName(res?.data?.data[0]?.itemName);
            let amount = 0;
            res?.data?.data?.map((item: any) => {
              amount += Number(item.unitPrice * item.item_qty);
            });
            setTotalAmount(amount);
            setInvoice(res?.data?.data);
            setInitailLoading(false);
            setDisable(false);
            // setInd(res?.data?.data?.id +1)
          });
      }
    };
    const fetchSupplierDetails = async () => {
      setSupplierDetails([]);
      setSupplierInfoLoading(true);
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, {
          action: "getInvoiceByID",
          id: id,
        })
        .then((res) => {
          setSupplierDetails(res?.data?.data);
          setSupplierInfoLoading(false);
        });
    };
    const getSuppliersDetails = async () => {
      let body: any = {};
      body = {
        action: "getInvoiceByID",
        id: id,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((result) => {
          setLocalInv(result?.data?.data[0]?.local_invoice);
          setInvoiceSupplierName(result?.data?.data[0]?.supplier_name);
          setSupplierInvoiceNumber(result?.data?.data[0]?.supplier_invoice);
          setSupplierID(result?.data?.data[0]?.supplier_id);
          setTotalRemarks(result?.data?.data[0]?.remarks);
          setDate(result?.data?.data[0]?.created_at);
        });
    };
    isReady && getInvoiceDetails();
    fetchSupplierDetails();
    getSuppliersDetails();
  }, [id, isReady, updateCount]);

  // const [ind, setInd] = useState(1)
  const StoringData = (e: any) => {
    e.preventDefault();

    const totalInvoice = invoice.concat(newInvoice);
    // let arr2 = [new Set([...invoice, ...newInvoice])]

    if (totalInvoice.length) {
      const duplicateItem = totalInvoice.filter(
        (item) => item?.itemId === itemId
      );
      if (!duplicateItem.length) {
        setTotalAmount(Number(totalAmount) + Number(total));
        // e.target.reset();
        setNewInvoice([
          ...newInvoice,
          {
            id: newInvoice.length
              ? newInvoice[newInvoice.length - 1]?.id + 1
              : invoice[invoice.length - 1]?.id + 1,
            unitPrice: unitPrice,
            item_qty: quantity,
            // total: total,
            itemId: itemId,
            itemName: itemName,
            item_remarks: remarks,
            status: 1,
            supplierName: InvoiceSupplierName,
            local_invoice: localInv,
            supplier_id: supplierID,
            supplier_invoice_id: id,
            qty: quantity,
            total_remarks: totalRemarks,
            date: date,
          },
        ]);
        setQuantity(0);
        setTotal(0);
        setUnitPrice(0);
        setRemarks("");
        setItemName("");
        setItemCode("");
        setItemCodeName("");
        setItemId("");
        setItemCategories("");
      } else {
        notify("error", itemName + " already added");
      }
    }
  };
  const [objedit, setObjEdit] = useState(false);
  const [arrayIndex, setArrayIndex] = useState();
  const [editId, setEditId] = useState("");
  const [editedItemId, setEditedItemId] = useState("");
  const [editedItemName, setEditedItemName] = useState("");

  const selected_category_options = { value: categoryId, label: categoryName };
  const selected_code_options = { value: itemCode, label: itemCodeName };
  const selected_item_options = { value: itemId, label: itemName };
  const [catPending, setCatPending] = useState(true);
  const [tempTotal, setTempTotal] = useState(0);

  const getSuppliers = async () => {
    let body: any = {};
    body = {
      action: "getAllSupplier",
    };
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
        body
      )
      .then((result) => {
        setSupplier(result.data.data);
      });
  };

  function editobj(index, editId) {
    setObjEdit(true);
    setArrayIndex(index);
    setEditId(editId);
    setQuantity(invoice[index]?.item_qty);
    setRemarks(invoice[index]?.item_remarks);
    setItemId(invoice[index]?.itemId);
    setItemName(invoice[index]?.itemName);
    setCategoryId(invoice[index]?.catId);
    setCategoryName(invoice[index]?.catName);
    setItemCode(invoice[index]?.itemCode);
    setItemCodeName(invoice[index]?.itemCodeName);
    setUnitPrice(invoice[index]?.unitPrice);
    setTotal(invoice[index]?.unitPrice * invoice[index]?.item_qty);
    setTempTotal(invoice[index]?.unitPrice * invoice[index]?.item_qty);
  }

  function editobjNewInvoice(index, editId) {
    setObjEdit(true);
    setArrayIndex(index);
    setEditId(editId);
    setQuantity(newInvoice[index]?.item_qty);
    setRemarks(newInvoice[index]?.item_remarks);
    setItemId(newInvoice[index]?.itemId);
    setItemName(newInvoice[index]?.itemName);
    setCategoryId(newInvoice[index]?.catId);
    setCategoryName(newInvoice[index]?.catName);
    setItemCode(newInvoice[index]?.itemCode);
    setItemCodeName(newInvoice[index]?.itemCodeName);
    setUnitPrice(newInvoice[index]?.unitPrice);
    setTotal(newInvoice[index]?.unitPrice * newInvoice[index]?.item_qty);
    setTempTotal(newInvoice[index]?.unitPrice * newInvoice[index]?.item_qty);
  }

  const UpdateData = (e: any) => {
    e.preventDefault();

    const InvoiceState = invoice.map((obj) => {
      if (obj.id === editId) {
        if (item_name_options.value == "") {
          return {
            ...obj,
            itemCode: itemId,
            itemCodeName: itemCodeName,
            itemId: itemId,
            itemName: itemName,
            common_remarks: totalRemarks,
            item_remarks: remarks,
            item_qty: quantity,
            unitPrice: unitPrice,
            update: true,
          };
        } else {
          return {
            ...obj,
            itemCode: itemId,
            itemCodeName: itemCodeName,
            itemId: item_name_options.value,
            itemName: item_name_options.label,
            common_remarks: totalRemarks,
            item_remarks: remarks,
            item_qty: quantity,
            unitPrice: unitPrice,
            update: true,
          };
        }
      }
      return obj;
    });
    setInvoice(InvoiceState);
    e.target.reset();
    const newInvoiceState = newInvoice.map((obj) => {
      if (obj.id === editId) {
        if (item_name_options.value == "") {
          return {
            ...obj,
            itemCode: itemId,
            itemCodeName: itemCodeName,
            itemId: itemId,
            itemName: itemName,
            common_remarks: totalRemarks,
            item_remarks: remarks,
            item_qty: quantity,
            unitPrice: unitPrice,
          };
        } else {
          return {
            ...obj,
            itemCode: itemId,
            itemCodeName: itemCodeName,
            itemId: item_name_options.value,
            itemName: item_name_options.label,
            common_remarks: totalRemarks,
            item_remarks: remarks,
            item_qty: quantity,
            unitPrice: unitPrice,
          };
        }
      }
      return obj;
    });
    setNewInvoice(newInvoiceState);
    e.target.reset();
    setObjEdit(false);
    setTotalAmount(Number(totalAmount) - Number(tempTotal) + Number(total));
    setQuantity(0);
    setTotal(0);
    setUnitPrice(0);
    setRemarks("");
    setItemName("");
    setItemCode("");
    setItemCodeName("");
    setItemId("");
    setItemCategories("");
  };

  async function removeObjectFromArray(id, index) {
    if (invoice.length > 1) {
      setTotalAmount(
        Number(totalAmount) -
          Number(invoice[index].item_qty) * Number(invoice[index].unitPrice)
      );
      setdeletedInvoice([...deletedInvoice, invoice[index]]);

      setInvoice((current) =>
        current.filter((obj) => {
          return obj.id !== id;
        })
      );
    } else {
      notify("error", "must be at least one item!");
    }
  }

  async function removeObjectFromArrayNewInvoice(id, index) {
    setTotalAmount(
      Number(totalAmount) -
        Number(newInvoice[index].item_qty) * Number(newInvoice[index].unitPrice)
    );
    setNewInvoice((current) =>
      current.filter((obj) => {
        return obj.id !== id;
      })
    );
  }

  const changeCategory = (e: any) => {
    if (e.value) {
      setCategoryId(e.value);
      setCategoryName(e.label);
    }
  };

  const getItemByCategory = async () => {
    let isSubscribed = true;
    if (categoryId !== "") {
      setPending(true);
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, {
          action: "getAllItems",
        })
        .then((res) => {
          if (isSubscribed) {
            var filteredCatagory = res?.data?.data;
            setCategoryData(filteredCatagory);
            setPending(false);
          }
        });
    }
    return () => (isSubscribed = false);
  };

  const changeItem = (e: any) => {
    if (e.value) {
      setItemCode(e.value);
      setItemCodeName(e.label);
    }
  };

  const getItemByCode = async () => {
    let isSubscribed = true;
    if (itemCode !== "") {
      setPending(true);
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`,
          { action: "getItemByCode", id: itemCode }
        )
        .then((res) => {
          if (isSubscribed) {
            //setItemObj(res.data.data);
            setItemId(res.data.data?.id);
            setItemName(res.data.data?.name);
            setUnitPrice(res?.data?.data?.unit_cost);
            setTotal(res?.data?.data?.unit_cost * quantity);
            setPending(false);
            // setSwitcher(false);
          }
        });
    }
    return () => (isSubscribed = false);
  };

  const changeItemCode = (e: any) => {
    if (e.value) {
      setItemId(e.value);
      setItemName(e.label);
      setItemCodeName(e.code);
      setUnitPrice(e.unitCost);
      quantity ? setTotal(e.unitCost * quantity) : setTotal(e.unitCost);
    }
  };

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

  async function submitForm(e: any) {
    e.preventDefault();

    if (SupplierInvoiceNumber) {
      setDisable(true);
      setLoading(true);
      setTotalAmount(0);
      setInitailLoading(true);
      invoice.map((item, index) => {
        delete item.common_remarks;
        delete item.totalAmount;
      });
      deletedInvoice.map((itm, ind) => {
        deletedInvoice[ind].status = 0;
        delete itm.totalAmount;
        delete itm.common_remarks;
      });
      let body = {
        action: "updateInvoice",
        invoice: invoice,
        status: true,
        localInvoice: localInv,
        supplierID: supplierID,
        supplierName: InvoiceSupplierName,
        supplier_invoice_id: id,
        inv_id: SupplierInvoiceNumber,
        totalRemarks: totalRemarks,
        totalAmount: totalAmount,
        inv_date: date,
        newInvoice: newInvoice,
        deletedInvoice: deletedInvoice,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((res) => {
          setLoading(false);
          notify("success", "successfully Updated!");
          e.target.reset();
          setInvoice([]);
          setNewInvoice([]);
          setUpdateCount(updateCount + 1);
          router.push(`/modules/purchase/invoice/details/${id}`);
        })
        .catch((e) => {
          setLoading(false);
          const msg = e.response?.data?.response;

          if (typeof e.response?.data?.response == "string") {
            notify("error", `${e.response?.data?.response}`);
          } else {
            if (msg?.date) {
              notify("error", `${msg?.date?.Date}`);
            }
          }
        });
    } else {
      notify("error", "fields must not be empty");
    }
  }

  const [totalCost, setTotalCost] = useState("");
  // const [totalCost, setTotalCost] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);

  const handleTotal = (e: any) => {
    if (e.target.name === "unitCost") {
      setUnitPrice(e.target.value);
      setTotal(Number(e.target.value) * Number(quantity));
    } else if (e.target.name === "qty") {
      setQuantity(e.target.value);
      setTotal(Number(e.target.value) * Number(unitPrice));
    }
  };

  const { pathname } = router;

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Supplier ", link: "/modules/purchase/invoice" },
    { text: "Update Supplier ", link: "/modules/purchase/invoice/update/[id]" },
  ];
  return (
    <>
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          {/* //-------------------- Supplier Name -------------------- */}
          <div className="col-md-12">
            <div className="card shadow p-1">
              <div className="card-body ">
                <h4 className="card-title pb-2">
                  <strong className="fw-bolder">
                    Edit Purchase Invoice Info
                  </strong>
                </h4>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div
                    className="table-responsive p-2"
                    style={{ minHeight: "200px", overflowX: "hidden" }}
                  >
                    <TextInput
                      type="text"
                      label="Supplier Invoice"
                      name="supplierInvoiceNumber"
                      value={SupplierInvoiceNumber}
                      placeholder="Supplier invoice number"
                      required
                      onChange={(e) => setSupplierInvoiceNumber(e.target.value)}
                    />
                    <div className="mb-2 row">
                      <Label text="Select Supplier" />
                      {InvoiceSupplierName && (
                        <div className="col-sm-10 col-lg-10 col-md-10 ">
                          <Select2
                            options={supplier?.map(({ id, name }) => ({
                              value: id,
                              label: name,
                            }))}
                            isDisabled={true}
                            onChange={(e: any) => {
                              setSupplierID(e.value);
                              setSupplierName(e.label);
                            }}
                            defaultValue={{
                              value: "",
                              label: InvoiceSupplierName,
                            }}
                          />
                        </div>
                      )}
                      {!InvoiceSupplierName && (
                        <div className="col-sm-10 col-lg-10 col-md-10 ">
                          <Select2
                            options={supplier?.map(({ id, name }) => ({
                              value: id,
                              label: name,
                            }))}
                            isDisabled={true}
                            onChange={(e: any) => {
                              setSupplierID(e.value);
                              setSupplierName(e.label);
                            }}
                            defaultValue={{ value: "", label: "loading..." }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      {/* {supplierDetails?.map((info) => {
                                                return (
                                                    <div className='text-center'>
                                                        <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Name: </span>{info?.supplier_name}</span>&nbsp;
                                                        <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Type: </span>{info?.type}</span>&nbsp;
                                                        <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Remarks: </span>{info?.remarks}</span>&nbsp;
                                                        <span className="badge font-weight-medium bg-light-primary text-primary"><span className='text-dark'>Balance: </span>{info?.total_amount}</span>&nbsp;
                                                    </div>
                                                )
                                            })}
                                            {supplierInfoloading && <>
                                                <>
                                                    <div className="my-3 text-center">
                                                        <PropagateLoading />
                                                    </div>
                                                </>
                                            </>} */}
                    </div>
                    <div className="my-3 row">
                      <label className="col-md-2 col-form-label ">
                        Invoice Remarks:
                      </label>
                      <div className="col-sm-10 col-lg-10 col-md-10 ">
                        <input
                          type="text"
                          placeholder="Invoice Remarks"
                          className="form-control"
                          disabled={disable}
                          value={totalRemarks}
                          onChange={(e) => setTotalRemarks(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <label className="col-md-2 col-form-label ">
                        Invoice Date:
                      </label>
                      <div className="col-sm-10 col-lg-10 col-md-10 ">
                        <input
                          type="date"
                          name="inv_date"
                          disabled={disable}
                          Value={moment(date).format("YYYY-MM-DD")}
                          onChange={(e) => setDate(e.target.value)}
                          className="form-control"
                          id="date"
                        />
                      </div>
                    </div>
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
              <div className="card shadow">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Update Invoice</h4>
                </div>
                <form onSubmit={UpdateData}>
                  <div className="card-body">
                    {/* {pending &&
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
                                            </div>} */}

                    <TextInput
                      type="number"
                      label="Unit Cost"
                      name="unitCost"
                      value={unitPrice}
                      placeholder="Unit Price"
                      required
                      onChange={handleTotal}
                    />
                    <TextInput
                      type="number"
                      label="Qty"
                      name="qty"
                      value={quantity}
                      required
                      onChange={handleTotal}
                      placeholder={undefined}
                    />
                    <TextInput
                      type="text"
                      label="Total"
                      placeholder="Total Cost"
                      disabled
                      value={Number(total).toFixed(2)}
                    />
                    <TextInput
                      type="text"
                      label="Remarks"
                      placeholder="Remarks"
                      value={remarks}
                      onChange={(e: any) => setRemarks(e.target.value)}
                    />
                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button
                        variant="success"
                        className="me-2"
                        type="submit"
                        disabled={!quantity || !unitPrice || !itemId || !total}
                      >
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setObjEdit(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              //  -------------------- Invoice Update Ends  --------------------
              //-------------------- Invoice Entry Starts --------------------
              <div className="card shadow">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Create Invoice</h4>
                </div>
                <form onSubmit={StoringData}>
                  <div className="card-body">
                    {!catPending && (
                      <div className="mb-3 row">
                        <Label text="Select Category" />
                        <div className="col-sm-10">
                          <Select2
                            options={categories_options?.map(
                              ({ id, name }) => ({ value: id, label: name })
                            )}
                            onChange={changeCategory}
                          />
                        </div>
                      </div>
                    )}
                    {catPending && (
                      <div className="mb-3 row">
                        <Label text="Select Category" />
                        <div className="col-sm-10">
                          <Select2
                            options={categories_options?.map(
                              ({ id, name }) => ({ value: id, label: name })
                            )}
                            onChange={changeCategory}
                            defaultValue={{ value: "", label: "loading..." }}
                          />
                        </div>
                      </div>
                    )}

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
                          options={items_options?.map(({ id, code }) => ({
                            value: id,
                            label: code,
                          }))}
                          onChange={changeItem}
                          value={selected_code_options}
                        />
                      </div>
                    </div>
                    {pending && (
                      <div className="mb-3 row">
                        <Label text="Select Item" />
                        <div className="col-sm-10">
                          <Select2
                            options={categoryData?.map(
                              ({ id, name, code }) => ({
                                value: id,
                                label: name,
                                code: code,
                              })
                            )}
                            onChange={changeItemCode}
                            defaultValue={{ value: "", label: "loading..." }}
                          />
                        </div>
                      </div>
                    )}
                    {!pending && (
                      <div className="mb-3 row">
                        <Label text="Select Item" />
                        <div className="col-sm-10">
                          <Select2
                            options={categoryData?.map(
                              ({ id, name, unit_cost, code }) => ({
                                value: id,
                                label: name,
                                unitCost: unit_cost,
                                code: code,
                              })
                            )}
                            defaultValue={item_name_options}
                            // onChange={changeItemCode}
                            onChange={(e: any) => {
                              setItemCode(e.value);
                              setItemCodeName(e.code);
                              setItemId(e.value);
                              setItemName(e.label);
                              setUnitPrice(e.unitCost);
                              quantity
                                ? setTotal(e.unitCost * quantity)
                                : setTotal(e.unitCost);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* <TextInput type="number" label="Qty" placeholder="item qty" required onChange={(e) => setQuantity(e.target.value)} /> */}
                    <TextInput
                      type="number"
                      label="Unit Cost"
                      name="unitCost"
                      value={unitPrice}
                      placeholder="Unit Price"
                      required
                      onChange={handleTotal}
                    />
                    <TextInput
                      type="number"
                      label="Qty"
                      name="qty"
                      placeholder="item qty"
                      value={quantity}
                      required
                      onChange={handleTotal}
                    />
                    <TextInput
                      type="text"
                      label="Total"
                      placeholder="Total Cost"
                      disabled
                      value={Number(total).toFixed(2)}
                    />
                    <TextInput
                      type="text"
                      label="Remarks"
                      placeholder="Remarks"
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button
                        className="shadow rounded"
                        variant="primary"
                        type="submit"
                        disabled={!quantity || !total}
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
          <div className="col-md-6 col-lg-6">
            <div
              className="card shadow p-3"
              style={{ minHeight: "625px", overflowX: "hidden" }}
            >
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
                        {/* <th>id</th> */}
                        <th>Item Name</th>
                        <th>Remarks</th>
                        <th>Unit price</th>
                        <th>Qty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!initialLoading &&
                        invoice?.map((item, index) => (
                          <>
                            {item.itemId !== null && (
                              <tr key={index}>
                                {/* <td>{item.id}</td> */}
                                <td>{item.itemName}</td>
                                <td>{item.item_remarks}</td>
                                <td>{item.unitPrice}</td>
                                <td>{item.item_qty}</td>
                                <td>
                                  <ul className="action">
                                    <li>
                                      <Link href="#">
                                        <a
                                          onClick={() =>
                                            editobj(index, item.id)
                                          }
                                        >
                                          <EditIcon />
                                        </a>
                                      </Link>
                                    </li>
                                    <li>
                                      <Link href="#">
                                        <a
                                          onClick={() =>
                                            removeObjectFromArray(
                                              item.id,
                                              index
                                            )
                                          }
                                        >
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
                      {!initialLoading &&
                        newInvoice?.map((item, index) => (
                          <>
                            {item.itemId !== null && (
                              <tr key={index}>
                                {/* <td>{item.id}</td> */}
                                <td>{item.itemName}</td>
                                <td>{item.item_remarks}</td>
                                <td>{item.unitPrice}</td>
                                <td>{item.item_qty}</td>
                                <td>
                                  <ul className="action">
                                    <li>
                                      <Link href="#">
                                        <a
                                          onClick={() =>
                                            editobjNewInvoice(index, item.id)
                                          }
                                        >
                                          <EditIcon />
                                        </a>
                                      </Link>
                                    </li>
                                    <li>
                                      <Link href="#">
                                        <a
                                          onClick={() =>
                                            removeObjectFromArrayNewInvoice(
                                              item.id,
                                              index
                                            )
                                          }
                                        >
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

                  {!!totalAmount && (
                    <>
                      <hr />
                      <div className="text-end fw-bold">
                        Total Amount: <span>{totalAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {initialLoading && (
                    <div className="my-5 mx-3 text-center">
                      <PropagateLoading />
                    </div>
                  )}
                  <form onSubmit={submitForm}>
                    <Button
                      className="shadow rounded-3 my-4"
                      variant="primary"
                      type="submit"
                      style={{ float: "right" }}
                      disabled={
                        initialLoading ||
                        disable ||
                        (invoice.length === 0 && newInvoice.length === 0)
                      }
                    >
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
};
export default UpdateInvoice;
