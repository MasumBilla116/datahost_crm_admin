import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Select2 from "../../../../components/elements/Select2";

import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import format from "date-fns/format";
import { Button, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { DeleteIcon, HeadSection } from "../../../../components";
import Select from "../../../../components/elements/Select";
import toast from "../../../../components/Toast/index";
import Axios from "../../../../utils/axios";
import { getSSRProps } from "../../../../utils/getSSRProps";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.prchs.crt_invc",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

const createPurchaseRequisition = ({ accessPermissions }) => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const router = useRouter();
  const {edit} = router?.query; 
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [approveDate, setApproveDate] = useState( );
  const [openDate, setOpenDate] = useState(false);
  const [openApproveDate, setOpenApproveDate] = useState(false);
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
  const [supplier, setSupplier] = useState([]); /**Getting Suppliers */

  const [allSupplier, setAllSupplier] = useState([]); /**Getting Suppliers */
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
  const [requisitionStatus, setRequisitionStatus] = useState("Pending");
  const [requisitionTitle, setRequisitionTitle] = useState("");

  // @@ get edit info
  useEffect(()=>{
    if(edit != "" || edit != undefined){
      fetchEditInfo();
    }

  },[edit]);

  const fetchEditInfo = async () => {
    const body = {
      requisition_id: edit,
      action: "getPurchaseRequisitionEditInfo",
    };
  
    try {
      const res = await http.post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase-product`,
        body
      );   
      // Check if data exists and is an array
      const items = res?.data?.data || [];
  
      // Use map() to transform the items 
      const _itemIds = [];
      var localIndex = ind;
      var title = "";
      var request_date = "";
      var approved_date = "";
      var remark = "";
      var status = "Pending";
      

      const newItems = items.map((item) =>{ 
        localIndex +=1; 
        _itemIds?.push(item?.item_id);
        title = item?.requisition_title;
        request_date = item?.request_date;
        approved_date = item?.approved_date;
        remark =  item?.remark;
        status =  item?.status;

        return {
          id: localIndex,
          itemName: `${item?.item_name} (${item?.item_type_name})`,
          qty: item?.quantity,
          itemId: item?.item_id
        };
      });
  
      // Set the invoice with the new items
      setRequisitionStatus(status);
      setTotalRemarks(remark);
      setRequisitionTitle(title);
      setDate(format(new Date(request_date), "yyyy-MM-dd"));
      setInd(localIndex);
      setInvItemIds((prev) => [...prev, ..._itemIds]);
      setInvoice(newItems);
    } catch (error) {
      console.log("🚀 ~ fetchEditInfo ~ error:", error);
    }
  };
   

  // let item_name_options = { value: item_obj?.id || '', label: item_obj?.name || 'Select...' };
  let item_name_options = {
    value: itemId || "",
    label: itemName || "Select...",
  };
  var options = [];

  const [invoice, setInvoice] = useState([]); 
  const [paymentTypeId, setPaymentTypeId] = useState("");
  const [ind, setInd] = useState(1);

  const reset = () => {
    setRemarks("");
    setTotal(0);
    setQuantity(0);
    setUnitPrice(0);
    setItemCode("");
    setItemId("");
    setItemCodeName("");
    setCatPending(true);
    setItemName("");
    setItemId("");
  };

  const StoringData = (e) => {
    e.preventDefault();
    setGrandTotal(parseInt(grandTotal) + parseInt(total)); 

    setInd(() => ind + 1);

    setInvoice([
      ...invoice,
      {
        id: ind,
        unitPrice: parseInt(unitPrice),
        qty: parseInt(quantity),
        total: parseInt(total),
        itemId: itemId,
        unitTypeId: "",
        itemName: itemName,
        salesPrice: parseInt(0),
        payment_type_id: "",
      },
    ]);
    reset();
  };

  const [objedit, setObjEdit] = useState(false);
  const [arrayIndex, setArrayIndex] = useState();
  const [editId, setEditId] = useState();
  const [status, setStatus] = useState(false);

  const selected_category_options = { value: categoryId, label: categoryName };
  const selected_code_options = { value: itemCode, label: itemCodeName };
  const [selected_item_options, setSelected_item_options] = useState({
    value: itemId,
    label: itemName,
  });
  const [pending, setPending] = useState(true); 
 
  const [tempTotal, setTempTotal] = useState(0);

  async function editobj(index, editId) {
    setObjEdit(true);
    setArrayIndex(index);
    setEditId(editId);
    setQuantity(invoice[index]?.qty);
    setRemarks(invoice[index]?.remarks);
    setItemId(invoice[index]?.itemId);
    setItemName(invoice[index]?.itemName);
    setCategoryId(invoice[index]?.catId);
    setCategoryName(invoice[index]?.catName);
    setItemCode(invoice[index]?.itemCode);
    setItemCodeName(invoice[index]?.itemCodeName);
    setUnitPrice(invoice[index].unitPrice);
    setTotal(invoice[index].total);
    setItemId(invoice[index].itemId);
    setTempTotal(invoice[index].total);
  }

  const increment_qty = (index, editId) => {
    const newState = invoice.map((obj) => {
      if (obj.id === editId) {
        return {
          ...obj,
          qty: parseInt(obj.qty) + 1,
          total: obj.unitPrice * (parseInt(obj.qty) + 1),
        };
      }
      return obj;
    });

    setInvoice(newState);
  };

  const changeItemQty = (e, index, editId) => {
    const newState = invoice.map((obj) => {
      if (obj.id === editId) {
        return {
          ...obj,
          qty: e.target.value,
          total: obj.unitPrice * parseInt(e.target.value),
        };
      }
      return obj;
    });

    setInvoice(newState);
  };

  //Decrement the total qty
  const decrement_qty = (index, editId) => {
    const newState = invoice.map((obj) => {
      if (obj.id === editId && obj.qty > 0) {
        return {
          ...obj,
          qty: obj.qty - 1,
          total: obj.unitPrice * (obj.qty - 1),
        };
      }
      return obj;
    });

    setInvoice(newState);
  };

  //update grand total price
  useEffect(() => {
    let priceArr = [];
    const updateGrand = invoice.map((obj) => {
      priceArr.push(obj.total);
    });

    const totalPrice = priceArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    setGrandTotal(totalPrice);
  }, [invoice]);

  const UpdateData = (e) => {
    e.preventDefault();
    const newState = invoice.map((obj) => {
      if (obj.id === editId) {
        if (item_name_options.value == "") {
          return {
            ...obj,
            itemId: itemId,
            itemName: itemName,
            remarks: remarks,
            qty: quantity,
            unitPrice: unitPrice,
            total: total,
          };
        } else {
          return {
            ...obj,
            itemId: item_name_options.value,
            itemName: item_name_options.label,
            remarks: remarks,
            qty: quantity,
            unitPrice: unitPrice,
            total: total,
          };
        }
      }
      return obj;
    });

    setInvoice(newState);
    e?.target.reset();
    setObjEdit(false);
    setGrandTotal(parseInt(grandTotal) - parseInt(tempTotal) + parseInt(total));
    reset();
  };

  async function removeObjectFromArray(id, itemId) {
    setInvoice((current) =>
      current.filter((obj) => {
        return obj.id !== id;
      })
    );

    //remove itemId from array

    const indexToRemove = inv_item_ids.indexOf(itemId);

    if (indexToRemove !== -1) {
      inv_item_ids.splice(indexToRemove, 1);
    }
  }

  const changeCategory = (e) => {
    if (e.value) {
      setCategoryId(e.value);
      setCategoryName(e.label);
    }
  };
  const changeItem = (e) => {
    if (e.value) {
      setItemCode(e.value);
      setItemCodeName(e.label);
    }
  };

  // handle to submit form
  async function submitForm(e) {
    e.preventDefault();
    var formError = false;

    try {
      setLoading(true);
      let body = {
        action: "createPurchaseRequisition",
        requisition_title: requisitionTitle,
        invoice: invoice,
        requisition_status: requisitionStatus,
        remarks: totalRemarks,
        request_date: date,
        approved_date: approveDate,
        purchase_requisition_id: edit,
      };

      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase-product`,
          body
        )
        .then((res) => {
          setLoading(false);
          notify("success", "Purchase requisition successfully Added!");
          router.push(`/modules/purchase/requisition`);
        });
      setGrandTotal(0);
    } catch (error) {
      notify("error", "Failed to add. Please try again.");
    } finally {
      setLoading(false);
      setGrandTotal(0);
    }
  }
  
  useEffect(() => {
    const controller = new AbortController();

    async function getAllItems() {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, {
          action: "getAllItems",
        })
        .then((res) => {
          setItems(res.data);
          setPending(false);
        });
    }

    getAllItems();
    return () => controller.abort();
  }, []);

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

  // @@ handle to change unit price
  const handleToChangeUnitPrice = (event, item) => {
    const newUnitPrice = event.target.value;
    if (newUnitPrice == item.unitPrice) return;

    const updateUnitPriceInvoice = invoice.map((row) => {
      if (row.id == item.id) {
        return { ...row, unitPrice: newUnitPrice };
      }
      return row;
    });
    setInvoice(updateUnitPriceInvoice);
  };

  // @@ handle to change unit price
  const handleToChangeSalesPrice = (event, item) => {
    const newUnitPrice = event.target.value;
    if (newUnitPrice == item.salesPrice) return;

    const updateUnitPriceInvoice = invoice.map((row) => {
      if (row.id == item.id) {
        return { ...row, salesPrice: newUnitPrice };
      }
      return row;
    });
    setInvoice(updateUnitPriceInvoice);
  };

  const inputStyle = {
    border: "1px solid #8a847b33",
    width: "107px",
    borderRadius: "5px",
    color: "#484848",
  };

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
                  <strong className="fw-bolder">Purchase Requisition</strong>
                </h4>
              </div>
              <div className="card-body">
                <Form>
                  <div className="row mt-2 mb-3">
                    <Form.Group controlId="formBasicName" className="col-md-6">
                      <Form.Label>Requisition Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Category Description"
                        name="requisition_title"
                        value={requisitionTitle}
                        onChange={(e) => {
                          setRequisitionTitle(e.target.value);
                        }}
                      />
                    </Form.Group>

                    <div className="col-md-4"></div>

                    <Form.Group className="col-md-2">
                      <Form.Label>Request Date</Form.Label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size={1}
                          label="Enter the date"
                          open={openDate}
                          onClose={() => setOpenDate(false)}
                          value={date}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setDate(format(new Date(event), "yyyy-MM-dd"));
                          }}
                          renderInput={(params) => (
                            <ThemeProvider theme={theme}>
                              <TextField
                                onClick={() => setOpenDate(true)}
                                fullWidth={true}
                                size="small"
                                {...params}
                                required
                              />
                            </ThemeProvider>
                          )}
                        />
                      </LocalizationProvider>
                    </Form.Group>

                    <div className="col-md-12 d-flex justify-content-center align-items-center mt-4">
                      <Form.Group style={{width:"100%"}}> 
                        <Select2
                          options={items_options?.map(
                            ({
                              item_id,
                              unit_type_id,
                              item_name,
                              item_type_name,
                              category_name,
                            }) => ({
                              value: item_id,
                              unit_type_id: unit_type_id,
                              label: `${category_name} -- ${item_name}  (${item_type_name})`,
                            })
                          )}
                          value={item_name_options}
                          onChange={(e) => {
                            setItemId(e.value);
                            setItemName(e.label.split("--")[1]);
                            if (!inv_item_ids.includes(e.value)) {
                              setInvItemIds((prev) => [...prev, e.value]);
                              setInd(() => ind + 1);

                              setInvoice((prev) => [
                                ...prev,
                                {
                                  id: ind,
                                  unitPrice: parseInt(0),
                                  salesPrice: parseInt(0),
                                  qty: parseInt(1),
                                  total: parseInt(0),
                                  itemId: e.value,
                                  itemName: e.label.split("--")[1],
                                  unit_type_id: e.unit_type_id,
                                },
                              ]);
                            }
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 table-responsive">
                      <Table striped bordered hover>
                        <thead
                          className="border-0"
                          style={{
                            backgroundColor: "#337AB7",
                            color: "#ffffff",
                          }}
                        >
                          <tr className="text-center">
                            <th className="fw-bolder">Item Name</th>
                            <th className="fw-bolder">Quantity</th>
                            <th className="fw-bolder">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice?.map((item, index) => (
                            <>
                              {item.itemId !== null && (
                                <tr className="text-center" key={index}>
                                  {/* <td>{item.id}</td> */}
                                  <td>{item.itemName}</td>
                                  <td style={{ width: "200px" }}>
                                    <div className="input-group ">
                                      <span className="input-group-btn">
                                        <Button
                                          variant="danger"
                                          onClick={() =>
                                            decrement_qty(index, item.id)
                                          }
                                        >
                                          <i className="fa fa-minus text-white" />
                                        </Button>
                                      </span>
                                      <input
                                        typ="number"
                                        value={item.qty}
                                        className="form-control no-padding text-center"
                                        onChange={(e) =>
                                          changeItemQty(e, index, item.id)
                                        }
                                      />
                                      <span className="input-group-btn">
                                        <Button
                                          variant="primary"
                                          onClick={() =>
                                            increment_qty(index, item.id)
                                          }
                                        >
                                          <i className="fa fa-plus text-white" />
                                        </Button>
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center align-items-center">
                                      <ul className="action">
                                        <li>
                                          <Link href="#">
                                            <a
                                              onClick={() => {
                                                removeObjectFromArray(
                                                  item.id,
                                                  item.itemId
                                                );
                                              }}
                                            >
                                              <DeleteIcon />
                                            </a>
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    <div className="row mt-4 mb-3">
                      <Form.Group
                        controlId="formBasicName"
                        className="col-md-6"
                      >
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Category Description"
                          name="remarks"
                          value={totalRemarks}
                          onChange={(e) => setTotalRemarks(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3 col-md-3"
                        controlId="formBasicDesc"
                      >
                        <Form.Label>Requisition Status</Form.Label>
                        <Select
                          value={requisitionStatus}
                          name="requisition_status"
                          onChange={(e) => {
                            setRequisitionStatus(e.target.value);
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Cancel">Cancel</option>
                          <option value="Approve">Approve</option>
                        </Select>
                      </Form.Group>

                      <Form.Group className="col-md-3">
                      <Form.Label>Approved Date</Form.Label>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          size={1}
                          label="Enter the date"
                          open={openApproveDate}
                          onClose={() => setOpenApproveDate(false)}
                          value={approveDate}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setApproveDate(format(new Date(event), "yyyy-MM-dd"));
                          }}
                          renderInput={(params) => (
                            <ThemeProvider theme={theme}>
                              <TextField
                                onClick={() => setOpenApproveDate(true)}
                                fullWidth={true}
                                size="small"
                                {...params}
                                required
                              />
                            </ThemeProvider>
                          )}
                        />
                      </LocalizationProvider>
                    </Form.Group>
                    </div>

                    {!!grandTotal && (
                      <div className="text-end fw-bold mb-3 me-2">
                        Total Amount:{" "}
                        <span>
                          {grandTotal && Number(grandTotal).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="text-end">
                      {accessPermissions.createAndUpdate && (
                        <Button
                          variant="success"
                          style={{ float: "right" }}
                          disabled={!invoice.length}
                          onClick={submitForm}
                        >
                          {( edit && edit !== "" ) ? "Update" : "Create"} Requisition
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default createPurchaseRequisition;
