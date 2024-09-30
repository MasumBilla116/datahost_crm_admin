import Collapse from '@material-ui/core/Collapse';
import SvgIcon from '@material-ui/core/SvgIcon';
import { alpha, makeStyles, withStyles } from '@material-ui/core/styles';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import MyToast from '@mdrakibul8001/toastify';
import { animated, useSpring } from '@react-spring/web'; // web.cjs is required for IE 11 support
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { FaFolderOpen } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { HeadSection } from '../../../../components';
import DeleteIcon from "../../../../components/elements/DeleteIcon";
import EditIcon from "../../../../components/elements/EditIcon";
import Select from '../../../../components/elements/Select';
import Select2 from '../../../../components/elements/Select2';
import Axios from "../../../../utils/axios";
import { getSSRProps } from '../../../../utils/getSSRProps';


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.acnt.acnt_sctr" });
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

const SubSectors = ({ sect, dot }) => {

  return (
    <>
      {sect?.children_recursive?.map((subsect, i) => (
        <Fragment key={i}>
          <option value={subsect.id} data_name={subsect.title} >{dot}{subsect.title}</option>
          {subsect?.children_recursive?.length != 0 && (
            <SubSectors sect={subsect} dot={'----' + dot} />
          )}
        </Fragment>
      ))}
    </>
  );
}

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [sector, setSector] = useState({
    account_type: "",
    title: "",
    parent_id: 0,
    description: "",
  })

  const [sectorLists, setSectorList] = useState([]);

  const handleChange = (e) => {
    setSector(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    const controller = new AbortController();
    const sectorList = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, { account_type: sector.account_type, action: "getSubSectors" })
        .then((res) => {
          setSectorList(res.data.data);
        });
    };
    sectorList()
    return () => controller.abort();
  }, [sector.account_type])

  let dataset = { ...sector, action: "createSector" }

  return (

    <Form validated={validated}>
      <Form.Group className="mb-3" controlId="formBasicDesc" >
        <Form.Label>Select Account Type</Form.Label>
        <Select value={sector.account_type} required name="account_type" onChange={handleChange}>
          <option value="">Select Account type</option>
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
          <option value="revenue">Revenue</option>
          <option value="expenditure">Expenditure</option>
        </Select>
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Title"
          name='title'
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDesc" >
        <Form.Label>Select Parent</Form.Label>
        {loading ? (
          <Select>
            <option value="">loading...</option>
          </Select>
        ) : (
          <Select onChange={(e) => setSector(prev => ({
            ...prev, parent_id: e?.target?.value
          }))}>
            <option value="0">none</option>
            {sectorLists &&
              sectorLists?.map((sect, ind) => (
                <Fragment key={ind}>
                  <option value={sect.id}>{sect.title}</option>
                  {sect?.children_recursive?.length != 0 && (
                    <SubSectors sect={sect} dot='----' />
                  )}
                </Fragment>
              ))
            }
          </Select>
        )}
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};

