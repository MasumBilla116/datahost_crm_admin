import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import * as moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import FilterDatatable from '../../../../components/Filter/FilterDatatable';
import PDFAndPrintBtn from '../../../../components/Filter/PDFAndPrintBtn';
import ServiceFilter from '../../../../components/Filter/ServiceFilter';
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import ViewIcon from '../../../../components/elements/ViewIcon';
import Axios from '../../../../utils/axios';
import { getSSRProps } from '../../../../utils/getSSRProps';
import { HeadSection } from '../../../../components';


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.invtr.cnsmptn" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Delete component
const DeleteComponent = ({ onSubmit, voucherId, pending }) => {

  let myFormData = new FormData();

  myFormData.append('action', "deleteVoucher");
  myFormData.append('voucher_id', voucherId);

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to Delete </Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(myFormData)}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({accessPermissions}) {

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


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (voucherId) => {
    setShowDeleteModal(true);
    setVoucherId(voucherId);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher`, formData)
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
  const [voucher_id, setVoucherId] = useState('')


  // const [filterValue, setFilterValue] = useState("all");
  const [dobOpen, setDobOpen] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


    /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const[dateFilter,setDateFilter]= useState(true)
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
  }, [filterValue, startDate, endDate]);


  //Fetch List Data for datatable
  const data = itemList?.data;

  const fetchItemList = async () => {
    let isSubscribed = true;
    setTblLoader(true);
    // setTimeout(async () => {
      if (!filteredData?.[currentPage] || filterValue.filter === true) {
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/consumption-voucher?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getAllVouchersList", filterValue: filterValue })
          .then((res) => {
            if (isSubscribed) {

              setItemList(res?.data);
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



  const actionButton = (voucher_id) => {
    return <>
      <ul className="action">
        { accessPermissions.listAndDetails && <li>
          <Link href={`/modules/inventory/vouchers/details/${voucher_id}`}>
            <a>
              <ViewIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.createAndUpdate && <li>
          <Link href={`/modules/inventory/vouchers/update/${voucher_id}`}>
            <a>
              <EditIcon />
            </a>
          </Link>

        </li>}
       {accessPermissions.delete && <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(voucher_id)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}
        {accessPermissions.listAndDetails &&<li>
          <Link href={`/modules/inventory/vouchers/edit-history/${voucher_id}`}>
            <a>
              <i className="fas fa-history" aria-hidden="true"></i>
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }

  const columns = [

    {
      name: 'Voucher Number',
      selector: row => row.voucher_number,
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
      name: 'Total Item',
      selector: row => row.total_item,
      sortable: true,
    },
    {
      name: 'Total Quantity',
      selector: row => row.total_item_qty,
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

  //Filter data for booking report



  // const handleChangeFilter = (val) => {
  //   setFilterValue(val);
  //   setSearch("");
  // };


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
  ]


  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];



  return (
    <div className="container-fluid">
<HeadSection title="All Consumption" />
      <div className="row">
        <div className="col-12 p-xs-2 ">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Consumption Vouchers</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Link href="/modules/inventory/vouchers/create">
                  <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    onClick={handleShow}
                    block
                  >
                    Create Voucher
                  </Button>
                </Link>
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} voucherId={voucher_id} pending={pending} />
                </Modal>

              </div>
            </div>


            <div className="card-body">

                {filterValue === 'custom' && (<>


                  <div className="flex-gap">

                    <div>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker

                          size={1}
                          label="From"
                          open={openStartDate}
                          onClose={() => setOpenStartDate(false)}
                          value={startDate}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setStartDate(format(new Date(event), 'yyyy-MM-dd'));
                          }}


                          variant="inline"
                          openTo="year"
                          views={["year", "month", "day"]}

                          renderInput={(params) =>
                            <ThemeProvider theme={theme}>
                              <TextField onClick={() => setOpenStartDate(true)} fullWidth={true}
                                size='small' {...params} required />
                            </ThemeProvider>
                          }
                        />
                      </LocalizationProvider>
                    </div>
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker

                          size={1}
                          label="To"
                          open={openEndDate}
                          onClose={() => setOpenEndDate(false)}
                          value={endDate}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setEndDate(format(new Date(event), 'yyyy-MM-dd'));
                          }}


                          variant="inline"
                          openTo="year"
                          views={["year", "month", "day"]}

                          renderInput={(params) =>
                            <ThemeProvider theme={theme}>
                              <TextField onClick={() => setOpenEndDate(true)} fullWidth={true}
                                size='small' {...params} required />
                            </ThemeProvider>
                          }
                        />
                      </LocalizationProvider>
                    </div>


                  </div>


                </>)}
                <div className="position-relative">

                {accessPermissions.download &&<PDFAndPrintBtn
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
                  dateFilter={true}
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