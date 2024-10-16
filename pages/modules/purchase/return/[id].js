import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaCheck, FaHandPointLeft } from "react-icons/fa";
import RadioButton from "../../../../components/elements/RadioButton";
import TextInput2 from "../../../../components/elements/TextInput2";
import PropagateLoading from "../../../../components/PropagateLoading";
import toast from "../../../../components/Toast/index";
import Axios from "../../../../utils/axios";

function PurchaseReturnDetails() {
  // Router setup
  const { http } = Axios();
  const router = useRouter();
  const {
    isReady,
    query: { id },
  } = router;

  // Toastify setup;
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  //state declaration

  /**
   * !Ref From Invoice Details
   */

  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalParQuantity, setTotalParQuantity] = useState(0);
  const [totalParAmount, setTotalParAmount] = useState(0);
  const [supplierID, setSupplierID] = useState(0);
  const [full, setFullReturn] = useState(false);
  const [partial, setPartialReturn] = useState(false);
  const [concheck, setConcheck] = useState([]);
  const [checkreturn, setCheckreturn] = useState(0);
  const [invoiceID, setInvoiceid] = useState(0);
  const [checkedIds, setChekedIds] = useState([]);
  const [itemId, setItemId] = useState("");
  const [storeItems, setStoreitems] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);

  const [supplierInfo, setSupplierInfo] = useState({
    name: "",
    address: "",
    contact_number: 0,
    email: "",
  });

  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();
    //fetching invoice items
    const getInvoiceDetails = async () => {
      let body = {};
      body = {
        action: "getInvoiceDetails",
        supplier_invoice_id: id,
      };
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
          body
        )
        .then((res) => {
          setSupplierID(res?.data?.data[0]?.supplier_id);
          setInvoiceid(res?.data?.data[0]?.supplier_invoice_id);

          setInvoices(res?.data?.data || []);
          setInvoice(res?.data?.data);

          let totalamount = 0;

          res?.data?.data.map((invoice) => {
            totalamount += invoice.unit_price * invoice.stock;
          });
          setConcheck(
            res?.data?.data.map((item) => {
              item.is_show = false;
              return item;
            })
          );
          setTotalAmount(totalamount);
        })
        .catch((err) => {
          console.log(err + <br /> + "Something went wrong !");
        });
      setLoading(false);
    };

    isReady && getInvoiceDetails();

    // getItemQty();

    return () => controller.abort();
  }, [id, isReady]);

  useEffect(() => {
    const controller = new AbortController();

    //fetching supplier info
    const getSupplierInfo = async () => {
      if (supplierID) {
        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
            { action: "getSupplierByID", id: supplierID }
          )
          .then((res) => {
            setSupplierInfo({
              ...supplierInfo,
              name: res?.data?.data[0]?.name,
              address: res?.data?.data[0]?.address,
              contact_number: res?.data?.data[0]?.contact_number,
              email: res?.data?.data[0]?.email,
            });
            setLoading(false);
          })
          .catch((err) => {
            console.log(err + <br /> + "Something went wrong !");
          });
      }
    };
    getSupplierInfo();

    return () => controller.abort();
  }, [supplierID]);

  useEffect(() => {
    const controller = new AbortController();

    //fetching supplier info
    const getSupplierInvoice = async () => {
      if (supplierID) {
        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
            { action: "getInvoiceByID", id: id }
          )
          .then((res) => {
            setCheckreturn(res?.data?.data[0]?.is_returned);
          })
          .catch((err) => {
            console.log(err + <br /> + "Something went wrong !");
          });
      }
    };
    getSupplierInvoice();

    return () => controller.abort();
  }, [supplierID]);

  //table data
  const columnData = [
    {
      name: <span className="fw-bold">SL</span>,
      selector: (row) => row.id,
      width: "10%",
    },
    {
      name: <span className="fw-bold">Product</span>,
      selector: (row) => row?.item_name,
      width: "60%",
    },
    {
      name: <span className="fw-bold">Unit Price</span>,
      selector: (row) => row?.unit_price,
      width: "10%",
    },
    {
      name: <span className="fw-bold">Qty</span>,
      selector: (row) => row?.quantity - row?.stock,
      width: "10%",
    },

    {
      name: <span className="fw-bold">Subtotal</span>,
      selector: (row) => (row?.quantity - row?.stock) * row?.unit_price,
      width: "10%",
    },
  ];

  const rowData = invoices.filter((inv) => inv.item_qty !== inv.return_qty);

  function setFullView() {
    setFullReturn(true);
    setPartialReturn(false);
  }
  function setPartialsView() {
    setPartialReturn(true);
    setFullReturn(false);
  }

  async function removeItemFromArray(id, index) {
    let item = storeItems.find((item) => item.id === id);
    const availabelQty = item.quantity - item.stock;

    setTotalParQuantity(totalParQuantity - availabelQty);
    setTotalParAmount(totalParAmount - availabelQty * item.unit_price);

    setStoreitems((current) =>
      current.filter((item) => {
        return item.id !== id;
      })
    );
  }

  const handleChange = (
    e,
    index,
    itemName,
    itemId,
    invItemid,
    itemQty,
    itemUnitprice
  ) => {
    const clickedId = e.target.value;
    const checkedCondition = e.target.checked;

    if (checkedIds.includes(clickedId)) {
      setChekedIds(checkedIds.filter((id) => id !== clickedId));

      removeItemFromArray(itemId, index);
    } else {
      setTotalParQuantity(totalParQuantity + itemQty);
      setTotalParAmount(totalParAmount + itemQty * itemUnitprice);

      setChekedIds([...checkedIds, clickedId]);
      setItemId(itemId);

      setStoreitems([
        ...storeItems,
        {
          id: itemId,
          item_name: itemName,
          item_quantity: Number(itemQty),
          itemId: invItemid,
          item_unitPrice: itemUnitprice,
          invoiceId: invoiceID,
          status: checkedCondition,
          editQty: 0,
          editPrice: 0,
        },
      ]);
    }
    setChecked(storeItems);

    const checkedName = e.target.name;
  };
    

  const handleTotal = (e, indexx, id, itemQty, itemUnitprice) => {
    const value = e.target.value === "" ? 0 : Number(e.target.value);
  
      const tempStorearr = storeItems.map((item) => {
        if (item.id === id) {
          return { ...item, return_qty: value };
        }
        return item;
      }); 

      let item = storeItems.find((item) => item.id === id); 

    //   calculateTotalPriceAndQty(tempStorearr);      
      setStoreitems(tempStorearr); 
  }; 

  useEffect(()=>{
    calculateTotalPriceAndQty(storeItems);
  },[storeItems])

  const calculateTotalPriceAndQty = (item)=>{
    const total_return_qty = item.reduce((acc, row) => {
        let returnQty = parseInt(Number(row.return_qty)) ;
        return isNaN(returnQty) ? acc : acc + returnQty;
      }, 0);
 

      const total_price = item.reduce((prev, row) => {
        let unitPrice = parseFloat(row.item_unitPrice);
        let returnQty = parseFloat(row.return_qty) || 0;
        if (isNaN(unitPrice) || isNaN(returnQty)) {
            return prev;
        }
        return prev + (unitPrice * returnQty);
    }, 0);


    setTotalParQuantity(Number(total_return_qty));
    setTotalParAmount(total_price);
  }

  // console.log(checkedIds)
  const isCheked = (id) => {
    checkedIds.includes(id);
  };

  async function purchaseFullReturn() {
    if (invoices?.length) {
      invoices?.map(async (invo) => {
        console.log(invo?.item_qty);

        setInvoiceid(invo?.supplier_invoice_id);
        console.log(invoiceID);

        let body = {
          action: "returnSupplierInvoice",
          qty: invo?.item_qty,
          itemId: invo?.itemId,
          invoiceitemId: invo?.id,
          invoiceId: invo?.supplier_invoice_id,
          unitPrice: invo?.unitPrice,
          supplierID: supplierID,
          totalAmmount: invo?.item_qty * invo?.unitPrice,
          returnType: "Full",
          statusCode: 1,
          itemStatuscode: 1,
        };

        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
            body
          )
          .then((res) => {
            notify("success", invo?.itemName + " " + "Successfully Return!");
            console.log("Got it");
            router.push(`/modules/purchase/return/details/${invoiceID}`);
          })
          .catch((err) => {
            console.log(err + <br /> + "Something went wrong !");
          });

        setTotalAmount(0);
      });
    }
    router.push({
      pathname: "/modules/purchase/return/details/[invoiceID]",
      query: { invoiceID: invoiceID },
    });
  }

  async function purchasePartialReturn() {
    if (storeItems?.length) {
      storeItems?.map(async (storeItem) => {
        let body = {
          action: "returnSupplierInvoice",
          qty: storeItem?.item_quantity,
          itemId: storeItem?.itemId,
          invoiceitemId: storeItem?.id,
          invoiceId: invoiceID,
          unitPrice: storeItem?.item_unitPrice,
          supplierID: supplierID,
          totalAmount: storeItem?.item_quantity * storeItem?.item_unitPrice,
          returnType: "Partial",
          statusCode: 1,
          itemStatuscode: 1,
        };

        await http
          .post(
            `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`,
            body
          )
          .then((res) => {
            notify(
              "success",
              storeItem?.item_name + " " + "Successfully Return!"
            );

            console.log("Got it");
          })
          .catch((err) => {
            console.log(err + <br /> + "Something went wrong !");
          });

        console.log(body);
        setTotalAmount(0);
      });
      router.push({
        pathname: "/modules/purchase/return/details/[invoiceID]",
        query: { invoiceID: invoiceID },
      });
    }
  }

  return (
    <div>
      <div className="card shadow p-5 m-4">
        <div className="mb-5">
          <div className="text-left">
            <h2 className="mb-3" style={{ color: "red" }}>
              Return Purchase Invoice
            </h2>
          </div>

          {loading ? (
            <div className="my-5 mx-3 text-center">
              <PropagateLoading />
            </div>
          ) : (
            <>
              <div className="row small my-2">
                <div className="col-sm-4 col-lg-4 col-md-4 my-2">
                  {invoice && (
                    <div>
                      <div>Supplier</div>
                      <strong>{invoice[0]?.supplier_name}</strong>
                      <strong>{invoice[0]?.address} </strong>
                      <div className="mt-1">
                        Phone: {invoice[0]?.contact_number}
                      </div>
                    </div>
                  )}
                </div>

                <div className="row col-sm-4 col-lg-8 col-md-8 my-2">
                  {invoice && (
                    <div className="ms-auto col-sm-8 col-lg-8 col-md-8">
                      <div>
                        <strong>Supplier Invoice: </strong>
                        <span>
                          {invoices.length && invoices[0]?.purchase_invoice}
                        </span>
                      </div>
                      <div className="mt-2">
                        <strong>Total Amount: </strong>
                        <span>{totalAmount} Tk</span>
                      </div>
                      <div>
                        <strong>Invoice Date: </strong>
                        <span>
                          {invoices.length && invoices[0]?.purchase_date}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row small my-2">
                <div className="row-sm-4 row-lg-4 row-md-4 my-2">
                  <strong>Please review your return items:</strong>
                  <div className="row-sm-2 mt-2">
                    <RadioButton
                      className="mx-2"
                      label="Full Return"
                      name="return"
                      value="1"
                      onClick={setFullView}
                    ></RadioButton>
                    <RadioButton
                      className="mx-2 mt-1"
                      label="Partial Return"
                      name="return"
                      value="0"
                      onClick={setPartialsView}
                    ></RadioButton>
                  </div>
                </div>
              </div>
            </>
          )}

          {full && (
            <div>
              <DataTable columns={columnData} data={rowData} striped />
              <div className="mb-2 pt-4 row border-top">
                <div className="col-sm-12 col-lg-8 col-md-8">
                  <div>
                    <span className="fw-bold">
                      Total Return Amount: {totalAmount.toFixed(2)}{" "}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row m-0">
                <div className="col-md-12 col-lg-12 text-end">
                  <Button
                    variant="success"
                    className=""
                    onClick={purchaseFullReturn}
                  >
                    <span className="fs-5 me-1">
                      <FaHandPointLeft />
                    </span>
                    Return Puchase
                  </Button>
                </div>
              </div>
            </div>
          )}

          {partial && (
            <form onSubmit={purchasePartialReturn}>
              <>
                <div className="col-sm-8 col-lg-12 col-md-8 my-2">
                  <div className="card-body">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Product</th>
                          <th>Unit Price</th>
                          <th>Return Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.map((item, index) => {
                          let id = item.id;
                          let finalQTY = item.quantity - item.stock;

                          return (
                            <tr>
                              <td>
                                <input
                                  type="checkbox"
                                  name={`item_variation_${item.id}`}
                                  value={item.id}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      index,
                                      item.item_name,
                                      item.id,
                                      item.item_id,
                                      finalQTY,
                                      item.unit_price
                                    )
                                  }
                                  checked={isCheked(item.id)}
                                ></input>
                              </td>

                              <td>
                                <label className="mx-2 mt-0" htmlFor="itemdata">
                                  {item.item_name} ({item.item_type_name})
                                </label>
                              </td>

                              <td>
                                <TextInput2
                                  type="text"
                                  min="0.00"
                                  name={`unit_price_${item.id}`}
                                  defaultValue={item.unit_price}
                                  readOnly
                                  onChange={(e) =>
                                    handleTotal(
                                      e,
                                      index,
                                      item.id,
                                      finalQTY,
                                      item.unit_price
                                    )
                                  }
                                ></TextInput2>
                              </td>

                              <td>
                                {checkedIds.includes(String(id)) ? (
                                  <>
                                    <TextInput2
                                      type="number"
                                      label="Returning Qty"
                                      name={`qty_${item.id}`}
                                      min="0"
                                      max={item.quantity - item.stock}
                                      maxlength={item.quantity - item.stock}
                                      defaultValue={finalQTY}
                                      required
                                      onChange={(e) =>
                                        handleTotal(
                                          e,
                                          index,
                                          item.id,
                                          finalQTY,
                                          item.unit_price
                                        )
                                      }
                                    ></TextInput2>
                                    <small className="font-monospace">
                                      <strong>Availabel Qty: </strong>{" "}
                                      {item?.stock}
                                    </small>
                                  </>
                                ) : (
                                  <>
                                    <TextInput2
                                      type="number"
                                      label="Returning Qty"
                                      name={`qty_${item.id}`}
                                      min="0"
                                      max={item.quantity - item.stock}
                                      maxlength={item.quantity - item.stock}
                                      value={item.item_qty - item.stock}
                                      readOnly
                                      onChange={(e) =>
                                        handleTotal(
                                          e,
                                          index,
                                          item.id,
                                          finalQTY,
                                          item.unit_price
                                        )
                                      }
                                    ></TextInput2>
                                    <small className="font-monospace">
                                      <strong>Availabel Qty: </strong>{" "}
                                      {item?.stock}
                                    </small>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div> 

                  <div className="mb-4 pt-4 row m-0">
                    <div className="col-md-12 col-lg-12 text-end">
                      <div>
                        <span className="fw-bold">
                          Total Returning Quanity: {totalParQuantity} 
                        </span>
                      </div>
                      <div>
                        <span className="fw-bold">
                          Total Returning Amount: {totalParAmount.toFixed(2)}{" "}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row m-0">
                    <div className="col-md-12 col-lg-12 text-end">
                      <Button variant="success" type="submit" className="">
                        <span className="fs-5 me-1">
                          <FaCheck />
                        </span>
                        Confirm to return
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default PurchaseReturnDetails;
