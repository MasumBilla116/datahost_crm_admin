import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import Label from '../../../../components/elements/Label';
import Select2 from '../../../../components/elements/Select2';
import TextInput from '../../../../components/elements/TextInput';
import toast from "../../../../components/Toast/index";
import Axios from '../../../../utils/axios';
import Link from 'next/link';
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { TextField } from '@mui/material';
import { Button, Form } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { HeadSection } from '../../../../components';

const CreateVoucher = () => {

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [openDate, setOpenDate] = useState(false);
  const [itemId, setItemId] = useState("");
  const [test, setTest] = useState("");
  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryData, setCategoryData] = useState();
  const [itemCode, setItemCode] = useState("");
  const [itemCodeName, setItemCodeName] = useState("");
  const [item_obj, setItemObj] = useState();
  const [remarks, setRemarks] = useState("");
  const [totalRemarks, setTotalRemarks] = useState("");
  const [quantity, setQuantity] = useState();
  const [getItems, setItems] = useState();
  const items_options = getItems?.data;
  const [getItemCategories, setItemCategories] = useState("");
  const categories_options = getItemCategories.data;
  const [itemLoading, setItemLoading] = useState(true);

  const [inv_item_ids, setInvItemIds] = useState([]);
  let item_name_options = { value: itemId || '', label: itemName || 'Select...' };

  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)
  const [pendingCat, setPendingCat] = useState(false)

  var options = [];

  useEffect(() => {
    const controller = new AbortController();
    async function getAllItems() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, { action: "getAllItems", })
        .then((res) => {
          setItems(res?.data);
        });
    }
    const categoryList = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`, { action: "getAllCategories" })
        .then((res) => {
          setItemCategories(res.data);
        });
    };
    getItemByCategory()
    getAllItems();
    categoryList();
    getItemByCode();
    return () => controller.abort();

  }, [categoryId, itemCode])

  const [vouchers, setVourchers] = useState([]);
  const [ind, setInd] = useState(1)
  const [objedit, setObjEdit] = useState(false);
  const [arrayIndex, setArrayIndex] = useState();
  const [editId, setEditId] = useState('');
  const [editedItemId, setEditedItemId] = useState('');
  const [editedItemName, setEditedItemName] = useState('');

  const selected_category_options = { value: categoryId, label: categoryName };
  const selected_code_options = { value: itemCode, label: itemCodeName };
  const selected_item_options = { value: itemId, label: itemName };

  const increment_qty = (index, editId) => {

    const newState = vouchers.map(obj => {
      if (obj.id === editId) {
        return { ...obj, item_qty: (parseInt(obj.item_qty) + 1) };
      }
      return obj;
    });

    setVourchers(newState);


  }

  const changeItemQty = (e, index, editId) => {

    const newState = vouchers.map(obj => {
      if (obj.id === editId) {

        return { ...obj, item_qty: e.target.value };


      }
      return obj;
    });

    setVourchers(newState);

  }

  //Decrement the total qty
  const decrement_qty = (index, editId) => {

    const newState = vouchers.map(obj => {
      if (obj.id === editId && obj.item_qty > 0) {

        return { ...obj, item_qty: (obj.item_qty - 1) };

      }
      return obj;
    });

    setVourchers(newState);


  }


  async function removeObjectFromArray(id) {
    setVourchers(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );
  };


  const getItemByCategory = async () => {
    let isSubscribed = true;
    if (categoryId !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`, { action: "getItemByCategory", id: categoryId })
        .then((res) => {
          if (isSubscribed) {
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
          }
        });
    }
    return () => isSubscribed = false;
  }

  const changeItemCode = (e) => {
    if (e.value) {
      setItemId(e.value);
      setItemName(e.label);
      setItemCodeName(e.code)
    }
  }

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`, { action: "createVoucher", vouchers, totalRemarks, date })
      .then((res) => {
        setLoading(false)
        notify("success", "successfully Added!");
        router.push('/modules/inventory/vouchers');
        setVourchers([])
        e.target.reset();
      })
      .catch((e) => {
        setLoading(false)
        const msg = e.response?.data?.response;

        if (typeof (e.response?.data?.response) == 'string') {
          notify("error", `${e.response.data.response}`);
        }
        else {
          if (msg?.date) {
            notify("error", `${msg?.date?.Date}`);
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
    { text: 'All Consumption Vouchers', link: '/modules/inventory/vouchers' },
    { text: 'Create Vouchers', link: '/modules/inventory/vouchers/create' },
  ]


  return (

    <>
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <HeadSection title="New Voucher" />
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow p-3">
              <div className="border-bottom bg-light title-part-padding d-flex justify-content-between">
                <h4 className="card-title mb-0">
                  <strong className='fw-bolder'>
                    Create New Consumption Voucher
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
                  {/* <div className='row' style={{borderBottom:'2px solid gray'}}>
                    <div className='col-md-12'>
                      <div className='mb-5 row'>
                  



                      </div>
                    </div>

                  </div> */}
                  <div className="row mt-4 mb-3">
                    <Form.Group>
                      <Form.Label>Item Select</Form.Label>
                      <Select2
                        className=""
                        options={items_options?.map(({ id, name, unit_cost, code }) => ({ value: id, label: `${code}--${name}`, code: code }))}
                        value={item_name_options}
                        onChange={(e) => {
                          setItemCode(e.value);
                          setItemCodeName(e.code)
                          setItemId(e.value);
                          setItemName(e.label.split('--')[1]);

                          //if already selected, not selected
                          if (!inv_item_ids.includes(e.value)) {
                            setInvItemIds(prev => [...prev, e.value]);
                            setInd(() => ind + 1);

                            setVourchers((prev) => [...prev, {
                              id: ind,
                              item_qty: parseInt(1),
                              itemId: e.value,
                              itemName: e.label.split('--')[1],
                              remarks: remarks,
                              itemCode: e.value,
                              itemCodeName: e.code,
                            }])
                          }


                        }}
                      />
                    </Form.Group>
                  </div>
                  <div className="row">
                    <Table striped bordered hover>
                      <thead className='border-0' style={{ backgroundColor: "#337AB7", color: "#ffffff" }}>
                        <tr className='text-center'>
                          <th className='fw-bolder'>Item Name</th>
                          <th className='fw-bolder'>Item Code</th>
                          {/* <th className='fw-bolder'>Unit Cost</th> */}
                          <th className='fw-bolder'>Quantity</th>
                          {/* <th className='fw-bolder'>Total</th> */}
                          <th className='fw-bolder'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vouchers?.map((item, index) => (
                          <>
                            {item.itemId !== null && (
                              <tr className='text-center' key={index}>
                                <td>{item.itemName}</td>
                                <td>{item.itemCodeName}</td>
                                <td style={{ width: "200px" }}>
                                  <div className="input-group ">
                                    <span className="input-group-btn">
                                      <Button
                                        variant='danger'
                                        onClick={() => decrement_qty(index, item.id)}
                                      >
                                        <i className="fa fa-minus text-white" />
                                      </Button>
                                    </span>
                                    <input
                                      typ="number"
                                      value={item.item_qty}
                                      className="form-control no-padding text-center"
                                      onChange={(e) => changeItemQty(e, index, item.id)}

                                    />
                                    <span className="input-group-btn">
                                      <Button
                                        variant='primary'
                                        onClick={() => increment_qty(index, item.id)}

                                      >
                                        <i className="fa fa-plus text-white" />
                                      </Button>
                                    </span>
                                  </div>



                                </td>
                                {/* <td>{(item.qty * item.unitPrice).toFixed(2)}</td> */}
                                <td>
                                
                                      <Link href='#'>
                                        <a onClick={() => { removeObjectFromArray(item.id, item.itemId) }}>
                                          <DeleteIcon />
                                        </a>
                                      </Link>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </Table>


                    <Form.Group controlId="formBasicName" className='col-md-6 mt-4'>
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter Category Description"
                        name='remarks'
                        value={totalRemarks}
                        onChange={(e) => setTotalRemarks(e.target.value)}

                      />
                    </Form.Group>
                    <Form.Group className='col-md-6 mt-4'>
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

                    {/* {!!grandTotal && <div className='text-end fw-bold mb-3 me-2'>Total Amount: <span>{grandTotal && Number(grandTotal).toFixed(2)}</span></div>} */}
                    <div className="text-end">
                      <Button variant="success" style={{ float: 'right' }} disabled={!vouchers.length} onClick={submitForm}>
                        Create Invoice
                      </Button>
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

export default CreateVoucher; 
