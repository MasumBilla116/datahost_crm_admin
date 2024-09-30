import MyToast from "@mdrakibul8001/toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DeleteIcon, EditIcon, HeadSection, ViewIcon } from "../../../components";
import ActiveCurrency from "../../../components/ActiveCurrency";
import FilterDatatable from "../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../components/Filter/ServiceFilter";
import Axios from "../../../utils/axios";
import { getSSRProps } from "../../../utils/getSSRProps";
export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.splr.mngsplr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};



const DeleteTaxComponent = ({ onSubmit, id, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  let dataset = { id, action: "delete" }

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
}

const index = ({accessPermissions}) => {
  const { notify } = MyToast();
  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [rows, setRows] = React.useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const data = supplierList?.data;


  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const [dateFilter, setDateFilter] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPageShow, setPerPageShow] = useState(15)
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
    setFilterValue(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      paginate: true,
      filter: true
    }));
    setSearch("");
  };



  /**** Table  */





  const getSupplierList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getAllSupplierList", filterValue: filterValue })
        .then((res) => {
          if (isSubscribed) {
            setFilteredData(prev => ({
              ...prev,
              total: res.data?.data?.total || prev.total,
              paginate: true,
              [currentPage]: res?.data?.data[currentPage]
            }));
          }
        });
      setFilterValue(prev => ({
        ...prev,
        filter: false,
        search: null
      }));
    }
    setTblLoader(false);
    // }, 800)
    return () => isSubscribed = false;
  };

  /**Getting Supplier List */
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getSupplierList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);


    //Delete Tower Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const[supplierId,setSupplierId]=useState(null);
    const [pending, setPending] = useState(false);
    const handleExitDelete = () => setShowDeleteModal(false);
  
    const handleOpenDelete = (id) => {
      setShowDeleteModal(true);
      setSupplierId(id);
    }



    const handleTaxDelete = async (formData) => {
      let isSubscribed = true;
      setPending(true);
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`, formData)
        .then((res) => {
          if (isSubscribed) {
            notify("success", "successfully deleted!");
            handleExitDelete();
            setPending(false);
            setFilterValue((prev)=>({
              ...prev,
              filter: true,
            }));
          }
  
        })
        .catch((e) => {
          console.log('error delete !')
          setPending(false);
        });
  
      // fetchItemList();
      getSupplierList();
  
      return () => isSubscribed = false;
    }

  // const handleDelete = async (id) => {
  //   let body = {};

  //   body = {
  //     action: "delete",
  //     id: id,
  //   };
  //   await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`,body);
  // };

  const actionButton = (id) => {
    return (
      <>
        <ul className="action">
          {accessPermissions.listAndDetails && <li>
            <Link href={`/modules/supplier/details/${id}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li>}
         {accessPermissions.createAndUpdate && <li>
            <Link href={`/modules/supplier/update/${id}`}>
              <a>
                <EditIcon />
              </a>
            </Link>
          </li>}

         {accessPermissions.delete && <li>
            <Link href="#">
              <a onClick={() => handleOpenDelete(id)}>
                <DeleteIcon />
              </a>
            </Link>
          </li>}
        </ul>
      </>
    );
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.status == 0,
      style: {
        backgroundColor: "rgba(243, 59, 42, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },

  ];

  const columns = [
    {
      name: "Supplier Name",
      selector: (row) => {return <span className="text-capitalize">{row.name}</span>},
      sortable: true,
    },
    {
      name: "Supplier Balance",
      selector: (row) => <> <ActiveCurrency/> { row.balance }</>,
      sortable: true,
    },
    {
      name: "Total Invoice",
      selector: (row) => row.total_invoice,
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contact_number,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => actionButton(row.id),
    },
  ];




  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Supplier', link: '/modules/purchase/supplier' }
  ];


  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];
  return (
    <>
      <HeadSection title="Supplier List" />
      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12  p-xs-2 ">
            <div className="card">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>

                  <h4 className="card-title mb-0">Supplier List</h4>
                </div>

                <div className="ms-auto flex-shrink-0">
                  <Link href="/modules/supplier/create">
                    <a
                      className="shadow rounded btn btn-primary btn-sm"

                    >
                      Add New Supplier
                    </a>
                  </Link>

                </div>
              </div>
              <div className="card-body">
               

                  <ServiceFilter
                    statusList={dynamicStatusList}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    handleChangeFilter={handleChangeFilter}
                    dateFilter={false}
                    placeholderText="Name / Phone /Email"

                  />

                  <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteTaxComponent onSubmit={handleTaxDelete} id={supplierId} pending={pending} />
                </Modal>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
