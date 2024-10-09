import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { HeadSection } from "../../../components";
import FilterDatatable from "../../../components/Filter/FilterDatatable";
import PDFAndPrintBtn from "../../../components/Filter/PDFAndPrintBtn";
import ServiceFilter from "../../../components/Filter/ServiceFilter";
import toast from "../../../components/Toast/index";
import DeleteIcon from "../../../components/elements/DeleteIcon";
import EditIcon from "../../../components/elements/EditIcon";
import Select from "../../../components/elements/Select";
import Select2 from "../../../components/elements/Select2";
import ViewIcon from "../../../components/elements/ViewIcon";
import ItemSubCat from "../../../components/inventory_category/ItemSubCat";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";
import getStatus from "../../../utils/getStatus";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.invtr.itms",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

//Create Component
const CreateForm = ({ onSubmit, loading }) => {
  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [item, setItem] = useState({
    name: "",
    supplier_id: "",
    item_type: "",
    unit_type: "",
    status: 0,
  });

  const [categories, setCategoryList] = useState("");
  const [category_id, setCategoryId] = useState();
  const [catLoading, setCatLoading] = useState(false);

  const [pending, setPending] = useState(false);

  const [allUnitTypes, setAllUnitTypes] = useState([]);
  const [allItemTypes, setAllItemTypes] = useState([]);

  const [data, setData] = useState();

  const handleChange = (e) => {
    setItem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    let isSubscribed = true;
    const AllParentCat = async () => {
      setCatLoading(true);
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,
          { action: "getSubCategories" }
        )
        .then((res) => {
          if (isSubscribed) {
            setCategoryList(res.data.data);
            setCatLoading(false);
          }
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };

    AllParentCat();
    getAllUnitTypes();
    getAllItemTypes();
    getSuppliers();
    return () => (isSubscribed = false);
  }, []);

  // @@ fetch default data

  const [supplier, setSupplier] = useState([]);
  const getSuppliers = async () => {
    let body = {};
    body = {
      action: "getAllSupplier",
    };
    if (supplier?.length == 0) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
          body
        )
        .then((result) => {
          setSupplier(result.data.data);
        });
    }
  };

  const getAllUnitTypes = async () => {
    let isSubscribed = true;
    if (allUnitTypes?.length === 0) {
      setPending(true);
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/unitType`,
          { action: "getAllUnitTypes", status: 1 }
        )
        .then((res) => {
          if (isSubscribed) {
            setAllUnitTypes(res.data.data);
          }
        });
    }
    return () => (isSubscribed = false);
  };

  const getAllItemTypes = async () => {
    let isSubscribed = true;
    if (allItemTypes?.length === 0) {
      setPending(true);
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/itemType`,
          { action: "getAllItemTypes", status: 1 }
        )
        .then((res) => {
          if (isSubscribed) {
            setAllItemTypes(res.data.data);
          }
        });
    }
    return () => (isSubscribed = false);
  };

  const handleChangeSwitch = (e) => {
    const { name, type, checked, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  let dataset = { ...item, category_id, action: "createItem" };

  return (
    <Form>
      <div className="row ">
        <div className="col-md-12">
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>
              Item Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Item Name"
              name="name"
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="col-md-12 mb-3">
          <Form.Group>
            <Form.Label>Supplier:</Form.Label> 
                <Select2
                  maxMenuHeight={140}
                  className=""
                  options={supplier?.map(({ id, name, contact_number }) => ({
                    value: id,
                    label: `${name} - ${contact_number}`,
                    contact_number: contact_number,
                  }))}
                  onChange={(e) => {
                    setItem(prev=>({
                      ...prev,
                      supplier_id: e.value
                    }))
                  }}
                /> 
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>
              Select Category<span className="text-danger">*</span>
            </Form.Label>
            {catLoading ? (
              <Select>
                <option value="">loading...</option>
              </Select>
            ) : (
              <Select
                value={category_id}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories &&
                  categories?.map((cat, ind) => (
                    <>
                      {cat?.children_recursive?.length != 0 ? (
                        <option disabled value={cat.id}>
                          {cat.name}
                        </option>
                      ) : (
                        <option value={cat.id}>{cat.name}</option>
                      )}

                      {cat?.children_recursive?.length != 0 && (
                        <ItemSubCat cat={cat} dot="----" />
                      )}
                    </>
                  ))}
              </Select>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>
              Unit Type<span className="text-danger">*</span>
            </Form.Label>
            <Select name="unit_type" onChange={handleChange}>
              <option value="">Select Unit Type</option>

              {allUnitTypes?.map((unit) => {
                return <option value={unit?.id}>{unit?.unit_type_name}</option>;
              })}
            </Select>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>
              Item Type<span className="text-danger">*</span>
            </Form.Label>
            <Select name="item_type" onChange={handleChange}>
              <option value="">Select Item Type</option>

              {allItemTypes?.map((item) => {
                return <option value={item?.id}>{item?.item_type_name}</option>;
              })}
            </Select>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group
            controlId="itemTypeStatus"
            className="ml-2 mt-4 mb-2"
            style={{
              border: "1px solid #8080804a",
              padding: "10px 29px",
              borderRadius: "5px",
            }}
          >
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Enabled"
              name="status"
              onChange={handleChangeSwitch}
            />
          </Form.Group>
        </div>
      </div>

      <Button
        variant="primary"
        className="shadow rounded mb-3"
        disabled={loading || catLoading}
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(dataset)}
        block
      >
        Create
      </Button>
    </Form>
  );
};

//Update component
const EditForm = ({ onSubmit, itemData, pending }) => {
  const { http } = Axios();
 

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    item_id: itemData?.item_id,
    supplier_id: itemData?.supplier_id,
    name: itemData?.item_name,
    item_type_id: itemData?.item_type_id,
    unit_type_id: itemData?.unit_type_id,
    category_id: itemData?.category_id,
    status: itemData?.status,
  });

  console.log('item: ',item)

  const [categories, setCategoryList] = useState("");
  const [category_id, setCategoryId] = useState();
  const [catLoading, setCatLoading] = useState(false);

  // const [pending, setPending] = useState(false)

  const [allUnitTypes, setAllUnitTypes] = useState([]);
  const [allItemTypes, setAllItemTypes] = useState([]);

  const [data, setData] = useState();

  const handleChange = (e) => {
    setItem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    let isSubscribed = true;
    const AllParentCat = async () => {
      setCatLoading(true);
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,
          { action: "getSubCategories" }
        )
        .then((res) => {
          if (isSubscribed) {
            setCategoryList(res.data.data);
            setCatLoading(false);
          }
        })
        .catch((err) => {
          console.log("Something went wrong !");
        });
    };

    AllParentCat();

    getAllUnitTypes();
    getAllItemTypes();
    getSuppliers();
    return () => (isSubscribed = false);
  }, []);

  // @@ fetch all default data
  const [supplier, setSupplier] = useState([]);
  const getSuppliers = async () => {
    let body = {};
    body = {
      action: "getAllSupplier",
    };
    if (supplier?.length == 0) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,
          body
        )
        .then((result) => {
          setSupplier(result.data.data);
        });
    }
  };

  const getAllUnitTypes = async () => {
    let isSubscribed = true;
    if (allUnitTypes?.length === 0) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/unitType`,
          { action: "getAllUnitTypes", status: 1 }
        )
        .then((res) => {
          if (isSubscribed) {
            setAllUnitTypes(res.data.data);
          }
        });
    }
    return () => (isSubscribed = false);
  };

  const getAllItemTypes = async () => {
    let isSubscribed = true;
    if (allItemTypes?.length === 0) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/itemType`,
          { action: "getAllItemTypes", status: 1 }
        )
        .then((res) => {
          if (isSubscribed) {
            setAllItemTypes(res.data.data);
          }
        });
    }
    return () => (isSubscribed = false);
  };

  const handleChangeSwitch = (e) => {
    const { name, type, checked, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  let dataset = { ...item, action: "editItem" };

  return (
    <Form>
      <div className="row ">
        <div className="col-md-12">
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>
              Item Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Item Name"
              name="name"
              defaultValue={item?.name}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="col-md-12 mb-3"> 
      <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>
              Supplier:<span className="text-danger">*</span>
            </Form.Label>
            <Select
              value={item?.supplier_id}
              name="supplier_id"
              onChange={(e=>{
                setItem(prev=>({
                  ...prev,
                  supplier_id: e.target.value
                }))
              })}
            >
              <option value="">Supplier</option>
              {supplier?.map((sup) => {
                return <option  key={sup?.id+85} value={sup?.id}>{sup?.name} ({sup?.contact_number})</option>;
              })}
            </Select>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>
              Select Category<span className="text-danger">*</span>
            </Form.Label>
            {catLoading ? (
              <Select>
                <option value="">loading...</option>
              </Select>
            ) : (
              <Select
                value={item?.category_id}
                name="category_id"
                onChange={(e) =>
                  setItem((prev) => ({ ...prev, category_id: e.target.value }))
                }
              >
                <option value="">Select Category</option>
                {categories &&
                  categories?.map((cat, ind) => (
                    <>
                      {cat?.children_recursive?.length != 0 ? (
                        <option  key={cat?.id+21} disabled value={cat.id}>
                          {cat.name}
                        </option>
                      ) : (
                        <option value={cat.id}>{cat.name}</option>
                      )}

                      {cat?.children_recursive?.length != 0 && (
                        <ItemSubCat  key={cat?.id+22} cat={cat} dot="----" />
                      )}
                    </>
                  ))}
              </Select>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>
              Unit Type<span className="text-danger">*</span>
            </Form.Label>
            <Select
              value={item?.unit_type_id}
              name="unit_type_id"
              onChange={handleChange}
            >
              <option value="">Select Unit Type</option>

              {allUnitTypes?.map((unit) => {
                return <option  key={unit?.id+3} value={unit?.id}>{unit?.unit_type_name}</option>;
              })}
            </Select>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>
              Item Type<span className="text-danger">*</span>
            </Form.Label>
            <Select
              value={item?.item_type_id}
              name="item_type_id"
              onChange={handleChange}
            >
              <option value="">Select Item Type</option>

              {allItemTypes?.map((itemRow) => {
                return (
                  <option  key={itemRow?.id+4} value={itemRow?.id}>{itemRow?.item_type_name}</option>
                );
              })}
            </Select>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group
            controlId="itemTypeStatus"
            className="ml-2 mt-4 mb-2"
            style={{
              border: "1px solid #8080804a",
              padding: "10px 29px",
              borderRadius: "5px",
            }}
          >
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Enabled"
              name="status"
              checked={item?.status}
              onChange={handleChangeSwitch}
            />
          </Form.Group>
        </div>
      </div>

      <Button
        variant="primary"
        className="shadow rounded mb-3"
        style={{ marginTop: "5px" }}
        type="button"
        onClick={() => onSubmit(dataset)}
        block
      >
        Create
      </Button>
    </Form>
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, itemId, pending }) => {
  console.log("itemId: ", itemId);
  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    item_id: itemId,
  });

  let dataset = { ...item, action: "deleteItem" };

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => onSubmit(dataset)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({ accessPermissions }) {
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm = async (items) => {
    // console.log("items: ",items)
    // return;


    let isSubscribed = true;
    setLoading(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`,
        items
      )
      .then((res) => { 
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.category_id) {
            notify("error", `${msg.category_id.Category_id}`);
          }
          if (msg?.unit_type) {
            notify("error", `${msg.unit_type.Unit_type}`);
          }
          if (msg?.item_type) {
            notify("error", `${msg.item_type.Item_type}`);
          }
        }
        setLoading(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [itemUpdateData, setItemUpdateData] = useState(null);

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (item) => {
    setShowUpdateModal(true);
    setItemUpdateData(item);
  };

  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`,
        formData
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof msg == "string") {
          notify("error", `${msg}`);
        } else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }
          if (msg?.category_id) {
            notify("error", `${msg.category_id.Category_id}`);
          }
          if (msg?.unit_cost) {
            notify("error", `${msg.unit_cost.Unit_cost}`);
          }
          if (msg?.unit_type) {
            notify("error", `${msg.unit_type.Unit_type}`);
          }
          if (msg?.item_type) {
            notify("error", `${msg.item_type.Item_type}`);
          }
          if (msg?.supplier_id) {
            notify("error", `${msg.item_type.supplier_id}`);
          }
        }
        setPending(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [itemId, setItemId] = useState(null);

  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (row) => { 
    setItemId(row?.item_id);
    setShowDeleteModal(true);
  };

  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items`, {
        ...formData,
        isStatus: status,
      })
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
          setFilterValue((prev) => ({
            ...prev,
            filter: true,
          }));
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Tower Floor Rooms data list
  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);

  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [dateFilter, setDateFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageShow, setPerPageShow] = useState(15);
  const [tblLoader, setTblLoader] = useState(true);
  const [filterValue, setFilterValue] = useState({
    status: "all",
    yearMonth: `${y}-${m}`,
    search: null,
    filter: false,
    paginate: true,
  });

  // for data table chagne
  const handleChangeFilter = (e) => {
    setFilterValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      paginate: true,
      filter: true,
    }));
    setSearch("");
  };

  /**** Table  */

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  //Fetch List Data for datatable
  const data = itemList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http
        .post(
          `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/items?page=${currentPage}&perPageShow=${perPageShow}`,
          { action: "getAllItemList", filterValue: filterValue }
        )
        .then((res) => {
          if (isSubscribed) {
            // setItemList(res?.data);
            // setFilteredData(res.data?.data);
            setFilteredData((prev) => ({
              ...prev,
              total: res.data?.data?.total || prev.total,
              paginate: true,
              [currentPage]: res?.data?.data[currentPage],
            }));
          }
        });
      setFilterValue((prev) => ({
        ...prev,
        filter: false,
        search: null,
      }));
    }
    setTblLoader(false);
    // }, 800)
    return () => (isSubscribed = false);
  };

  const actionButton = (row) => {
    return (
      <>
        <ul className="action ">
          {accessPermissions.listAndDetails && (
            <li>
              <Link href={`/modules/inventory/details/${row.item_id}`}>
                <a>
                  <ViewIcon />
                </a>
              </Link>
            </li>
          )}
          {accessPermissions.createAndUpdate && (
            <li>
              <Link href="#">
                <a onClick={() => handleOpen(row)}>
                  <EditIcon />
                </a>
              </Link>
            </li>
          )}
          {accessPermissions.delete && (
            <li>
              <Link href="#">
                <a onClick={() => handleOpenDelete(row)}>
                  <DeleteIcon />
                </a>
              </Link>
            </li>
          )}
        </ul>
      </>
    );
  };

  const columns = [
    {
      name: "Item Name",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "Supplier Name",
      selector: (row) => row.supplier_name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Unit Type",
      selector: (row) => row.unit_type_name,
      sortable: true,
    },
    {
      name: "Item Type",
      selector: (row) => row.item_type_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => getStatus(row.status),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => actionButton(row),
      sortable: true,
    },
  ];

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Items", link: "/modules/inventory/items" },
  ];

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },
  ];

  return (
    <>
      <HeadSection title="All Items" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2 ">
            <div className="card shadow">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Items</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && (
                    <Button
                      className="shadow rounded btn-sm"
                      variant="primary"
                      type="button"
                      onClick={handleShow}
                      block
                    >
                      Create Item
                    </Button>
                  )}

                  {/* Create Modal Form */}
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <CreateForm onSubmit={submitForm} loading={loading} />
                    </Modal.Body>
                  </Modal>
                  {/* End Create Modal Form */}

                  {/* Update Modal Form */}
                  <Modal show={showUpdateModal} onHide={handleExit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm
                        onSubmit={updateForm}
                        itemData={itemUpdateData}
                        pending={pending}
                      />
                    </Modal.Body>
                  </Modal>
                  {/* End Update Modal Form */}
                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent
                      onSubmit={handleDelete}
                      itemId={itemId}
                      pending={pending}
                    />
                  </Modal>
                </div>
              </div>

              <div className="card-body">
                <div className="position-relative">
                  {accessPermissions.download && (
                    <PDFAndPrintBtn
                      currentPage={currentPage}
                      rowsPerPage={perPageShow}
                      data={filteredData[currentPage]}
                      columns={columns}
                      position={true}
                    />
                  )}

                  <ServiceFilter
                    statusList={dynamicStatusList}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    handleChangeFilter={handleChangeFilter}
                    dateFilter={false}
                  />
                  <FilterDatatable
                    tblLoader={tblLoader}
                    columns={columns}
                    setFilterValue={setFilterValue}
                    filteredData={filteredData}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    perPage={perPageShow}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
