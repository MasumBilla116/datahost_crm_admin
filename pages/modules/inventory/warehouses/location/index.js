import Collapse from '@material-ui/core/Collapse';
import SvgIcon from '@material-ui/core/SvgIcon';
import { alpha, makeStyles, withStyles } from '@material-ui/core/styles';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import { animated, useSpring } from '@react-spring/web'; // web.cjs is required for IE 11 support
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { HeadSection } from '../../../../../components';
import toast from "../../../../../components/Toast/index";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import RadioButton from "../../../../../components/elements/RadioButton";
import Select from '../../../../../components/elements/Select';
import Select2 from "../../../../../components/elements/Select2";
import Axios from '../../../../../utils/axios';
import { getSSRProps } from '../../../../../utils/getSSRProps';


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.invtr.wrhslctn" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => <TreeItem {...props} />);

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

//Create Component
const CreateForm = ({ onSubmit, loading }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [location, setLocation] = useState({
    title: "",
    title_prefix: "",
    location_type: "",
    description: "",
    range_start: 0,
    range_end: 0,
  })

  const [warehouseList, setWarehouseList] = useState("");
  const [levelList, setLevelList] = useState("");
  const [warehouseId, setWarehouseId] = useState();
  const [levelId, setLevelId] = useState();
  const [levelNumber, setLevelNumber] = useState();
  const [catLoading, setCatLoading] = useState(false)
  const [pending, setPending] = useState(false)

  const [locationList, setLocationList] = useState("");
  const [locationtwoList, setLocationtwoList] = useState("");
  const [locationthreeList, setLocationthreeList] = useState("");
  const [locationfourList, setLocationfourList] = useState("");

  const [locationOneId, setLocationOneId] = useState();
  const [locationTwoId, setLocationTwoId] = useState();
  const [locationThreeId, setLocationThreeId] = useState();
  const [locationFourId, setLocationFourId] = useState();

  const handleChange = (e) => {
    setLocation(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))

    if (e.target.name == 'level_name') {
      setLevelName([{ id: 1, name: e.target.value }])
    }
  }

  useEffect(() => {
    let isSubscribed = true;
    const AllWarehouses = async () => {
      setCatLoading(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse`, { action: "getAllWarehouse" })
        .then((res) => {
          if (isSubscribed) {
            setWarehouseList(res.data.data);
            setCatLoading(false)
          }
        })
        .catch((err) => {
          console.log('Something went wrong !')
        });
    }

    AllWarehouses();
    getLevelByWarehouse()
    if (warehouseId && levelId) {
      getLocationByLevel();
    }
    if (locationOneId) {
      getLocationByLocationOne()
    }
    if (locationTwoId) {
      getLocationByLocationTwo()
    }
    if (locationThreeId) {
      getLocationByLocationThree()
    }
    return () => isSubscribed = false;

  }, [warehouseId, levelId, locationOneId, locationTwoId, locationThreeId])


  const changeWarehouse = (e) => {
    if (e.value) {
      setWarehouseId(e.value);
    }
  }

  const getLevelByWarehouse = async () => {
    let isSubscribed = true;
    if (warehouseId !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, { action: "getLevelByWarehouse", id: warehouseId })
        .then((res) => {
          if (isSubscribed) {
            setLevelList(res.data.data);
            setPending(false)
          }
        });
    }
    return () => isSubscribed = false;
  }

  const changeLevel = (e) => {
    if (e.target.value) {
      setLevelNumber($("#levelSelect").find("option:selected").attr('level_number'))
      setLevelId(e.target.value);
    }
  }

  const getLocationByLevel = async () => {
    let isSubscribed = true;
    if (levelId !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, { action: "getLocationByLevel", warehouseId: warehouseId, levelId: levelId, current_id: warehouseId })
        .then((res) => {
          if (isSubscribed) {
            setLocationList(res.data.data);
            setPending(false)
          }
        })
        .catch((e) => {
          const msg = e.response?.data?.response;
          if (typeof (msg) == 'string') {
            notify("error", `${msg}`);
            setLevelId('')
          }
        });

    }
    return () => isSubscribed = false;
  }

  const changeLocationOne = (e) => {
    if (e.target.value) {
      setLocationOneId(e.target.value);
    }
  }

  const getLocationByLocationOne = async () => {
    let isSubscribed = true;
    if (locationOneId !== "") {
      setPending(true)

      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, { action: "getLocationByLocation", warehouseId: warehouseId, current_id: locationOneId })
        .then((res) => {
          if (isSubscribed) {
            setLocationtwoList(res.data.data);
            setPending(false)
          }
        });
    }
    return () => isSubscribed = false;
  }

  const changeLocationTwo = (e) => {
    if (e.target.value) {
      setLocationTwoId(e.target.value);
    }
  }

  const getLocationByLocationTwo = async () => {
    let isSubscribed = true;
    if (locationTwoId !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, { action: "getLocationByLocation", warehouseId: warehouseId, current_id: locationTwoId })
        .then((res) => {
          if (isSubscribed) {
            setLocationthreeList(res.data.data);
            setPending(false)
          }
        });
    }
    return () => isSubscribed = false;
  }

  const changeLocationThree = (e) => {
    if (e.target.value) {
      setLocationThreeId(e.target.value);
    }
  }

  const getLocationByLocationThree = async () => {
    let isSubscribed = true;
    if (locationThreeId !== "") {
      setPending(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, { action: "getLocationByLocation", warehouseId: warehouseId, current_id: locationThreeId })
        .then((res) => {
          if (isSubscribed) {
            setLocationfourList(res.data.data);
            setPending(false)
          }
        });
    }
    return () => isSubscribed = false;
  }

  const changeLocationFour = (e) => {
    if (e.target.value) {
      setLocationFourId(e.target.value);
    }
  }

  let dataset = { ...location, warehouseId, levelId, locationOneId, locationTwoId, locationThreeId, locationFourId, action: "createLocation" }

  return (

    <Form>
      <Form.Group className="mb-3" controlId="formBasicDesc" >
        <Form.Label>Select Warehouse</Form.Label>
        <Select2
          options={warehouseList && warehouseList.map(({ id, name }) => ({ value: id, label: name }))}
          onChange={changeWarehouse}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDesc" >
        <Form.Label>Select Location Level</Form.Label>
        {pending ? (
          <Select>
            <option value="">loading...</option>
          </Select>
        ) : (
          <Select value={levelId} id="levelSelect" onChange={changeLevel}>
            <option value="">Select Location Level</option>
            {levelList &&
              levelList?.map((level, ind) => (
                <>
                  <option key={ind} value={level.id} level_number={level.level_number}>{level.label}</option>
                </>
              ))
            }
          </Select>
        )}
      </Form.Group>

      <div className="row">
        <div className="col-md-3">
          {locationList &&
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Location of {levelList[0].label}</Form.Label>
              {pending ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={locationOneId} onChange={changeLocationOne}>
                  <option value="">Select Location of {levelList[0].label}</option>
                  {locationList &&
                    locationList?.map((level, ind) => (
                      <>
                        <option value={level.id}>{level.title}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>}
        </div>
        <div className="col-md-3">
          {locationList && locationtwoList && levelNumber >= 3 &&
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Location of {levelList[1].label}</Form.Label>
              {pending ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={locationTwoId} onChange={changeLocationTwo}>
                  <option value="">Select Location of {levelList[1].label}</option>
                  {locationtwoList &&
                    locationtwoList?.map((level, ind) => (
                      <>
                        <option value={level.id}>{level.title}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>}
        </div>
        <div className="col-md-3">
          {locationList && locationthreeList && levelNumber >= 4 &&
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Location of {levelList[2].label}</Form.Label>
              {pending ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={locationThreeId} onChange={changeLocationThree}>
                  <option value="">Select Location of {levelList[2].label}</option>
                  {locationthreeList &&
                    locationthreeList?.map((level, ind) => (
                      <>
                        <option value={level.id}>{level.title}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>}
        </div>
        <div className="col-md-3">
          {locationList && locationfourList && levelNumber >= 5 &&
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Location of {levelList[3].label}</Form.Label>
              {pending ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={locationFourId} onChange={changeLocationFour}>
                  <option value="">Select Location of {levelList[3].label}</option>
                  {locationfourList &&
                    locationfourList?.map((level, ind) => (
                      <>
                        <option value={level.id}>{level.title}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>}
        </div>
      </div>

      <Form.Group className="mb-3" controlId="formBasicDesc" >
        <Select name="location_type" onChange={handleChange}>
          <option value="">Select Location Type</option>
          <option value="Individual-Location">Individual Location</option>
          <option value="Ranged-Location">Ranged Location</option>
        </Select>
      </Form.Group>

      <div className={`${(location.location_type == 'Individual-Location') ? '' : 'd-none'}`}>
        <Form.Group className="mb-3" controlId="formBasicName" >
          <Form.Label>Location Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Location Title"
            name='title'
            onChange={handleChange}
          />
        </Form.Group>
      </div>

      <div className={`${(location.location_type == 'Ranged-Location') ? '' : 'd-none'}`}>
        <div className="row">
          <div className="col-md-4">
            <Form.Group className="mb-3" controlId="formBasicName" >
              <Form.Label>Location Title Prefix</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Location Title Prefix"
                name='title_prefix'
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group className="mb-3" controlId="formBasicName" >
              <Form.Label>Range Start</Form.Label>
              <Form.Control
                type="number"
                placeholder="Range Start"
                name='range_start'
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Group className="mb-3" controlId="formBasicName" >
              <Form.Label>Range End</Form.Label>
              <Form.Control
                type="number"
                placeholder="Range End"
                name='range_end'
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </div>
      </div>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Location Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Location Description"
          name='description'
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" className="shadow rounded mb-3 mt-3" disabled={loading || catLoading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditForm = ({ onSubmit, itemId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    title: "",
    status: "",
    id: itemId,
  })

  const [categories, setCategoryList] = useState("");
  const [category_id, setCategoryId] = useState();
  const [catLoading, setCatLoading] = useState(false)

  const handleChange = (e) => {
    setLocation(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const fetchItemData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, { action: "getLocationInfo", id: itemId })
      .then((res) => {
        if (isSubscribed) {
          setLocation(prev => ({
            ...prev,
            title: res.data.data.title,
            status: res.data.data.status,
          }));
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [itemId]);

  useEffect(() => {
    fetchItemData();
  }, [fetchItemData])


  let dataset = { ...location, action: "editLocation" }

  return (

    <Form >
      <Form.Group controlId="formBasicName" className="mb-3">
        <Form.Label>Location Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Location Name"
          defaultValue={location.title}
          name="title"
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-4 mt-3 row">
        <div className="col-md-6 col-lg-6" >
          <Form.Label className=" m-0">Status <span className="text-danger">*</span></Form.Label>
          <div className="row m-0 " >
            <div className="col-12">
              <div className=" align-content-start flex-gap">
                <div>
                  <RadioButton
                    id="enable"
                    label="enable"
                    name="status"
                    value="1"
                    checked={location?.status == 1}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <RadioButton
                    id="disable"
                    label="Disable"
                    name="status"
                    value="0"
                    checked={location?.status == 0}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div></div>
      </Form.Group>

      <Button variant="primary" className="shadow rounded"
        disabled={pending || loading} style={{ marginTop: "5px" }}
        onClick={() => onSubmit(dataset)}
      >
        {pending ? 'updating...' : 'update'}
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, itemId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    item_id: itemId
  })

  let dataset = { locationId: itemId, action: "deleteLocation" }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(dataset)}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({accessPermissions}) {
  const classes = useStyles();
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);


  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [actionBtn, setActionBtn] = useState({
    id: null,
    action: false
  })

  const subActionBtn = (subAction) => {
    setActionBtn(prev => ({
      ...prev, id: subAction, action: true
    }))
  }

  const subEditBtn = (subEdit) => {
    handleOpen(subEdit)
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCollapse = () => setCollapse("open");

  //create floor form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, items)
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
          if (msg?.location_type) {
            notify("error", `${msg.location_type.Location_type}`);
          }
          if (msg?.levelId) {
            notify("error", `${msg.levelId.LevelId}`);
          }
          if (msg?.title) {
            notify("error", `${msg.title.Title}`);
          }
          if (msg?.title_prefix) {
            notify("error", `${msg.title_prefix.Title_prefix}`);
          }
          if (msg?.range_start) {
            notify("error", `${msg.range_start.Range_start}`);
          }
          if (msg?.range_end) {
            notify("error", `${msg.range_end.Range_end}`);
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
  const [itemId, setItemId] = useState(null);
  const [sectorId, setSectorId] = useState(null);

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (item_id) => {
    setShowUpdateModal(true);
    setItemId(item_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, formData)
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
          if (msg?.title) {
            notify("error", `${msg.title.Title}`);
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
  const handleOpenDelete = (item_id) => {
    setShowDeleteModal(true);
    setItemId(item_id);
  }


  //Delete Location form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, formData)
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
  const [itemList, setItemList] = useState([]);
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
  const data = itemList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/warehouse/location`, {
      action: "getAllLocation",
    })
      .then((res) => { 
        if (isSubscribed) {
          setItemList(res?.data);
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





  const actionButton = (itemId) => {
    return <>
      <ul className="action ">

        {accessPermissions.createAndUpdate && <li>
          <Link href="#">
            <a onClick={() => handleOpen(itemId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.delete &&<li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(itemId)}>
              <DeleteIcon />
            </a>
          </Link>

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
      name: 'Item Code',
      selector: row => row.code,
      sortable: true,
    },
    {
      name: 'Category',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Unit Cost',
      selector: row => row.unit_cost,
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: row => row.qty,
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: "80px",                       // added line here

    },

  ];

  const handleEditClick = (e, nodeId) => {
    e.preventDefault();
  }




  function TreeNode({ node }) {
    return (
      <>
        <StyledTreeItem key={node.id} nodeId={`${node.id}`}
          onClick={(e) => setSectorId(node.id)}
          label={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px' }}>{node.title}</div>
              <div style={{ marginRight: '5px' }}>
                <a onClick={() => { handleOpen(node.id); }}>
                  {sectorId === node.id && <EditIcon />}
                </a>
              </div>
              <div>
                <a onClick={() => { handleOpenDelete(node.id); }}>
                  {sectorId === node.id && <DeleteIcon />}
                  {/* {sectorId === node.id && node?.children_recursive?.length < 1 && <DeleteIcon />} */}
                </a>
              </div>
            </div>
          }
        >
          {node.children_recursive && <TreeNodes nodes={node.children_recursive} />}
        </StyledTreeItem>
      </>
    );
  }

  function TreeNodes({ nodes }) {
    return (
      <>
        {nodes.map(node => (
          <TreeNode node={node} key={node.id} />
        ))}
      </>
    );
  }


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Location', link: '/modules/inventory/warehouses/location' },
  ]
  return (
    <>
      <HeadSection title="All Location" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2 ">
            <div className="card shadow" style={{ overflowY: "scroll !important" }}>

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Warehouse Locations</h4>
                </div>
                <div className="ms-auto flex-shrink-0"> 
                 { accessPermissions.createAndUpdate && <Button
                    className="shadow rounded btn-sm  "
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Add Location
                  </Button>}


                  {/* Create Modal Form */}
                  <Modal dialogClassName="modal-dialog modal-md pl-0" show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add Warehouse Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm onSubmit={submitForm} loading={loading} />
                    </Modal.Body>
                  </Modal>
                  {/* End Create Modal Form */}

                  {/* Update Modal Form */}
                  <Modal dialogClassName="modal-dialog modal-md pl-0" show={showUpdateModal} onHide={handleExit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm onSubmit={updateForm} itemId={itemId} pending={pending}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Update Modal Form */}
                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent onSubmit={handleDelete} itemId={itemId} pending={pending} />
                  </Modal>

                </div>
              </div>

              <div className="card-body  tree-view">
                <div className="row">
                  {data?.map((item, i) => (<Fragment key={i}>

                    <div className="col-md-3  mb-xs-9.5rem">
                      <h3 className="card-title text-bold text-success"><u>{item.name.toUpperCase()}</u></h3>

                      <TreeView
                        className={classes.root}
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        defaultEndIcon={<CloseSquare />}
                        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                      >
                        <TreeNodes nodes={item?.filter_locations} />

                      </TreeView>
                    </div>
                  </Fragment>))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}