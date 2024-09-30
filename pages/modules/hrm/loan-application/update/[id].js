import React from 'react'
import Axios from '../../../../../utils/axios';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Form } from "react-bootstrap";
import Label from '../../../../../components/elements/Label';
import Select2 from '../../../../../components/elements/Select2';
import TextInput from '../../../../../components/elements/TextInput';
import TextField from '@mui/material/TextField';
import Button from '../../../../../components/elements/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Select from '../../../../../components/elements/Select';
import toast from "../../../../../components/Toast/index";
import Breadcrumbs from '../../../../../components/Breadcrumbs';
import HeadSection from '../../../../../components/HeadSection';

const LoanUpdate = () => {

  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;
  const [getAllEmployees, setEmployees] = useState("")

  const employees_options = getAllEmployees.data;
  const [date, setDate] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [loan_categoryType, setLoanCategoryType] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [loanDetails, setLoanDetails] = useState({
    loan_id: id,
    subject: '',
    employee_id: null,
    name: '',
    amount: null,
    payment_amount: null,
    loan_category: null,
    loan_category_name: '',
    description: '',
    date: '',

  });

  const selected_employee_options = { value: loanDetails?.employee_id, label: loanDetails?.name };
  const selected_loan_category = { value: loanDetails?.loan_category, label: loanDetails?.loan_category_name };
  console.log("selected_loan_category", selected_loan_category)
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
  const handleChange = (e) => {

    setLoanDetails(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    router.isReady && applicationDetails()
  }, [id])

  const applicationDetails = () => {
    let isSubscribed = true;
    setLoading(true);
    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, { action: "getLoanDetails", loan_id: id })
      .then((res) => {

        setLoanDetails(prev => ({
          ...prev,

          subject: res?.data?.data?.subject,
          employee_id: res?.data?.data?.employee_id,
          name: res?.data?.data?.name,
          amount: res?.data?.data?.amount,
          loan_category: res?.data?.data?.loan_category,
          loan_category_name: res?.data?.data?.loan_category_name,
          description: res?.data?.data?.description,
          date: res?.data?.data?.date,
          loan_payment: res?.data?.data?.loan_payment,
          payment_amount: res?.data?.data?.payment_amount,
        }))
        setLoading(false);
      })

      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false);
      });

    return () => isSubscribed = false;
  }

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

    let body = { ...loanDetails, action: "updateLoanApplication" }

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/loan`, body)
      .then((res) => {
        notify("success", `${res.data.response}`);
        router.push('/modules/hrm/loan-application')
      })

  }

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Loan-Applications', link: '/modules/hr/loanApplications' },
    { text: 'Update Loan-Applications', link: '/modules/hr/loanApplications/update/[id]' },

  ];
  return (
    <>
      <HeadSection title="Upadete Employees-Loan" />
      <div className="container-fluid ">

        <div className="row">
          <div className="col-md-8 offset-md-2">
            {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Upadete Employees-Loan</h4>
              </div>

              <Form onSubmit={submitForm}>
                <div className="card-body">
                  <div className="col-sm">
                    <div className="row container">
                      <div className="col-md-6">
                        {
                          loanDetails?.employee_id !== null && <div className="mb-3 row">

                            <Form.Group controlId="formBasicName" >
                              <Form.Label> Employee <span className="text-danger">*</span> </Form.Label>
                              <Select2
                                options={employees_options?.map(({ id, name }) => ({ value: id, label: name }))}
                                onChange={(e) => setLoanDetails(prev => ({ ...prev, employee_id: e.value, name: e.label }))}
                                defaultValue={selected_employee_options}
                              />
                            </Form.Group>
                          </div>
                        }

                        {

                          loanDetails?.employee_id === null &&

                          <Form.Group controlId="formBasicName" >
                            <Form.Label> Employee <span className="text-danger">*</span> </Form.Label>
                            <Select2
                              options={employees_options?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={(e) => setLoanDetails(prev => ({ ...prev, employee_id: e.value, name: e.label }))}
                              defaultValue={{ value: "", label: "loading..." }}
                            />
                          </Form.Group>

                        }

                      </div>


                      <div className="col-md-6">

                      <Form.Group controlId="formBasicName" >
                          <Form.Label> Date <span className="text-danger">*</span> </Form.Label>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker

                              size={1}
                              label="Enter the date"
                              open={openDate}
                              onClose={() => setOpenDate(false)}
                              value={loanDetails?.date}
                              onChange={(event) => {
                                setDate(format(new Date(event), 'yyyy-MM-dd'));
                              }}


                              variant="inline"
                              openTo="year"
                              views={["year", "month", "day"]}

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
                            name="amount"
                            value={loanDetails?.amount}
                            onChange={handleChange}

                            required

                          />
                        </Form.Group>
                      </div>

                      <div className="col-md-3">
                        {loanDetails?.loan_category !== null &&
                          <Form.Group controlId="formBasicName" >
                            <Form.Label>Loan Category<span className="text-danger">*</span> </Form.Label>



                            <Select2
                              options={filteredData?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={(e) => setLoanDetails(prev => ({ ...prev, loan_category: e.value, loan_category_name: e.label }))}

                              defaultValue={selected_loan_category}
                            />

                          </Form.Group>
                        }


                        {loanDetails?.loan_category === null &&

                          <Form.Group controlId="formBasicName" >
                            <Form.Label>Loan Category<span className="text-danger">*</span> </Form.Label>
                            <Select2
                              options={filteredData?.map(({ id, name }) => ({ value: id, label: name }))}
                              onChange={(e) => setLoanDetails(prev => ({ ...prev, loan_category: e.value, loan_category_name: e.label }))}


                              defaultValue={{ value: "", label: "loading..." }}

                            />
                          </Form.Group>}

                      </div>

                      <div className="col-md-3 ">
                        <Form.Group controlId="formBasicName" >
                          <Form.Label> Loan Payment <span className="text-danger">*</span> </Form.Label>
                          <Select value={loanDetails?.loan_payment || ""} name="loan_payment" onChange={handleChange}>
                            {/* <option value="hourly">Daily</option>
                            <option value="daily">Weekly</option> */}
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </Select>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                    <Form.Group controlId="formBasicName" >
                        <Form.Label> Payment Amount <span className="text-danger">*</span> </Form.Label>
                        <Form.Control

                          type="text"
                          placeholder="Payment Amount"
                           name="payment_amount"
                          value={loanDetails?.payment_amount}
                          onChange={handleChange}
                          required

                        />
                      </Form.Group>
                    </div>
                    <div className="row container">
                    
                    </div>

                    <div className="col-md-12">
                    <Form.Group controlId="formBasicName" >
                          <Form.Label> Subject <span className="text-danger">*</span> </Form.Label>
                          <Form.Control

                            type="text"
                            placeholder="Subject of Loan Application"
                            name="subject"
                            value={loanDetails?.subject}
                            onChange={handleChange}
                            required

                          />
                        </Form.Group>
                    </div>

                    
                    </div>



                    <div className="row container">


                      <Form.Group controlId="formBasicAddress" className=' mb-3'>
                        <Form.Label> Description  </Form.Label>


                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Description..."
                          name="description"
                          value={loanDetails?.description}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="p-3 border-top">
                    <div className="text-end">

                      <Button className="btn-info">
                        Update
                      </Button>

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

export default LoanUpdate;