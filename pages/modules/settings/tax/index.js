import MyToast from "@mdrakibul8001/toastify";
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Select2 from "../../../../components/elements/Select2";
import Axios from '../../../../utils/axios';
import { getSSRProps } from "../../../../utils/getSSRProps";
import { HeadSection } from "../../../../components";

//Create Component


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.tx_mngnt" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

const CreateTaxForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [tax, setTax] = useState({
    name: "",
    tax: 0,
    tax_type:'room_tax'
  })

  const [taxSubtaxStatus, setTaxSubtaxStatus] = useState();

  const handleChange = (e) => {
    setTax(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const [parentTaxList, setParentTaxList] = useState("");
  const tax_options = parentTaxList?.data;

  const [subtax_ids, setSubtax] = useState("");
  const [subtax_tax, setSubtaxTax] = useState([]);

  const handleTax = (e) => {
    setSubtaxTax(Array.isArray(e) ? e.map(y => y.tax) : [])
    setSubtax(Array.isArray(e) ? e.map(x => x.value) : []);
  }

  useEffect(() => {
    if (subtax_tax?.length) {

      let sum = 0
      for (let i = 0; i < subtax_tax?.length; i++) {
        sum += subtax_tax[i];
      }
      setTax(prev => ({
        ...prev, tax: sum
      }))
    }

  }, [subtax_tax?.length])

  useEffect(() => {
    const controller = new AbortController();
    async function getAllParentTax() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, { action: "getAllParentTax", })
        .then((res) => {
          setParentTaxList(res?.data);
        });
    }
    getAllParentTax()
    return () => controller.abort();

  }, [])

  let dataset = { ...tax, subtax_ids, action: "createTax" }

  return (

    <Form validated={validated}>
      <div className="row">


        <Form.Group controlId="formBasicEmail" className="col-6">
          <Form.Label>Set tax name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter tax Name"
            name='name'
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="col-6">
          <Form.Label>
            Tax Type <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="tax_type"
            onChange={handleChange}
            required
          >
            <option disabled value="">
              Select Title
            </option>
            <option value="room_tax">Room Tax</option>
            <option value="food_tax">Food Tax</option>
          </Form.Select>
        </Form.Group>
      </div>

      <Form.Group control="formBasicEmail" className="pt-2 mt-3 mb-3">

        <input type="radio" className="btn-check" name="size" id="size1" autoComplete="off" checked={taxSubtaxStatus?.size === "tax"} onClick={(e) => setTaxSubtaxStatus({ ...taxSubtaxStatus, size: "tax" })} />
        <label className="btn btn-outline-primary rounded-pill font-weight-medium fs-3" htmlFor="size1" >Tax</label>

        <input type="radio" className="btn-check" name="options" id="size2" autoComplete="off" checked={taxSubtaxStatus?.size === "Group_tax"} onClick={(e) => setTaxSubtaxStatus({ ...taxSubtaxStatus, size: "Group_tax" })} />
        <label className="btn btn-outline-info rounded-pill font-weight-medium fs-3 ms-2" htmlFor="size2" >Group Tax</label>

      </Form.Group>

      <div className={`${(taxSubtaxStatus?.size == 'Group_tax') ? '' : 'd-none'}`}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Select Subtax</Form.Label>
          <Select2
            options={tax_options?.map(({ id, name, tax }) => ({ value: id, label: name, tax: tax }))}
            onChange={handleTax}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            closeMenuOnSelect={true}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Tax Percentage</Form.Label>
          <Form.Control
            type="number"
            name='tax'
            required
            value={tax.tax}
            readOnly={true}
          />
        </Form.Group>

      </div>

      <div className={`${(taxSubtaxStatus?.size == 'tax') ? '' : 'd-none'}`}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Tax Percentage</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter tax Amount"
            name='tax'
            onChange={handleChange}
            required
            value={tax.tax}
          />
        </Form.Group>
      </div>

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={() => onSubmit(dataset)} block>
        Create
      </Button>
    </Form>
  );
};


