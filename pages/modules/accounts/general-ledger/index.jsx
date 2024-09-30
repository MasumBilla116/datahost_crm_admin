import MyToast from '@mdrakibul8001/toastify';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import DataTable from 'react-data-table-component';
import { DeleteIcon, EditIcon, HeadSection, Select2 } from '../../../../components';
import ActiveCurrency from '../../../../components/ActiveCurrency';
import PDFAndPrintBtn from '../../../../components/Filter/PDFAndPrintBtn';
import PdfDataTable from '../../../../components/PdfDataTable';
import PrintDataTable from '../../../../components/PrintDataTable';
import ViewIcon from '../../../../components/elements/ViewIcon';
import Axios from '../../../../utils/axios';
import { getSSRProps } from '../../../../utils/getSSRProps';

export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.acnt.gnrl_ldgr" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Delete component
const DeleteComponent = ({ onSubmit, ledgerId, pending }) => {

  let myFormData = new FormData();

  myFormData.append('action', "deleteLedger");
  myFormData.append('id', ledgerId);

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

const Ledgerindex = ({accessPermissions}) => {
  const { http } = Axios();
  const { notify } = MyToast();
  const router = useRouter();
  const { pathname } = router;

  //Voucher data list
  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSum, setTotalSum] = useState(0);

  const [filterValue, setFilterValue] = useState("all");
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pending, setPending] = useState(false);
  const [invoice_id, setInvoiceId] = useState('');
  const [sector, setSector] = useState('');



  const handleChangeFilter = (val) => {
    setFilterValue(val);
    setSearch("");


  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, startDate, endDate, sector]);

  //Fetch List Data for datatable
  // const data = itemList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/general-ledger`, {
      action: "getAllLedgers", filterValue, startDate, endDate, sector
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


  const data = itemList?.data;

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item?.name.toLowerCase().match(search.toLocaleLowerCase())
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search])




  //Delete  Modal
  const [ledgerId, setLedgerId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (id) => {
    setShowDeleteModal(true);
    setLedgerId(id);
  }



  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/general-ledger`, formData)
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




  const actionButton = (id) => {
    return <>
      <ul className="action">
        {accessPermissions.listAndDetails &&<li>
          <Link href={`/modules/accounts/general-ledger/view/${id}`}>
            <a>
              <ViewIcon />
            </a>
          </Link>
        </li>}
        {accessPermissions.createAndUpdate &&<li>
          <Link href={`/modules/accounts/general-ledger/update/${id}`}>
            <a >
              <EditIcon />
            </a>
          </Link>
        </li>}

        {accessPermissions.delete &&<li>
          <Link href='#'>
            <a onClick={() => handleOpenDelete(id)}>
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
      name: 'sector_head',
      selector: row => row.sector_head,
      sortable: true,

    },
    {
      name: 'account_type',
      selector: row => row.account_type,
      sortable: true,
    },

    {
      name: 'Bank Name',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Opening Balance',
      selector: row => <><ActiveCurrency/> {row.opening_balance}</> ,
      sortable: true,
    },
    {
      name: 'Balance',
      selector: row => <><ActiveCurrency/>{row.balance}</>,
      sortable: true,
    },

    {
      name: 'Action',
      selector: row => actionButton(row.id),
    },

  ];


  const generatePDF = () => {

    PdfDataTable({ currentPage, rowsPerPage, filteredData, columns });

  };


  const printData = () => {
    PrintDataTable({ currentPage, rowsPerPage, filteredData, columns });
  };


  // Calculate the total sum for the current page when filteredData or rowsPerPage changes
  React.useEffect(() => {
    let sum = 0;

    // Iterate through the data on the current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataOnCurrentPage = filteredData?.slice(startIndex, endIndex);

    dataOnCurrentPage?.forEach((row) => {
      const netAmount = parseFloat(row.balance);
      if (!isNaN(netAmount)) {
        sum += netAmount;
      }
    });

    setTotalSum(sum); // Update the total sum state
  }, [filteredData, currentPage, rowsPerPage]);


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All General Ledger', link: '/modules/accounts/general-ledger' },
  ]



  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },

  })


  const accountHead = [
    { label: 'Assets', value: 'asset' },
    { label: 'Liabilities', value: 'liability' },
    { label: 'Expenses', value: 'expenditure' },
    { label: 'Revenue', value: 'revenue' }
  ]


  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="General-Ledger" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All General Ledger</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {accessPermissions.createAndUpdate &&<Link href={`/modules/accounts/general-ledger/create`}>
                  <Button
                    className="shadow rounded btn-sm"
                    variant="primary"
                    type="button"
                    block
                  >
                    Create Ledger
                  </Button>
                </Link>}

                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} ledgerId={ledgerId} pending={pending} />
                </Modal>

              </div>
            </div>

            <div className="card-body p-xs-2"> 
                <div className="d-flex align-items-center">
                  <div className="flex-gap">
                    <div>
                      <ToggleButtonGroup type="radio" value={filterValue} name="invoice_report" onChange={handleChangeFilter} >
                        <ToggleButton id="tbg-btn-0" value="all" className='rounded-left'>
                          All
                        </ToggleButton>
                        <ToggleButton id="tbg-btn-1" value="custom">
                          Custom
                        </ToggleButton>

                      </ToggleButtonGroup>
                    </div>
                    <div className="PrintPdfBtn">
                      <Form.Group className='w-xs-100' style={{ width: '270px', height: '40px' }} >
                        {/* <Form.Label>Sector</Form.Label> */}

                        <Select2
                          options={accountHead?.map(({ label, value }) => ({ value: value, label: label, name: "sector_head" }))}
                          // value={sector} // Set the default value using the 'value' prop
                          onChange={(e) => {
                            setSector(e.value); // Update the 'sector' state with the selected value
                          }}
                          required

                        />
                      </Form.Group>
                      {/* <button className="pdfAndprintbutton" onClick={generatePDF}>PDF</button>
                      <button className="pdfAndprintbutton" onClick={printData}>Print</button> */}
                    </div>
                  </div>
                </div> 

                {filterValue === 'custom' && (<>
                  <div className="flex-gap">

                    <div>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker

                          size={1}
                          label="From"
                          open={dobOpenStartDate}
                          onClose={() => setDobOpenStartDate(false)}
                          value={startDate}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setStartDate(format(new Date(event), 'yyyy-MM-dd'));
                          }}


                          // variant="inline"
                          // openTo="year"
                          // views={["year", "month", "day"]}

                          renderInput={(params) =>
                            <ThemeProvider theme={theme}>
                              <TextField onClick={() => setDobOpenStartDate(true)} fullWidth={true} size='small' {...params} required />
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
                          open={dobOpenEndDate}
                          onClose={() => setDobOpenEndDate(false)}
                          value={endDate}
                          inputFormat="yyyy-MM-dd"
                          onChange={(event) => {
                            setEndDate(format(new Date(event), 'yyyy-MM-dd'));
                          }}


                          // variant="inline"
                          // openTo="year"
                          // views={["year", "month", "day"]}

                          renderInput={(params) =>
                            <ThemeProvider theme={theme}>
                              <TextField onClick={() => setDobOpenEndDate(true)} fullWidth={true} size='small' {...params} required />
                            </ThemeProvider>
                          }
                        />
                      </LocalizationProvider>
                    </div>
                  </div>

                </>)}
                <div className="custom-data-table">
                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  subHeader
                  subHeaderComponent={
                    <div className="row">
                      <div className="col-lg-8 col-md-6 col-sm-12"></div>
                        <div className="col-lg-4 col-md-6 col-sm-12 p-0">
                          <div className="d-flex position-relative">
                            <input
                                type="text"
                                placeholder="search..."
                                className="me-3 form-control"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                              />
                         <div className="mt-2">
                            {accessPermissions.download &&<PDFAndPrintBtn
                            currentPage={currentPage}
                            rowsPerPage={rowsPerPage}
                            data={filteredData }
                            columns={columns}
                            position={false}
                          />}
                          </div>
                        </div>
                      </div>                      
                    </div>
                  }
                  striped
                  paginationPerPageOptions={[10, 25, 50]} // Set the available rows per page options
                  paginationRowsPerPage={rowsPerPage} // Control the selected rows per page
                  onChangeRowsPerPage={(currentRowsPerPage) => setRowsPerPage(currentRowsPerPage)} // Update rowsPerPage
                />
                </div>
                <div >
                  Total Balance on Current Page: {totalSum.toFixed(2)}
                </div> 
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Ledgerindex