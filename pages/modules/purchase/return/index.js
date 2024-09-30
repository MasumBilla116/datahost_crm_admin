import * as moment from 'moment';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { HeadSection, ViewIcon } from '../../../../components';
import toast from "../../../../components/Toast/index";
import Axios from '../../../../utils/axios';
import { useRouter } from 'next/router';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { getSSRProps } from '../../../../utils/getSSRProps';



export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.prchs.prchs_rtn" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Delete return invoice component
const DeleteComponent = ({ onSubmit, supplierId, pending, setShowDeleteModal }) => {

  const { http } = Axios();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchSupplierInfo = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/supplier`, { action: "getSupplierDetailsByID", id: supplierId })
      .then((res) => {
        if (isSubscribed) {
          setName(res?.data?.data[0].supplier_name)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [supplierId]);

  useEffect(() => {
    fetchSupplierInfo();
  }, [fetchSupplierInfo])

  let dataSet = { id: supplierId, action: "deleteInvoice" }
  return (
    <>
      <Modal.Body>
        <Modal.Title className='fs-5'>Are you sure to Cancel {name}'s Invoice ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="success" disabled={pending || loading} onClick={() => setShowDeleteModal(false)}>
          Discard
        </Button>
        <Button variant="danger" disabled={pending || loading} onClick={() => onSubmit(dataSet)}>
          Confirm
        </Button>
      </Modal.Footer>
    </>
  );
};


/** View Data List Part Supplier Return Invoice */

export default function ListView({accessPermissions}) {

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);


  //Update Modal form
  const [pending, setPending] = useState(false);
  const [supplierId, setSupllierId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);


  const handleOpenDelete = (supplier_Id) => {
    setShowDeleteModal(true);
    setSupllierId(supplier_Id);
  }


  //Delete Return invoice
  const handleDelete = async (formData) => {

    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, formData)
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

  //Return invoice data list
  const [itemList, setItemList] = useState([]);
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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/purchase/invoice`, {
      action: "getAllSupplierReturnInvoice",
    })
      .then((res) => {
        if (isSubscribed) {
          setItemList(res?.data);
          setFilteredData(res?.data?.data);
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
      if (item) {
        return item?.name?.toLowerCase().match(search.toLocaleLowerCase());
      }
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);



  const [isOpen, setIsopen] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState("")

  const actionButton = (invoice_Id) => {
    return <>
      <ul className="action">
       { accessPermissions.listAndDetails &&<li>
          <Link href={`/modules/purchase/return/details/${invoice_Id}`}>
            <a >
              <ViewIcon />
            </a>
          </Link>
        </li>}
      </ul>
    </>
  }

  const columns = [

    {
      name: <span className='fw-bold' >Invoice Number</span>,
      selector: row => row.local_invoice,
      width: "20%",
      sortable: true,
    },
    {
      name: <span className='fw-bold' >Date</span>,
      selector: row => moment(row.created_at).format('DD/MM/YYYY'),
      width: "20%",
      sortable: true,
    },
    {
      name: <span className='fw-bold' >Returned Items</span>,
      selector: row => row.total_item,
      width: "20%",
      sortable: true,
    },
    {
      name: <span className='fw-bold ' >Returned Quantity</span>,
      selector: row => row.total_returned_qty,
      width: "20%",
      sortable: true,
    },
    {
      name: <span className='fw-bold' >Action</span>,
      selector: row => actionButton(row.id),
      width: "20%",
    },
  ];


    //breadcrumbs
    const breadcrumbs = [
      { text: 'Dashboard', link: '/dashboard' },
      { text: 'Return Invoice', link: '/modules/purchase/return' }
    ];
  return (
    <>
      <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Purchase Return" />
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow">

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">Supplier Invoice</h4>
                </div>
                <div className="ms-auto flex-shrink-0">

                  {/* Delete Modal Form */}
                  <Modal show={showDeleteModal} onHide={handleExitDelete}>

                    <Modal.Header closeButton></Modal.Header>
                    <DeleteComponent onSubmit={handleDelete} setShowDeleteModal={setShowDeleteModal} supplierId={supplierId} pending={pending} />

                  </Modal>
                  {/* End Delete Modal Form */}

                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive custom-data-table">
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    subHeader
                    subHeaderComponent={
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                      <input
                        type="text"
                        placeholder="search..."
                        className="w-25 form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      </div>
                    }
                    striped
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