//Update component
const EditTaxForm = ({ onSubmit, taxId, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);

  const [tax, setTax] = useState({})
  const handleChange = (e) => {
    setTax(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const [taxSubtaxStatus, setTaxSubtaxStatus] = useState();

  const [parentTaxList, setParentTaxList] = useState("");
  const tax_options = parentTaxList?.data;

  const [subtaxObj, setSubtaxObj] = useState({});
  const [subtax_ids, setSubtax] = useState("");
  const [subtax_tax, setSubtaxTax] = useState([]);


  const fetchTaxData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, { action: "getTaxInfo", tax_id: taxId })
      .then((res) => {
        if (isSubscribed) {
          setTax(prev => ({
            ...prev,
            name: res.data.data.name,
            tax: res.data.data.tax,
            tax_type: res.data.data.tax_type,
          }));
          setSubtaxObj(res.data.data.tax_subtaxes)
          setSubtax(res.data.data?.tax_subtaxes?.map(tax => tax.id))
          setSubtaxTax(res.data.data?.tax_subtaxes?.map(taxx => taxx.tax))
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [taxId]);

  useEffect(() => {
    fetchTaxData();
  }, [fetchTaxData])

  const handleTax = (e) => {
    setSubtaxTax(Array.isArray(e) ? e.map(y => y.tax) : [])
    setSubtax(Array.isArray(e) ? e.map(x => x.value) : []);
  }

  useEffect(() => {
    if (subtax_tax?.length) {

      let sum = 0
      for (let i = 0; i < subtax_tax?.length; i++) {
        sum += subtax_tax[i];
      }
      setTax(prev => ({
        ...prev, tax: sum
      }))
    }

  }, [subtax_tax?.length])

  useEffect(() => {
    const controller = new AbortController();
    async function getAllParentTax() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, { action: "getAllParentTax", })
        .then((res) => {
          setParentTaxList(res?.data);
        });
    }
    getAllParentTax()
    return () => controller.abort();

  }, [])


  let dataset = { ...tax, subtax_ids, action: "editTax" }

  return (

    <Form >

      <div className="row">

      <Form.Group controlId="formBasicEmail" className="col-6 mb-3">
        <Form.Label>Set tax name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Tax Name"
          name='name'
          defaultValue={tax.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="col-6 mb-3">
          <Form.Label>
            Tax Type <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="tax_type"
            value={tax.tax_type}
            onChange={handleChange}
            required
          >
            <option disabled value="">
              Select Title
            </option>
            <option value="room_tax">Room Tax</option>
            <option value="food_tax">Food Tax</option>
          </Form.Select>
        </Form.Group>
      </div>

      <div className="row">

      <Form.Group controlId="formBasicName" className="mb-3 col-6">
        <Form.Label>Select Subtax</Form.Label>

        {
          !loading && subtaxObj &&
          <Select2
            isMulti
            options={tax_options?.map(({ id, name, tax }) => ({ value: id, label: name, tax: tax }))}
            defaultValue={subtaxObj?.map(({ id, name, tax }) => ({ value: id, label: name, tax: tax }))}
            onChange={handleTax}
            closeMenuOnSelect={true}
          />
        }
        {
          loading && subtaxObj &&
          <Select2
            isMulti
            options={tax_options?.map(({ id, name, tax }) => ({ value: id, label: name, tax: tax }))}
            onChange={handleTax}

          />
        }

      </Form.Group>

      <Form.Group controlId="formBasicEmail" className="mb-3 col-6">
        <Form.Label>Tax Percentage</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Tax Amount"
          name='tax'
          value={tax.tax}
          onChange={handleChange}
          required
        />
      </Form.Group>
      </div>

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
const DeleteTaxComponent = ({ onSubmit, taxId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [tax, setTax] = useState({
    tax_id: taxId
  })

  let dataset = { ...tax, action: "deleteTax" }

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

  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create tax form
  const submitTaxForm = async (items) => {
    let isSubscribed = true;
    // setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          // setLoading(false);
          setValidated(false);
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
          if (msg?.tax) {
            notify("error", `${msg.tax.Tax}`);
          }
          if (msg?.tax_type) {
            notify("error", `${msg.tax.tax_type}`);
          }
        }
        setLoading(false);
        setValidated(true);
      });

    fetchItemList();
    fetchGroupItemList();

    return () => isSubscribed = false;
  }

  //Update Tax Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [taxId, setTaxId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);

  const handleOpen = (tax_id) => {
    setShowUpdateModal(true);
    setTaxId(tax_id);
  }

  //Update floor form
  const updateTaxForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, formData)
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
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.tax) {
            notify("error", `${msg.tax.Tax}`);
          }
          if (msg?.tax_type) {
            notify("error", `${msg.tax.tax_type}`);
          }
        }
        setPending(false);
        setValidated(true);
      });

    fetchItemList();
    fetchGroupItemList();

    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExitDelete = () => setShowDeleteModal(false);

  const handleOpenDelete = (tax_id) => {
    setShowDeleteModal(true);
    setTaxId(tax_id);
  }

  //Delete Tax form
  const handleTaxDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, formData)
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
    fetchGroupItemList();

    return () => isSubscribed = false;
  }

  //tax data list
  const [taxList, setTaxList] = useState([]);
  const [groupTaxList, setGroupTaxList] = useState([]);
  const [groupSubTaxList, setGroupSubTaxList] = useState([]);

  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [groupFilteredData, setGroupFilteredData] = useState([]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
      fetchGroupItemList();
    });
    return () => clearTimeout(timeout);
  }, []);


  //Fetch List Data for datatable
  const data = taxList?.data;
  const groupData = groupTaxList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, {
      action: "getAllTax",
    })
      .then((res) => {
        if (isSubscribed) {
          setTaxList(res?.data);
          setFilteredData(res.data?.data);

        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };

  const fetchGroupItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/tax`, {
      action: "getAllGroupTax",
    })
      .then((res) => {
        if (isSubscribed) {
          setGroupTaxList(res?.data);
          setGroupFilteredData(res.data?.data);
          setGroupSubTaxList(res.data?.data);
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

    const groupResult = groupData?.filter((items) => {
      return items.name.toLowerCase().match(groupSearch.toLocaleLowerCase())
    });

    setFilteredData(result);
    setGroupFilteredData(groupResult);
    return () => controller.abort();
  }, [search, groupSearch])



  const actionButton = (taxId) => {
    return <>
      <ul className="action ">

        {accessPermissions.createAndUpdate && <li>
          <Link href="#">
            <a onClick={() => handleOpen(taxId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.delete && <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(taxId)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }

  const groupActionButton = (taxId) => {
    return <>
      <ul className="action ">

        {accessPermissions.createAndUpdate && <li>
          <Link href="#">
            <a onClick={() => handleOpen(taxId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.delete && <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(taxId)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }

  const testSubtax = (subtax) => {
    return <>
      <table
        id="multi_col_order"
        className="table table-striped table-bordered display"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>SL</th>
            <th>Name</th>
            <th>Tax Amount</th>
          </tr>
        </thead>
        <tbody>
          {subtax?.map((item, index) => (
            <>
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.tax}</td>
              </tr>
            </>
          ))}

        </tbody>
      </table>
    </>
  }


  const columns = [

    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Tax',
      selector: row => row.tax,
      sortable: true,
    },
    // {
    //   name: 'Tax Type',
    //   selector: row => row.tax_type,
    //   sortable: true,
    // },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: "120px",

    },

  ];

  const groupColumns = [

    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Tax',
      selector: row => row.tax,
      sortable: true,
    },
    {
      name: 'Sub Taxes',
      selector: row => testSubtax(row.tax_subtaxes),
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => groupActionButton(row.id),
      width: "100px",                       // added line here

    },

  ];


  return (
    <div className="container-fluid">
            <HeadSection title="Tax Settings" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow m-xs-2">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Tax</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {accessPermissions.createAndUpdate && <Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Create Tax
                </Button>}

                {/* {/ Create Modal Form /} */}
                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Tax</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateTaxForm onSubmit={submitTaxForm} loading={loading} validated={validated} />
                  </Modal.Body>
                </Modal>
                {/* {/ End Create Modal Form /} */}

                {/* {/ Update Modal Form /} */}
                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Promo Offer</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditTaxForm onSubmit={updateTaxForm} taxId={taxId} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* {/ End Update Modal Form /} */}
                {/* {/ Delete Modal Form /} */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteTaxComponent onSubmit={handleTaxDelete} taxId={taxId} pending={pending} />
                </Modal>

              </div>
            </div>


            <div className="card-body">
              <div className="">

                <DataTable
                  columns={columns}
                  data={filteredData}
                  // pagination  
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

      {/* Group Tax Table */}

      <div className="row">
        <div className="col-12">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Group Tax</h4>
              </div>
              <div className="ms-auto flex-shrink-0">

                {/* {/ Update Modal Form /} */}
                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Tax</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditTaxForm onSubmit={updateTaxForm} taxId={taxId} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* {/ End Update Modal Form /} */}
                {/* {/ Delete Modal Form /} */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteTaxComponent onSubmit={handleTaxDelete} taxId={taxId} pending={pending} />
                </Modal>

              </div>
            </div>


            <div className="card-body">
              <div className="">

                <DataTable
                  columns={groupColumns}
                  data={groupFilteredData}
                  // pagination  
                  highlightOnHover
                  subHeader
                  subHeaderComponent={
                    <input
                      type="text"
                      placeholder="search..."
                      className="w-25 form-control"
                      value={groupSearch}
                      onChange={(e) => setGroupSearch(e.target.value)}
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