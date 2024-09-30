import { createTheme } from '@mui/material/styles';
import * as moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import FilterDatatable from '../../../../components/Filter/FilterDatatable';
import PDFAndPrintBtn from '../../../../components/Filter/PDFAndPrintBtn';
import ServiceFilter from '../../../../components/Filter/ServiceFilter';
import toast from "../../../../components/Toast/index";
import EditIcon from '../../../../components/elements/EditIcon';
import ViewIcon from '../../../../components/elements/ViewIcon';
import Axios from '../../../../utils/axios';
import { getSSRProps } from '../../../../utils/getSSRProps';


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.acnt.mng_vscr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Delete component
const DeleteComponent = ({ onSubmit, invoiceId, pending }) => {

  let myFormData = new FormData();

  myFormData.append('action', "deleteInvoice");
  myFormData.append('invoice_id', invoiceId);

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to Cancel </Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(myFormData)}>
          Confirm Cancel
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

  //start date and end date
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const [start_date, set_start_date] = useState(null);
  const [end_date, set_end_date] = useState(null);
  //  start_date,end_date





  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (voucherId) => {
    setShowDeleteModal(true);
    setInvoiceId(voucherId);
  }

  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`, formData)
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

  //Voucher data list
  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);

  const [pending, setPending] = useState(false);
  const [invoice_id, setInvoiceId] = useState('');



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





  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  //Fetch List Data for datatable
  const data = itemList?.data;

  // const fetchItemList = async () => {

  //   let isSubscribed = true;
  //   await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`, {
  //     action: "getAllInvoices",
  //   })
  //     .then((res) => {
  //       if (isSubscribed) {
  //         setItemList(res?.data);
  //         setFilteredData(res.data?.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Server Error ~!")
  //     });

  //   return () => isSubscribed = false;
  // };


  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getAllInvoicesList", filterValue: filterValue })
        .then((res) => {
          if (isSubscribed) {

            // setItemList(res?.data);
            // setFilteredData(res.data?.data);
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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (e) => {
    if (e.target.name == 'start_date') {
      setStartDate(e.target.value);
    }
    if (e.target.name == 'end_date') {
      setEndDate(e.target.value);
    }

  }

  const getAllInvoiceByDate = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`, { start_date: start_date, end_date: end_date, action: "getAllInvoiceByDate" })
      .then((res) => {
        setItemList(res?.data);
        setFilteredData(res.data?.data);
      })
  }

  useEffect(() => {
    getAllInvoiceByDate()
  }, [start_date, end_date]);

  // useEffect(() => {
  //   let controller = new AbortController();
  //   const result = data?.filter((item) => {
  //     return item.voucher_type.toLowerCase().match(search.toLocaleLowerCase())
  //   });

  //   setFilteredData(result);
  //   return () => controller.abort();
  // }, [search])

  //date filter
  // useEffect(() => {
  //   let controller = new AbortController();
  //   const result = data?.filter((item) => {
  //     return item.voucher_date >= start_date && item.voucher_date <= end_date;
  //   });

  //   setFilteredData(result);
  //   return () => controller.abort();
  // }, [start_date, end_date])

  const actionButton = (invoice_id) => {
    return <>
      <ul className="action">
        {accessPermissions.listAndDetails && <li>
          <Link href={`/modules/accounts/vouchers/details/${invoice_id}`}>
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.createAndUpdate &&
          <li>
            <Link href={`/modules/accounts/vouchers/update/${invoice_id}`}>
              <a>
                <EditIcon />
              </a>
            </Link>

          </li>}

      </ul>
    </>
  }

  const columns = [

    {
      name: 'Invoice Number',
      selector: row => row.voucher_number,
      sortable: true,

    },
    {
      name: 'Voucher Type',
      selector: row => row.voucher_type,
      sortable: true,

    },
    {
      name: 'Account Name',
      selector: row => row.account?.account_name,
      sortable: true,
    },
    {
      name: 'Remarks',
      selector: row => row.remarks,
      sortable: true,
    },
    {
      name: 'Voucher Date',
      selector: row => row.voucher_date,
      sortable: true,
    },
    {
      name: 'Total Debit',
      selector: row => row.total_debit,
      sortable: true,
    },
    {
      name: 'Total Credit',
      selector: row => row.total_credit,
      sortable: true,
    },
    // {
    //   name: 'Creator',
    //   selector: row => row.creator.name,
    //   sortable: true,
    // },
    {
      name: 'Created At',
      selector: row => moment(row.created_at).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
    },

  ];

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
    { text: 'Accounts Vouchers', link: '/modules/accounts/vouchers' },
  ]



  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All AC. Vouchers</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {accessPermissions.createAndUpdate && <Link href={`/modules/accounts/vouchers/create`}>
                  <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    block
                  >
                    Create Voucher
                  </Button>
                </Link>}

                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} invoiceId={invoice_id} pending={pending} />
                </Modal>

              </div>
            </div>

            <div className="card-body">
              <div className="position-relative">

                {accessPermissions.download && <PDFAndPrintBtn
                  currentPage={currentPage}
                  rowsPerPage={perPageShow}
                  data={filteredData[currentPage]}
                  columns={columns}
                  position={true}
                />}

                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  dateFilter={false}
                  placeholderText="Voucher Number"
                />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />
              </div>


            </div>

          </div>
        </div>
      </div>
    </div>
  )
}