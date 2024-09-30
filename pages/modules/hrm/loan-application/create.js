import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
// import Form from '../../../../components/elements/Form';
import { Form } from "react-bootstrap";
import Label from '../../../../components/elements/Label';
import Select2 from '../../../../components/elements/Select2';
import Axios from '../../../../utils/axios';
import TextInput from '../../../../components/elements/TextInput';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '../../../../components/elements/Button';
import format from 'date-fns/format';
import toast from '../../../../components/Toast';
import { useRouter } from 'next/router';
import HeadSection from '../../../../components/HeadSection';
import Breadcrumbs from '../../../../components/Breadcrumbs';

const create = () => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const { http } = Axios();
  const [getAllEmployees, setEmployees] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const employees_options = getAllEmployees.data;
  const [subject, setSubject] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [loan_category, setLoanCategory] = useState("");
  const [loan_categoryType, setLoanCategoryType] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [date, setDate] = useState(null);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [description, setDesc] = useState("");
  const [amount, setAmount] = useState(0);
  const router = useRouter();
  const { pathname } = router;
  const [pending, setPending] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  console.log("loan_categoryType", loan_categoryType)
  useEffect(() => {

    const controller = new AbortController();
    async function getEmployees() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee", })
        .then((res) => {
          setEmployees(res.data);
        });
    }
    getEmployees();
    return () => controller.abort();

  }, [])



  useEffect(() => {

    const controller = new AbortController();
    async function fetchItemList() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, { action: "getAllLoanCategory", })
        .then((res) => {
          setFilteredData(res?.data?.data);
        });
    }
    fetchItemList();
    return () => controller.abort();

  }, [])




  const options = [
    // { value: 'daily', label: 'Daily' },
    // { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
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


  async function submitForm(e) {
    e.preventDefault();
    // console.log(description, employees_options, employee_id, subject, amount, loan_category, startDate, endDate, date);
    let formData = {
      action: "createLoanApplication",
      employee_id: employee_id,
      subject: subject,
      loan_payment: loan_category,
      loan_category: loan_categoryType,
      amount: parseInt(amount),
      paymentAmount: parseInt(paymentAmount),
      // startDate,
      // endDate,
      date,
      description

    }

    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, formData)
      .then((res) => {
        notify("success", "successfully Added!");
        setPending(false);
        router.push('/modules/hrm/loan-application');
      }).catch((e) => {
        const msg = e.response.data.response;
        if (typeof (e.response.data.response) == 'string') {
          notify("error", `${e.response.data.response}`);
        }

        else {
          if (msg.amount) {
            notify("error", `${msg.amount.Amount}`);
          }

        }
        console.log("erro", e);
      });

  }


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Loan-Applications', link: '/modules/hr/loanApplications' },
    { text: 'Create Loan-Applications', link: '/modules/hr/loanApplications/createLoanApplication' },

  ];


  return (
    <>

      <HeadSection title="Create Loan Applications" />
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Add Employees-Loan</h4>
              </div>



              <Form onSubmit={submitForm}>
                <div className="card-body">
                  <div className="col-sm">



                    <div className="row container mb-2">
                      <div className="col-md-6">
                        <Form.Group controlId="formBasicName" >
                          <Form.Label> Employee <span className="text-danger">*</span> </Form.Label>
                          <Select2
                            options={employees_options?.map(({ id, name }) => ({ value: id, label: name }))}
                            onChange={(e) =>
                              setEmployeeId(e.value)
                            }

                          />
                        </Form.Group>





                      </div>

                      <div className="col-md-6">





                        <Form.Group controlId="formBasicName" >
                          <Form.Label> Date <span className="text-danger">*</span> </Form.Label>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              size={1}
                              // label="Enter the date"
                              open={openDate}
                              onClose={() => setOpenDate(false)}
                              value={date}
                              inputFormat="yyyy-MM-dd"
                              onChange={(event) => {
                                setDate(format(new Date(event), 'yyyy-MM-dd'));
                              }}


                              variant="inline"
                              openTo="year"
                              // views={["year", "month", "day"]}

                              renderInput={(params) =>
                                <ThemeProvider theme={theme}>
                                  <TextField onClick={() => setOpenDate(true)} fullWidth={true} size='small' {...params} required />
                                </ThemeProvider>
                              }
                            />
                          </LocalizationProvider>
                        </Form.Group>


                      </div>
                    </div>

                    <div className="row container">
                      <div className="col-md-3">
                        <Form.Group controlId="formBasicName" >
                          <Form.Label> Loan Amount <span className="text-danger">*</span> </Form.Label>
                          <Form.Control

                            type="number"
                            placeholder="Enter the loan amount"

                            onChange={(e) => setAmount(e.target.value)}
                            required

                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group controlId="formBasicName" >
                          <Form.Label>Loan Category<span className="text-danger">*</span> </Form.Label>
                          <Select2
                            options={filteredData?.map(({ id, name }) => ({ value: id, label: name }))}
                            onChange={(e) =>
                              setLoanCategoryType(e.value)
                            }

                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group controlId="formBasicName" >
                          <Form.Label>Payment Cycle<span className="text-danger">*</span> </Form.Label>
                          <Select2 options={options} onChange={(options) => setLoanCategory(options.value)} />
                        </Form.Group>
                      </div>


                      <div className="col-md-3">
                    <Form.Group controlId="formBasicName" >
                        <Form.Label> Payment Amount <span className="text-danger">*</span> </Form.Label>
                        <Form.Control

                          type="text"
                         placeholder="Payment Amount"

                          onChange={(e) => setPaymentAmount(e.target.value)}
                          required

                        />
                      </Form.Group>
                    </div>
                    </div>
                    <div className="row container mt-1"  >
                    

                   
                    <Form.Group controlId="formBasicName" >
                        <Form.Label> Subject <span className="text-danger">*</span> </Form.Label>
                        <Form.Control

                          type="text"
                          placeholder="Subject of Loan Application"

                          onChange={(e) => setSubject(e.target.value)}
                          required

                        />
                      </Form.Group>
                   

                      
                    </div>


                    <div className="row container mt-1"  >


                      <Form.Group controlId="formBasicAddress" className='mb-3'>
                        <Form.Label> Description  </Form.Label>


                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Description..."
                          name="description" onChange={(e) => setDesc(e.target.value)}
                        />
                      </Form.Group>
                    </div>

                  </div>

                  <div className="p-3 border-top">
                    <div className="text-end">

                      <Button disabled={pending} className="btn-info">
                        Save
                      </Button>
                      {/* <Button className="btn-dark">
                        Cancel
                      </Button> */}
                    </div>
                  </div>
                </div>
              </Form>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default create