//Update component
const EditForm = ({ onSubmit, sectorId, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true)

  const [sector, setSector] = useState({
    account_type: "",
    title: "",
    parent_id: 0,
    description: "",
    sector_id: sectorId
  })
 


  const [sectorLists, setSectorList] = useState([]);

  var handleFood = (e) => {
    setFoods(Array.isArray(e) ? e.map(x => x.value) : []);
  }

  const handleChange = (e) => {
    if (e.target) {
      // For regular form inputs (text, textarea, etc.)
      const { name, value } = e.target;

      setSector((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      // For Select2 component
      setSector((prev) => ({
        ...prev,
        [e.name]: e.value,
      }));
    }
  };



  const fetchSectorData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, { action: "getSectorInfo", sector_id: sectorId })
      .then((res) => {
        if (isSubscribed) {
          setSector(prev => ({
            ...prev,
            account_type: res.data.data.account_type,
            title: res.data.data.title,
            parent_id: res.data.data.parent_id,
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

  }, [sectorId]);

  useEffect(() => {
    const controller = new AbortController();
    const sectorList = async () => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, { account_type: sector.account_type, action: "getSubSectors" })
        .then((res) => {
          setSectorList(res.data.data);
        });
    };
    sectorList()
    return () => controller.abort();
  }, [sector.account_type])

  useEffect(() => {
    fetchSectorData();
  }, [fetchSectorData])


  let dataset = { ...sector, action: "editSector" }



  const modulesOptions = [
    { label: 'HRM', value: 'hrm' },
    { label: 'Clients', value: 'clients' },
    { label: 'Booking', value: 'booking' },
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Housekeeping', value: 'housekeeping' },
    { label: 'Laundry', value: 'laundry' },
    { label: 'Locker', value: 'locker' },
    { label: 'Purchase', value: 'purchase' },
    { label: 'Supplier', value: 'supplier' },
    { label: 'Room Pricing', value: 'roomPricing' },
    { label: 'Manage Rooms', value: 'manageRooms' },
    { label: 'Stock', value: 'stock' },
    { label: 'Accounts', value: 'accounts' },
  ]

  return (

    <Form >

      {/* <Form.Group className="mb-3" controlId="formBasicDesc" >
          <Form.Label>Select Account Type</Form.Label>
        <Select value={sector.account_type} required name="account_type" onChange={handleChange}>
            <option value="0">none</option>
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
            <option value="revenue">Revenue</option>
            <option value="expenditure">Expenditure</option>
        </Select>
        </Form.Group> */}

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Title"
          name='title'
          defaultValue={sector.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formBasicDesc" >
        <Form.Label>Select Modules</Form.Label>
        <Select2
          options={modulesOptions?.map(({ label, value }) => ({ value: value, label: label, name: "module" }))}
          onChange={handleChange}
          //  onChange={(e) => {
          //    setSector(e.value); 
          //  }}
          // defaultValue={sector.parent_id}
          required

        />
      </Form.Group> */}

<Form.Group className="mb-3" controlId="formBasicDesc">
  <Form.Label>Select Parent</Form.Label>
  {loading ? (
    <Select>
      <option value="">loading...</option>
    </Select>
  ) : (
    <Select
      onChange={(e) =>
        setSector((prev) => ({
          ...prev,
          parent_id: e?.target?.value,
        }))
      }
      value={sector?.parent_id} 
    >
      <option value="0">none</option>
      {sectorLists &&
        sectorLists?.map((sect, ind) => (
          <Fragment key={ind}>
            <option value={sect.id}>{sect.title}</option>
            {sect?.children_recursive?.length !== 0 && (
              <SubSectors sect={sect} dot="----" />
            )}
          </Fragment>
        ))}
    </Select>
  )}
</Form.Group>


      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Description</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Description"
          name='description'
          defaultValue={sector.description}
          onChange={handleChange}
        />
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
const DeleteComponent = ({ onSubmit, sectorId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState({
    sector_id: sectorId
  })

  let dataset = { ...sector, action: "deleteSector" }

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


export default function CustomizedTreeView({ accessPermissions }) {
  const classes = useStyles();
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { notify } = MyToast();
  const [nodes, setNodes] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [sectorId, setSectorId] = useState(null)

  //Create 
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  //create form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setValidated(false);
        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.account_type) {
            notify("error", `Account Type must not be empty`);
          }
          if (msg?.title) {
            notify("error", `${msg.title.Title}`);
          }
        }
        setLoading(false);
        setValidated(true);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }



  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleExit = () => setShowUpdateModal(false);
  const [pending, setPending] = useState(false);

  const handleOpen = (sector_id) => {
    setShowUpdateModal(true);
  }


  //Update form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setValidated(false);
        }

      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.account_type) {
            notify("error", `Account Type must not be empty`);
          }
          if (msg?.title) {
            notify("error", `${msg.title.Title}`);
          }
        }
        setPending(false);
        setValidated(true);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }

  //Delete  Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (sector_id) => {
    setShowDeleteModal(true);
  }

  //Delete  form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, formData)
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


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);


  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, {
      action: "getAllSectors",
    })
      .then((res) => {
        if (isSubscribed) {
          setSectorList(res?.data?.data);
          setAccountTypeList(Object.keys(res.data.data));

        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };

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
                  {sectorId === node.id && node?.children_recursive?.length < 1 && <DeleteIcon />}
                </a>
              </div>
            </div>
          }
        >
          {node.children_recursive.length > 0 && <TreeNodes nodes={node.children_recursive} />}
        </StyledTreeItem>
      </>
    );
  }

  function TreeNodes({ nodes }) {
    return (
      <>
        {nodes.map(node => (
          <TreeNode node={node} key={node?.id} />
        ))}
      </>
    );
  }


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'Account Chart', link: '/modules/accounts/sector' },
  ]

  // const AccountSHead = ['LIABILITIES', 'ASSETS', 'EXPENSES', 'INCOME'];
  const AccountSHead = ['LIABILITIES', 'ASSETS', 'EXPENSES', 'INCOME'];

  return (
    <>
      <HeadSection title="Account Chart" />

      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12 p-xs-2">
            <div className="card" style={{ overflowY: "scroll !important" }}>
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title   mb-0">Account Chart</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block="true"
                  >
                    Create AC. Sector
                  </Button>}
                </div>
              </div>

              {/* Create Modal Form */}
              <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Create Account Sector</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                </Modal.Body>
              </Modal>
              {/* End Create Modal Form */}

              {/* Update Modal Form */}
              <Modal dialogClassName="modal-lg" show={showUpdateModal} onHide={handleExit}>
                <Modal.Header closeButton>
                  <Modal.Title>Update Account Sector</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <EditForm onSubmit={updateForm} sectorId={sectorId} pending={pending} validated={validated} />
                </Modal.Body>
              </Modal>
              {/* End Update Modal Form */}

              {/* Delete Modal Form */}
              <Modal show={showDeleteModal} onHide={handleExitDelete}>
                <Modal.Header closeButton></Modal.Header>
                <DeleteComponent onSubmit={handleDelete} sectorId={sectorId} pending={pending} />
              </Modal>

              <div className="card-body  tree-view">
                <div className="row">

                  {accountTypeList?.map((keys, i) => (<Fragment key={i}>
                    
                    <div className="col-md-3">
                      <h3 className="card-title text-bold text-success"><u>
                        {AccountSHead[i]}</u></h3>
                      <TreeView
                        className={classes.root}
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<FaFolderOpen />}
                        defaultExpandIcon={<FaFolderOpen />}
                        defaultEndIcon={<FiFileText />}
                        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                      >
                        <TreeNodes nodes={sectorList[`${keys}`]} />

                      </TreeView>
                    </div>
                  </Fragment>))}

                  {/* <div className="col-md-3">
                    <h3 className="card-title text-bold text-success"><u>{AccountSHead[1]}</u></h3>
                    {sectorList?.asset && (
                      <TreeView
                        className={classes.root}
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<FaFolderOpen />}
                        defaultExpandIcon={<FaFolderOpen />}
                        defaultEndIcon={<FiFileText />}
                        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                      >
                        <TreeNodes nodes={sectorList.asset} />
                      </TreeView>
                    )}
                  </div>

                  <div className="col-md-3">
                    <h3 className="card-title text-bold text-success"><u>{AccountSHead[0]}</u></h3>
                    {sectorList?.liability && (
                      <TreeView
                        className={classes.root}
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<FaFolderOpen />}
                        defaultExpandIcon={<FaFolderOpen />}
                        defaultEndIcon={<FiFileText />}
                        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                      >
                        <TreeNodes nodes={sectorList.liability} />
                      </TreeView>
                    )}
                  </div>

                  <div className="col-md-3">
                    <h3 className="card-title text-bold text-success"><u>{AccountSHead[3]}</u></h3>
                    {sectorList?.revenue && (
                      <TreeView
                        className={classes.root}
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<FaFolderOpen />}
                        defaultExpandIcon={<FaFolderOpen />}
                        defaultEndIcon={<FiFileText />}
                        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                      >
                        <TreeNodes nodes={sectorList.revenue} />
                      </TreeView>
                    )}
                  </div>

                  <div className="col-md-3">
                    <h3 className="card-title text-bold text-success"><u>{AccountSHead[2]}</u></h3>
                    {sectorList?.expenditure && (
                      <TreeView
                        className={classes.root}
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<FaFolderOpen />}
                        defaultExpandIcon={<FaFolderOpen />}
                        defaultEndIcon={<FiFileText />}
                        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                      >
                        <TreeNodes nodes={sectorList.expenditure} />
                      </TreeView>
                    )}
                  </div> */}




                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
