import MyToast from "@mdrakibul8001/toastify";
import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import makeAnimated from 'react-select/animated';
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import RadioButton from '../../../../components/elements/RadioButton';
import Select from '../../../../components/elements/Select';
import Select2 from "../../../../components/elements/Select2";
import Axios from '../../../../utils/axios';
import { getSSRProps } from "../../../../utils/getSSRProps";
import { HeadSection } from "../../../../components";


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.prmo_ofr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const animatedComponents = makeAnimated();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  //start date and end date
  const [openStartDate, setOpenStartDate] = useState(false);
  const [OpenEndDate, setOpenEndDate] = useState(false);
  const [start_date, set_start_date] = useState(null);
  const [ending_date, set_end_date] = useState(null);
  //  start_date,ending_date

  const [promo, setPromo] = useState({
    name: "",
    promoType: "Flat",
    discount_amount: null,
    discount_percentage: null,
    buying_qty: null,
    free_qty: null,
    start_date: null,
    ending_date: null,
    description: "",

    applicable: "restaurant",
    online_booking: false,
    amount: null,
    promo_apply: "",
    promo_code: "",
    room_type_ids: []
  });


  const handleChange = (e) => {
    setPromo(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  //All Room Types
  const [roomTypes, setRoomTypes] = useState([]);

  const fetchAllRoomTypes = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`, {
        action: "allRoomTypes",
      })
      .then((res) => {
        if (isSubscribed) {
          setRoomTypes(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => (isSubscribed = false);
  };

  useEffect(() => {
    fetchAllRoomTypes();
  }, []);

  let dataset = { ...promo, start_date, ending_date, action: "createPromo" }

  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },

  })
  return (

    <Form validated={validated}>
      <Form.Group controlId="formBasicStatus">
        <div className="mb-3 row">
          <div className="flex-gap align-items-center">
            <div className='mr-3'>
              <p>Applicable For: </p>
            </div>
            <RadioButton
              type="radio"
              label="Restaurant"
              id="Restaurant"
              value="restaurant"
              checked={promo?.applicable == "restaurant"}
              name="applicable"
              onChange={handleChange}
            />

            <RadioButton
              type="radio"
              label="Room Price"
              id="Room_Price"
              value="room_price"
              checked={promo?.applicable == "room_price"}
              name="applicable"
              onChange={handleChange}
            />

            <div className="form-check ms-auto mr-sm-2">
              <input type="checkbox" className="form-check-input"
                id="online_booking" name='online_booking'
                checked={promo?.online_booking}
                onChange={() => setPromo(prev => ({ ...prev, online_booking: !(promo?.online_booking) }))}
                disabled={promo?.applicable === "room_price" ? false : true}
              />
              <label className="form-check-label" for="online_booking">Applicable for online booking?</label>
            </div>

          </div>
        </div>
      </Form.Group>

      <div className='row mb-2'>
        <div className="col-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Promo Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Promo Offer Title"
              name='name'
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-6">
          <Form.Group controlId="formBasicDesc" >
            <Form.Label>Select Promo type</Form.Label>
            <Select name="promoType" onChange={handleChange}>
              <option value="" disabled>select discount type</option>
              <option value="Flat">Flat Rate</option>
              <option value="Percentage">Percentage</option>
              {!(promo?.online_booking) && promo?.applicable !== "room_price" &&
                <option value="Buy_Get">Buy & Get Extra</option>
              }
            </Select>
          </Form.Group>
        </div>
      </div>


      {/* Discount amount for restaurant */}
      {promo?.applicable === 'restaurant' && <>
        <div className={`${(promo.promoType == 'Flat') ? 'mb-2' : 'd-none'}`}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Discount Amount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Discount Amount"
              name='discount_amount'
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className={`${(promo.promoType == 'Percentage') ? 'mb-2' : 'd-none'}`}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Discount in Percent (%)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Discount in Percent (%)"
              name='discount_percentage'
              onChange={handleChange}
            />
          </Form.Group>
        </div>
      </>}


      {/* Discount amount for room */}
      {promo?.applicable === 'room_price' && <>
        <div className="row mb-2">
          <Form.Group className="col-6" controlId="formBasicEmail">
            <Form.Label>Discount Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Discount Amount"
              name='amount'
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2 col-6" controlId="formBasicDesc" >
            <Form.Label>Select Room Types</Form.Label>
            <Select2
              isMulti
              options={roomTypes && roomTypes.map(({ id, name }) => ({ value: id, label: name }))}
              onChange={(e) => setPromo(prev => ({ ...prev, room_type_ids: (Array.isArray(e) ? e.map(x => x.value) : []) }))}
              components={animatedComponents}
              closeMenuOnSelect={false}
            />

          </Form.Group>
        </div>

      </>}

      {promo?.applicable === "room_price" && promo?.online_booking && (<>
        <div className='row mb-2'>
          <Form.Group className="col-6" controlId="formBasicDesc" >
            <Form.Label>Select Promo Apply For</Form.Label>
            <Select name="promo_apply" onChange={handleChange}>
              <option value="" disabled> when will be applicable promo offer ? </option>
              <option value="always">Always Apply</option>
              <option value="once">Apply upon promo code</option>
            </Select>
          </Form.Group>

          <Form.Group className="col-6" controlId="formBasicEmail">
            <Form.Label>Promo Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Promo code"
              name='promo_code'
              onChange={handleChange}
              disabled={promo?.promo_apply === 'once' ? false : true}
              required
            />
          </Form.Group>

        </div>

      </>)
      }

      {!(promo?.online_booking) && promo?.applicable === "restaurant" && (<>
        <div className={`${(promo.promoType == 'Buy_Get') ? 'mb-2' : 'd-none'}`}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Buying Qty</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Buying Qty"
                  name='buying_qty'
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Free Qty</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Free Qty"
                  name='free_qty'
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </>)}



      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Start Date</Form.Label>
            {/* <Form.Control
              type="date"
              placeholder="Enter Promo Offer Start Date"
              name='start_date'
              onChange={handleChange}
              required
            /> */}

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker

                size={1}
                label="From"
                open={openStartDate}
                onClose={() => setOpenStartDate(false)}
                value={start_date}
                inputFormat="yyyy-MM-dd"
                onChange={(event) => {
                  set_start_date(format(new Date(event), 'yyyy-MM-dd'));
                }}

                renderInput={(params) =>
                  <ThemeProvider theme={theme}>
                    <TextField onClick={() => setOpenStartDate(true)} fullWidth={true} size='small' {...params} required />
                  </ThemeProvider>
                }
              />
            </LocalizationProvider>
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Ending Date</Form.Label>
            {/* <Form.Control
              type="date"
              placeholder="Enter Promo Offer End Date"
              name='ending_date'
              onChange={handleChange}
              required
            /> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker

                size={1}
                label="To"
                open={OpenEndDate}
                onClose={() => setOpenEndDate(false)}
                value={ending_date}
                inputFormat="yyyy-MM-dd"
                onChange={(event) => {
                  set_end_date(format(new Date(event), 'yyyy-MM-dd'));
                }}

                renderInput={(params) =>
                  <ThemeProvider theme={theme}>
                    <TextField onClick={() => setOpenEndDate(true)} fullWidth={true} size='small' {...params} required />
                  </ThemeProvider>
                }
              />
            </LocalizationProvider>
          </Form.Group>
        </div>
      </div>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" className="shadow rounded mb-3 mt-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditForm = ({ onSubmit, promoId, pending, validated }) => {

  const { http } = Axios();
  const animatedComponents = makeAnimated();

  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState({
    name: "",
    promoType: "",
    discount_amount: null,
    discount_percentage: null,
    buying_qty: null,
    free_qty: null,
    start_date: null,
    ending_date: null,
    description: "",
    promo_id: promoId,

    applicable: "restaurant",
    online_booking: false,
    amount: null,
    promo_apply: "",
    promo_code: "",
    room_type_ids: []
  })


  const handleChange = (e) => {
    setPromo(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  //All Room Types
  const [roomTypes, setRoomTypes] = useState([]);

  const fetchAllRoomTypes = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`, {
        action: "allRoomTypes",
      })
      .then((res) => {
        if (isSubscribed) {
          setRoomTypes(res.data.data);
        }
      })
      .catch((err) => {
        // console.log(err);
      });

    return () => (isSubscribed = false);
  };

  useEffect(() => {
    fetchAllRoomTypes();
  }, []);

  const fetchPromoData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, { action: "getPromoInfo", promo_id: promoId })
      .then((res) => {
        if (isSubscribed) {
          setPromo(prev => ({
            ...prev,
            name: res.data.data.name,
            promoType: res.data.data.promo_type,
            discount_amount: res.data.data.discount_amount,
            discount_percentage: res.data.data.discount_percentage,
            buying_qty: res.data.data.buying_qty,
            free_qty: res.data.data.free_qty,

            applicable: res.data.data?.applicable_for,
            online_booking: Boolean(Number(res.data.data?.online_booking)),
            amount: res.data?.data?.amount,
            promo_apply: res.data.data?.promo_apply,
            promo_code: res.data.data?.promo_code,
            room_type_ids: (res.data.data?.room_types?.map(roomType => roomType.id)),
            room_type_data: (res.data.data?.room_types),

            start_date: res.data.data.start_date,
            ending_date: res.data.data.ending_date,
            description: res.data.data.description,
          }));
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [promoId]);

  useEffect(() => {
    fetchPromoData();
  }, [fetchPromoData])

  console.log(promo);


  let dataset = { ...promo, action: "editPromo" }

  return (

    <Form >

      <Form.Group controlId="formBasicStatus">
        <div className="mb-3 row">
          <div className="col-12 d-md-flex align-items-center">
            <div className='mr-3'>
              <p>Applicable For: </p>
            </div>
            {promo?.applicable === "restaurant" &&
              <RadioButton
                type="radio"
                label="Restaurant"
                value="restaurant"
                checked={promo?.applicable == "restaurant"}
                name="applicable"
                // disabled={promo?.applicable === "restaurant" ? false:true}
                onChange={handleChange}
              />
            }

            {promo?.applicable === "room_price" &&
              <RadioButton
                type="radio"
                label="Room Price"
                value="room_price"
                checked={promo?.applicable == "room_price"}
                name="applicable"
                // disabled={promo?.applicable === "room_price" ? false:true}
                onChange={handleChange}
              />
            }

            {promo?.applicable === "room_price" &&
              <div className="form-check ms-auto mr-sm-2">
                <input type="checkbox" className="form-check-input"
                  id="online_booking" name='online_booking'
                  checked={promo?.online_booking}
                  onChange={() => setPromo(prev => ({ ...prev, online_booking: !(promo?.online_booking) }))}
                // disabled={promo?.applicable === "room_price" ? false:true}
                />
                <label className="form-check-label" for="online_booking">Applicable for online booking?</label>
              </div>
            }

          </div>
        </div>
      </Form.Group>

      <div className='row mb-2'>
        <div className="col-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Promo Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Promo Title"
              name='name'
              defaultValue={promo.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-6">
          <Form.Group controlId="formBasicDesc" >
            <Form.Label>Select Offer Type</Form.Label>
            {loading ? (
              <Select>
                <option value="">loading...</option>
              </Select>
            ) : (
              <Select name="promoType" value={promo.promoType} onChange={handleChange}>
                <option value="" disabled>select discount type</option>
                <option value="Flat">Flat Rate</option>
                <option value="Percentage">Percentage</option>
                {!(promo?.online_booking) && promo?.applicable !== "room_price" &&
                  <option value="Buy_Get">Buy & Get Extra</option>
                }
              </Select>
            )}
          </Form.Group>
        </div>
      </div>

      {/* Discount amount for restaurant */}
      {promo?.applicable === 'restaurant' && <>
        <div className={`${(promo.promoType == 'Flat') ? 'mb-2' : 'd-none'}`}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Discount Amount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Discount Amount"
              name='discount_amount'
              defaultValue={promo.discount_amount}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className={`${(promo.promoType == 'Percentage') ? 'mb-2' : 'd-none'}`}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Discount in Percent (%)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Discount in Percent (%)"
              name='discount_percentage'
              defaultValue={promo.discount_percentage}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
      </>}

      {/* Discount amount for room */}
      {promo?.applicable === 'room_price' && <>
        <div className="row mb-2">
          <Form.Group className="col-6" controlId="formBasicEmail">
            <Form.Label>Discount Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Discount Amount"
              name='amount'
              defaultValue={promo?.amount}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="col-6" controlId="formBasicDesc" >
            <Form.Label>Select Room Types</Form.Label>
            <Select2
              isMulti
              options={roomTypes && roomTypes.map(({ id, name }) => ({ value: id, label: name }))}
              defaultValue={promo?.room_type_data.map(({ id, name }) => ({ value: id, label: name }))}
              onChange={(e) => setPromo(prev => ({ ...prev, room_type_ids: (Array.isArray(e) ? e.map(x => x.value) : []) }))}
              components={animatedComponents}
              closeMenuOnSelect={false}
            />

          </Form.Group>
        </div>
      </>}


      {!(promo?.online_booking) && promo?.applicable === "restaurant" && (<>
        <div className={`${(promo.promoType == 'Buy_Get') ? '' : 'd-none'}`}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Buying Qty</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Buying Qty"
                  name='buying_qty'
                  defaultValue={promo.buying_qty}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Free Qty</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Free Qty"
                  name='free_qty'
                  defaultValue={promo.free_qty}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </>)}

      {promo?.applicable === "room_price" && promo?.online_booking && (<>
        <div className='row mb-2'>
          <Form.Group className="col-6" controlId="formBasicDesc" >
            <Form.Label>Select Promo Apply For</Form.Label>
            <Select name="promo_apply" defaultValue={promo?.promo_apply} onChange={handleChange}>
              <option value="" disabled> when will be applicable promo offer ? </option>
              <option value="always">Always Apply</option>
              <option value="once">Apply upon promo code</option>
            </Select>
          </Form.Group>

          <Form.Group className="col-6" controlId="formBasicEmail">
            <Form.Label>Promo Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Promo code"
              name='promo_code'
              defaultValue={promo?.promo_code}
              onChange={handleChange}
              disabled={promo?.promo_apply === 'once' ? false : true}
              required
            />
          </Form.Group>

        </div>

      </>)
      }

      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter Promo Offer Start Date"
              name='start_date'
              defaultValue={promo.start_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Ending Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter Promo Offer End Date"
              name='ending_date'
              defaultValue={promo.ending_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>
      </div>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          defaultValue={promo.description}
          onChange={handleChange}
        />
      </Form.Group>


      <Button variant="primary" className="shadow rounded"
        disabled={pending || loading} style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset)}
      >
        {pending ? 'Updating...' : 'Update'}
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, promoId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState({
    promo_id: promoId
  })

  let dataset = { ...promo, action: "deletePromo" }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(dataset)}>
          Confirm
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({ accessPermissions }) {

  const { http } = Axios();

  const { notify } = MyToast();


  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.offer_type) {
            notify("error", `Offer Type must not be empty!`);
          }
          if (msg?.start_date) {
            notify("error", `Start Date must not be empty!`);
          }
          if (msg?.ending_date) {
            notify("error", `Ending Date must not be empty!`);
          }
        }
        setLoading(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }




  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [promoId, setPromoId] = useState(null)

  const handleExit = () => { setShowUpdateModal(false) };
  const handleOpen = (promo_id) => {
    setShowUpdateModal(true);
    setPromoId(promo_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);

        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.offer_type) {
            notify("error", `Offer Type must not be empty!`);
          }
          if (msg?.start_date) {
            notify("error", `Start Date must not be empty!`);
          }
          if (msg?.ending_date) {
            notify("error", `Ending Date must not be empty!`);
          }
        }
        setPending(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (promo_id) => {
    setShowDeleteModal(true);
    setPromoId(promo_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }

      })
      .catch((e) => {
        console.log('error delete !')
        setPending(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }

  //Tower Floor Rooms data list
  const [promoList, setPromoList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);


  //Fetch List Data for datatable
  const data = promoList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, {
      action: "getAllPromos",
    })
      .then((res) => {
        if (isSubscribed) {
          setPromoList(res?.data);
          setFilteredData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase())
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search])


  const Amount = (applicable, promoType, amount, flatAmount, percentageAmount) => {
    if (applicable === 'room_price') {
      return <>{amount}</>
    }
    else if (applicable === 'restaurant') {
      return (promoType === 'Flat' ? <>{flatAmount}</> : promoType === 'Percentage' ? <>{percentageAmount}</> : <></>)
    }
  }


  const actionButton = (promoId) => {
    return <>
      <ul className="action ">

        {accessPermissions.createAndUpdate && <li>
          <a href='#' onClick={(e) => { e.preventDefault(); handleOpen(promoId) }}>
            <EditIcon />
          </a>

        </li>}
        {accessPermissions.delete && <li>
          <a href='#' onClick={(e) => { e.preventDefault(); handleOpenDelete(promoId) }}>
            <DeleteIcon />
          </a>

        </li>}

      </ul>
    </>
  }


  const columns = [

    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Applicable For',
      selector: row => row.applicable_for,
      sortable: true,
    },
    {
      name: 'Promo Type',
      selector: row => row.promo_type,
      sortable: true,
    },
    // {
    //   name: 'Discount Amount',
    //   selector: row =>row.discount_amount ? row.discount_amount : 0 ,
    //   sortable: true,
    // },
    {
      name: 'Discount Amount',
      selector: row => Amount(row.applicable_for, row.promo_type, row.amount, row.discount_amount, row.discount_percentage),
      sortable: true,
    },
    // {
    //   name: 'Discount Percentage',
    //   selector: row =>row.discount_percentage ? row.discount_percentage : '0%' ,
    //   sortable: true,
    // },
    {
      name: 'Buying Qty',
      selector: row => row.buying_qty ? row.buying_qty : 0,
      sortable: true,
    },
    {
      name: 'Free Qty',
      selector: row => row.free_qty ? row.free_qty : 0,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: row => row.start_date,
      sortable: true,
    },
    {
      name: 'Ending Date',
      selector: row => row.ending_date,
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: "100px",                       // added line here

    },

  ];



  return (
    <div className="container-fluid">
            <HeadSection title="Promo Offers" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow m-xs-2">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Promo Offers</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {accessPermissions.createAndUpdate &&<Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Create Promo Offer
                </Button>}



                {/* Create Modal Form */}
                <Modal dialogClassName="modal-lg" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Promo Offer</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateForm onSubmit={submitForm} loading={loading} />
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}

                {/* Update Modal Form */}
                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Promo Offer</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} promoId={promoId} pending={pending}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} promoId={promoId} pending={pending} />
                </Modal>

              </div>
            </div>


            <div className="card-body">
              <div className="">

                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  subHeader
                  subHeaderComponent={
                    <input
                      type="text"
                      placeholder="search..."
                      className="w-25 form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  }
                  striped
                />

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}