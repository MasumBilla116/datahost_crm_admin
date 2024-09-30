import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import { Button, Modal } from "react-bootstrap";
import { FaFilePdf } from 'react-icons/fa';
import Breadcrumbs from '../../../../../../components/Breadcrumbs';
import toast from "../../../../../../components/Toast/index";
import Select from '../../../../../../components/elements/Select';
import Select2 from '../../../../../../components/elements/Select2';
import Axios from '../../../../../../utils/axios';
import Link from 'next/link';
import PrintButton from '../../../../../../components/elements/PrintButton';

const Tranjection = () => {
  const router = useRouter();
  const { sector_name, id } = router.query;
  const { pathname } = router;
  const { http } = Axios();
  const [item, setItem] = useState(null);
  //Voucher data list
  const [itemList, setItemList] = useState([]);
  const [pending, setPending] = useState(false);
  const [invoice_id, setInvoiceId] = useState('')
  //start date and end date
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const [start_date, set_start_date] = useState(null);
  const [end_date, set_end_date] = useState(null);
  //  start_date,end_date
  const [totalCredit, setTotalCredit] = useState('');
  const [totalDebit, setTotalDebit] = useState('');

  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },

  })



  useEffect(() => {
    const fetchData = async () => {

      let body = {
        sector_id: id,
        sector_name: sector_name,
        start_date,
        end_date,
        action: "getUserLedgersHistory"

      }
      if (id) {
        try {
          const response = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/general-ledger`, body);
          setItemList(response?.data?.data?.ledgers);
          setTotalCredit(response.data.data?.total_credit);
          setTotalDebit(response.data.data?.total_debit);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [id, sector_name,start_date,end_date]); // Include http as a dependency if it's not defined inside the useEffect.



  const handleDownloadPdf = async () => {
    const element = document.getElementById('printME');
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    const marginTop = 15; // Adjust this value to set the desired top margin

    pdf.addImage(data, 'PNG', 0, marginTop, pdfWidth, pdfHeight);
    // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ledger.pdf');
  };






  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Accounts Ledgers</h4>
              </div>
              <div className="ms-auto flex-shrink-0">



              </div>
            </div>


            <div className="card-body">
              <div className="table-responsive">

                <div className="mb-3 row col-md-12">
                  <div className="col-md-3">

                  </div>

                  <div className="col-md-3">

                  </div>

                  <div className="col-md-3">
                    <label className="col-form-label ">Start Date:</label>
                    {/* <input type="date" name="start_date" onChange={handleChange } className="form-control" id="start_date" /> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker

                        size={1}
                        label="From"
                        open={dobOpenStartDate}
                        onClose={() => setDobOpenStartDate(false)}
                        value={start_date}
                        inputFormat="yyyy-MM-dd"
                        onChange={(event) => {
                          set_start_date(format(new Date(event), 'yyyy-MM-dd'));
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
                  <div className="col-md-3">
                    <label className="col-form-label ">End Date:</label>
                    {/* <input type="date" name="end_date" readOnly={(ledgerFilter.start_date == null) ? true: false} onChange={handleChange } className="form-control" id="end_date" /> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker

                        size={1}
                        label="To"
                        open={dobOpenEndDate}
                        onClose={() => setDobOpenEndDate(false)}
                        value={end_date}
                        inputFormat="yyyy-MM-dd"
                        onChange={(event) => {
                          set_end_date(format(new Date(event), 'yyyy-MM-dd'));
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

                <div className='col-md-6 col-lg-6 text-end'>
                  {/* <Button variant='success' className='' onClick={filterLedger} ><span className='fs-5 me-1'></span>View Ledger</Button> */}
                </div>

                <div id="printME" className='p-5' >
                  {itemList?.length ?
                    <>
                      <div className="border-bottom title-part-padding">
                        <h4 className="card-title mb-0">All Ledgers</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table
                            id="multi_col_order"
                            className="table table-striped table-bordered display"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Reference</th>
                                <th>User Id</th>
                                <th>Date</th>
                                <th>Remarks</th>
                                <th>Debit</th>
                                <th>Credit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemList?.map((item, index) => (
                                <>
                                  {item.itemId !== null && (
                                    <tr key={index}>
                                      <td>{index+1}</td>
                                      {/* <td><Link href={item.invoice_id}><a target="blank">{item.invoice_id}</a></Link></td> */}
                                      <td><a target="blank">{item.invoice_id}</a></td>
                                      <td>{item.id}</td>  
                                      <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                                      <td>{item.note}</td>
                                      <td>{item.debit}</td>
                                      <td style={{ textAlign: 'center' }}>{item.credit}</td>
                                    </tr>
                                  )}
                                </>
                              ))}

                            </tbody>
                            <tr style={{ background: 'pink' }}>
                              <td colspan="5" style={{ textAlign: 'right' }}>total debit: </td>
                              <td>{totalDebit}</td>
                              <td style={{ textAlign: 'left' }}>total credit: {totalCredit}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div className='col-md-6 col-lg-6 text-end'>
                        {/* <Button variant='success' onClick={handleDownloadPdf} className=''  ><span className='fs-5 me-1'><FaFilePdf /></span>Print Consignment</Button> */}
                        <PrintButton contentId="printME" />

                      </div>
                    </>
                    :
                    ""
                  }
                </div>



              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Tranjection