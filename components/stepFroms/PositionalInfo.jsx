import MyToast from "@mdrakibul8001/toastify";
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Axios from "../../utils/axios";
import Select2 from "../elements/Select2";

const PositionalInfo = ({ formData, setFormData, validateForm,handleValidationErrors,setHandleValidationErrors }) => {

  const { notify } = MyToast();

  const router = useRouter();

  const { http } = Axios();
  const [employee, setEmployee] = useState({
    department_id: null,
    designation_id: null,
    name: "",
    gender: "male",
    salary_type: "",
    salary_amount: "",
    address: "",
    description: "",
    mobile: "",
    email: "",
    status: 1,
    is_user: false,
    role_id: null,
    roles: [],
    user_status: 1,
    user_defined_password: false,
    password: "",
    country_id: null,
    state_id: null,
    city_id: null,
    countryData: [],
    stateData: [],
    cityData: [],
    getDept: [],
    getAllDesignation: [],
    attendanceTime: "",
    clientId: 0

  });

  const [dobOpenHireDate, setDobOpenHireDate] = useState(false);
  const [dobOpen, setDobOpen] = useState(false);

  const [bankInfo, setBankInfo] = useState({
    basic: "",
    transportAllowance: "",
    grossSalary: "",
    branchAddress: ""

  });


  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);

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
    let isMount = true;
    if (isMount) {
      getDepartment();
      getDesignation();

    }
    return () => {
      isMount = false;
    }
  }, [formData.country_id, formData.state_id]);


  async function getDepartment() {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, { action: "getAllDepartments", })
      .then((res) => {
        if (isSubscribed) {

          setEmployee(prev => ({
            ...prev,
            getDept: res.data,
          }))
        }
      });

    return () => isSubscribed = false;

  }

  async function getDesignation() {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, { action: "getDesignations", })
      .then((res) => {
        if (isSubscribed) {

          setEmployee(prev => ({
            ...prev,
            getAllDesignation: res.data,
          }))

        }
      });

    return () => isSubscribed = false;
  }






  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,

    });

    if(name === 'rate' && value !== '')
    {
      setHandleValidationErrors(prev => ({
        ...prev,
        rate_error: false
      }));
    }

  };



  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }

    setFormData(prev => ({
      ...prev, upload_files: filesArr
    }))
  }


  //function set selected files ids
  const setIds = (Ids) => {

    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setFormData(prev => ({
      ...prev, upload_ids: arr
    }))

  };


  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setFacilities(prev => ({
      ...prev, upload_ids: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setFacilities(prev => ({
      ...prev, upload_files: newList
    }))

  }
  const dept_options = employee.getDept.data;
  const designation_options = employee.getAllDesignation.data;

  const defaultPosiDept = { value: formData?.department_id, label: formData?.department_name };
  const defaultPosiDesignation = { value: formData?.designation_id, label: formData?.designation_name };
  return (
    <>

      <div className=" p-3">
        <div className="card-body border-bottom ">
          <h4 className="card-title fw-bolder"> Positional Information</h4>
        </div>
        <Form noValidate>
          <div className="card-body">
            <div className="row ">
              <div className="col-md-6">
                <Form.Group controlId="formBasicName">
                  <Form.Label> Department <span className="text-danger">*</span> </Form.Label>
                  <Select2 
                   className="select-bg"
                    options={dept_options && dept_options.map(({ id, name }) => ({ value: id, label: name }))}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, department_id: e.value, department_name: e.label, }))
                      setHandleValidationErrors(prev => ({
                        ...prev,
                        department_error: false
                      }));
                    }}
                    defaultValue={defaultPosiDept}
                  />
                  <div className="text-danger">{handleValidationErrors.department_error && "Department is required"}</div>
                </Form.Group>

                <Form.Group md="10" controlId="validationCustom02" className="mt-5">

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      size={1}
                      label="Join Date"
                      open={dobOpen}
                      onClose={() => setDobOpen(false)}
                      value={formData?.join_date}
                      inputFormat="yyyy-MM-dd"
                      onChange={(event) => {
                        // setCustomer(prev => ({ ...prev, join_date: event }));
                        setFormData(prev => ({ ...prev, join_date: event }));
                        // setFormData({
                        //   ...formData,
                        //   join_date: event,
                        // });
                        setHandleValidationErrors(prev => ({
                          ...prev,
                          join_date_error: false
                        }));

                      }}
                      renderInput={(params) =>
                        <ThemeProvider theme={theme}>
                          <TextField onClick={() => setDobOpen(true)} fullWidth={true} size='small' {...params} required />
                        </ThemeProvider>
                      }
                    />
                  </LocalizationProvider>
                  <div className="text-danger">{handleValidationErrors.join_date_error && "Joining date is required"}</div>

                </Form.Group>


                <Form.Group md="10" controlId="validationCustom02" className="mt-5">
                  <Form.Label>Rate Type</Form.Label>
                  <select onChange={handleChange} name="rateType" className="form-select" value={formData.rateType}>
                    <option value="partTime">Part Time</option>
                    <option value="fullTime">Full Time</option>
                    <option value="contructual">Contructual</option>
                  </select>
                  <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                    Please provide a mobile number.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group as={Col} md="10" controlId="formBasicName">
                  <Form.Label> Designation <span className="text-danger">*</span> </Form.Label>
                  <Select2
                   className="select-bg"
                    options={designation_options && designation_options.map(({ id, name }) => ({ value: id, label: name }))}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, designation_id: e.value, designation_name: e.label }))
                      setHandleValidationErrors(prev => ({
                        ...prev,
                        designation_error: false
                      }));
                    }}
                    defaultValue={defaultPosiDesignation}
                  />
                  <div className="text-danger">{handleValidationErrors.designation_error && "Designation is required"}</div>

                </Form.Group>

                <Form.Group as={Col} md="10" controlId="formBasicName" className="mt-5">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      size={1}
                      label="Hire Date"
                      open={dobOpenHireDate}
                      onClose={() => setDobOpenHireDate(false)}
                      value={formData?.hire_date}
                      inputFormat="yyyy-MM-dd" 

                      onChange={(event) => {
                        setFormData(prev => ({ ...prev, hire_date: event }));
                        setHandleValidationErrors(prev => ({
                          ...prev,
                          hire_date_error: false
                        }));

                      }}

                      renderInput={(params) =>
                        <ThemeProvider theme={theme}>
                          <TextField onClick={() => setDobOpenHireDate(true)} fullWidth={true} size='small' {...params} required />
                        </ThemeProvider>
                      }
                    />
                  </LocalizationProvider>
                  <div className="text-danger">{handleValidationErrors.hire_date_error && "Hiring date is required"}</div>

                </Form.Group>

                <Form.Group as={Col} md="10" controlId="formBasicName" className="mt-5">
                  <Form.Label> Rate <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    required
                    name="rate"
                    type="text" 
                    value={formData.rate}
                    onChange={handleChange}
                    placeholder="Rate"
                  />
                  <div className="text-danger">{handleValidationErrors.rate_error && "Rate is required"}</div>
                </Form.Group>
              </div>
            </div>
          </div>
        </Form>


      </div>
    </>
  );
};

export default PositionalInfo;
