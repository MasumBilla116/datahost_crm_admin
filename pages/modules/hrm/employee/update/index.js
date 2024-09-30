import * as CryptoJS from "crypto-js";
import { useRouter } from "next/router";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import HeadSection from "../../../../../components/HeadSection";
import toast from "../../../../../components/Toast/index";
import themeContext from "../../../../../components/context/themeContext";
import Button from "../../../../../components/elements/Button";
import Label from "../../../../../components/elements/Label";
import RadioButton from "../../../../../components/elements/RadioButton";
import Select from "../../../../../components/elements/Select";
import Select2 from "../../../../../components/elements/Select2";
import PropagateLoading from "../../../../../components/PropagateLoading";
import Axios from "../../../../../utils/axios";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function UpdateEmployee() {
  const context = useContext(themeContext);
  const { accessType } = context;
  const router = useRouter();

  const { data, updateForm, employee_id } = router.query;
  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const {
    isReady,
    query: { id },
  } = router;


  // const { pathname } = router;

  const [params, setParams] = useState(null);
  const [editData, setEditData] = useState(false);

  useEffect(() => {
    // This useEffect hook runs whenever `employee_id` changes
    if (data === null) {
      console.error("Received null data");
      setEditData(false);
    } else {
      // Parse the JSON data
      try {
        const parsedData = JSON.parse(data);
        // Assuming parsedData is an object with an `id` property
        setParams(parsedData?.id); // Set `params` to the `id` from parsedData
        setEditData(true); // Set `editData` to true indicating data is ready
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
  }, [employee_id]);




  // useEffect(() => {
  //   let isSubscribed = true;
  //   if (!isReady) {
  //     // console.log("fetching...");
  //     return;
  //   }

  //   const key = "123";
  //   const str = id.replace(/--/g, "/");
  //   const decrypted = CryptoJS.AES.decrypt(str, key).toString(
  //     CryptoJS.enc.Utf8
  //   );

  //   if (isSubscribed) {
  //     setParams(decrypted);
  //   }

  //   return () => (isSubscribed = false);
  // }, [id, isReady]);

  const { http } = Axios();
  const [loading, setLoading] = useState(true);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [getAllDesignation, setGetAllDesignation] = useState([]);
  const [getDept, setGetDept] = useState([]);
  const [getEmpDetails, setGetEmpDetails] = useState({});
  const [roles, setRoles] = useState([]);
  const [dobOpenHireDate, setDobOpenHireDate] = useState(false);
  const [dobOpen, setDobOpen] = useState(false);
  const [joinDateOpen, setJoinDateOpen] = useState(false);
  const [regineDateOpen, setRegieDateOpen] = useState(false);

  // getDept
  const [employee, setEmployee] = useState({
    department_id: null,
    designation_id: null,
    name: "",
    gender: "male",
    // salary_type: "",
    // salary_amount: "",
    address: "",
    description: "",
    mobile: "",
    email: "",
    status: 1,
    is_user: false,
    role_id: null,
    // roles: [],
    user_status: 1,
    user_defined_password: false,
    password: "",
    country_id: null,
    state_id: null,
    city_id: null,
    // countryData: [],
    // stateData: [],
    // cityData: [],
    // getDept: [],
    // getAllDesignation: [],
    getEmpDetails: {},
    sector_head: null,
    sector_id: null,
    sector_parent_id: null,
    birth_date: null,
    join_date: null,
    regine_date: null,
    accNumber: null,
    bankName: '',
    branchAddress: '',
    emp_status: 'active',
    data_access_type:'as_role'
  });

  const [employeeSalary, setEmployeeSalary] = useState({
    salary_type: "",
    salary_amount: "",
  })

  const [additions, setAdditions] = useState([{ addition_typeId: '', addition_typeName: '', addition_amount: '' }]);
  const [deductions, setDeductions] = useState([{ deduction_typeId: '', deduction_typeName: '', deduction_amount: '' }]);
  const [rosterList, setRosterList] = useState([]);
  const [roster, setRoster] = useState({
    roster_id: "",
    roster_employee: []
  });
  const getRoster = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/roster`, { action: "allRosters" })
      .then((res) => {
        setRosterList(res.data.data);
      });
  };

  useEffect(() => {
    getRoster();

  }, []);


  const onSelectRoster = (id) => {
    setRoster({
      ...roster,
      roster_id: id,
    })
  }


  const handleChange = (e) => {
    setEmployee((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setEmployeeSalary((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // handleChangeadditions


  const handleChangeadditions = (index, event) => {
    const { name, value } = event.target;
    setAdditions(prevState => {
      const newAdditions = [...prevState];
      newAdditions[index] = {
        ...newAdditions[index],
        [name]: value,
        ...(name === 'addition_typeId' && { addition_typeName: event.target.options[event.target.selectedIndex].text })
      };
      return newAdditions;
    });
  };

  // const handleAddAdditionField = () => {

  //   let body = { employee_id: params ?? employee_id, action: "addAdditionInfo", add_ded_type: 'additton' };

  //   http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
  //     .then((res) => {
  //       setAdditions([...additions, { addition_id: res?.data?.data, addition_typeId: '', addition_typeName: '', addition_amount: '' }]);
  //     })

  // };

  const handleAddAdditionField = async () => {
    let body = {
      employee_id: params ?? parseInt(employee_id),
      action: "addAdditionInfo",
      add_ded_type: 'additton' // Corrected spelling from 'additton' to 'addition'
    };

    try {
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body);
      const newAddition = {
        addition_id: res?.data?.data,
        addition_typeId: '',
        addition_typeName: '',
        addition_amount: ''
      };
      setAdditions(prevAdditions => [...(prevAdditions || []), newAddition]);
    } catch (error) {
      console.error("Error adding addition field:", error);
      // You might want to handle the error here, e.g., show a notification to the user
    }
  };



  const handleRemoveAdditionField = (index, addition) => {


    let body = { id: addition?.addition_id, action: "deleteSalarySettingsItem" };

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        if (res?.data?.status == 'success') {
          notify("success", `Successfully Remove`);
          setAdditions(additions.filter((_, i) => i !== index));
        }
      })


  };






  const handleChangeDeductions = (index, event) => {
    const { name, value } = event.target;
    setDeductions(prevState => {
      const newDeductions = [...prevState];
      newDeductions[index] = {
        ...newDeductions[index],
        [name]: value,
        ...(name === 'deduction_typeId' && { deduction_typeName: event.target.options[event.target.selectedIndex].text })
      };
      return newDeductions;
    });
  };

  const handleAddDeductionField = async () => {
    let body = {
      employee_id: params ?? parseInt(employee_id),
      action: "addAdditionInfo",
      add_ded_type: 'deduction'
    };

    try {
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body);
      const newDeduction = {
        deduction_id: res?.data?.data,
        deduction_typeId: '',
        deduction_typeName: '',
        deduction_amount: ''
      };
      setDeductions(prevDeductions => [...(prevDeductions || []), newDeduction]);
    } catch (error) {
      console.error("Error adding deduction field:", error);
      // You might want to handle the error here, e.g., show a notification to the user
    }
  };


  const handleRemoveDeductionField = (index, deduction) => {

    // console.log(deduction?.deduction_id)
    let body = { id: deduction?.deduction_id, action: "deleteSalarySettingsItem", add_ded_type: 'deduction' };

    http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        if (res?.data?.status == 'success') {

          notify("success", `Successfully Remove`);
          setDeductions(deductions.filter((_, i) => i !== index));
        }
      })
  };





  const dept_options = getDept?.data;
  const designation_options = getAllDesignation?.data;

  const selected_desig_options = {
    value: employee?.getEmpDetails?.designation?.id,
    label: employee?.getEmpDetails?.designation?.name,
  };
  const selected_dept_options = {
    value: employee?.getEmpDetails?.department?.id,
    label: employee?.getEmpDetails?.department?.name,
  };

  const selected_role_options = {
    value: employee?.getEmpDetails?.user?.role?.id || "",
    label: employee?.getEmpDetails?.user?.role?.title || "select...",
  };
  const selected_country_options = {
    value: employee?.getEmpDetails?.user?.country?.id || "",
    label: employee?.getEmpDetails?.user?.country?.name || "select...",
  };
  const selected_state_options = {
    value: employee?.getEmpDetails?.user?.state?.id || "",
    label: employee?.getEmpDetails?.user?.state?.name || "select...",
  };
  const selected_city_options = {
    value: employee?.getEmpDetails?.user?.city?.id || "",
    label: employee?.getEmpDetails?.user?.city?.name || "select...",
  };

  useEffect(() => {
    getDepartment();
    getDesignation();
    getRoles();
    getAllContries();
    fetchAddAndDeductionType()
  }, []);

  const [additionList, setAdditionList] = useState([])
  const [deductionList, setDeductionList] = useState([])



  const fetchAddAndDeductionType = async () => {
    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/payroll/setting`, {
      action: "getAllAddDeddType",
    })
      .then((res) => {
        if (isSubscribed) {
          const data = res.data?.data || [];

          const additions = data.filter(item => item.type === 'additton');
          const deductions = data.filter(item => item.type === 'deduction');

          setAdditionList(additions);
          setDeductionList(deductions);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!");
      });

    return () => isSubscribed = false;
  };


  async function getDepartment() {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`, {
        action: "getAllDepartments",
      })
      .then((res) => {
        if (isSubscribed) {
          // setEmployee((prev) => ({
          //   ...prev,
          //   getDept: res.data,
          // }));

          setGetDept(res.data)
        }
      });

    return () => (isSubscribed = false);
  }

  async function getDesignation() {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`, {
        action: "getDesignations",
      })
      .then((res) => {
        if (isSubscribed) {
          // setEmployee((prev) => ({
          //   ...prev,
          //   getAllDesignation: res.data,
          // }));

          setGetAllDesignation(res.data)
        }
      });
    return () => (isSubscribed = false);
  }

  async function getRoles() {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/permissions/permission`, {
        action: "getAllRoles",
      })
      .then((res) => {
        if (isSubscribed) {
          // setEmployee((prev) => ({
          //   ...prev,
          //   roles: res.data.data,
          // }));

          setRoles(res.data.data)
        }
      });
    return () => (isSubscribed = false);
  }

  const getUser = () => {
    let isSubscribed = true;
    if (employee?.getEmpDetails?.user_id) {
      if (isSubscribed) {
        setEmployee((prev) => ({
          ...prev,
          is_user: true,
        }));
      }
    }
    return () => (isSubscribed = false);
  };

  useEffect(() => {
    getUser();
  }, [employee?.getEmpDetails?.user_id]);

  const employeeDetails = useCallback(async () => {
    if (!isReady) {
      // console.log("fetching...");
      return;
    }

    if (params === null) {
      setEmployee({})

    } else {
      let isSubscribed = true;
      setLoading(true);

      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
          action: "getEmployeeInfo",
          employee_id: employee_id,
        })
        .then((res) => {
          if (isSubscribed) {
            setEmployee((prev) => ({
              ...prev,
              getEmpDetails: res?.data?.data,
              department_id: res?.data?.data?.department?.id,
              designation_id: res?.data.data?.designation?.id,
              name: res?.data?.data?.name,
              gender: res?.data?.data?.gender,
              salary_type: res?.data?.data?.salary_type,
              salary_amount: res?.data?.data?.salary_amount,
              address: res?.data?.data?.address,
              description: res?.data?.data?.description,
              mobile: res?.data?.data?.mobile,
              email: res?.data?.data?.email,
              role_id: res?.data?.data?.user?.role?.id,
              country_id: res?.data?.data?.user?.country?.id,
              state_id: res?.data?.data?.user?.state?.id,
              city_id: res?.data?.data?.user?.city?.id,
              sector_head: res?.data?.data?.sector_head,
              sector_id: res?.data?.data?.sector_id,
              sector_parent_id: res?.data?.data?.sector_parent_id,
              data_access_type: res?.data?.data?.data_access_type,
              birth_date: res?.data?.data?.birth_date,
              accNumber: res?.data?.data?.acc_number,
              bankName: res?.data?.data?.bank_name,
              branchAddress: res?.data?.data?.branch_address,
              join_date: res?.data?.data?.join_date,
              regine_date: res?.data?.data?.regine_date,
              emp_status: res?.data?.data?.emp_status,
            }));

            setEmployeeSalary((prev) => ({
              ...prev,
              salary_type: res?.data?.data?.salary_type,
              salary_amount: res?.data?.data?.salary_amount,

            }));
            setGetEmpDetails(res?.data?.data)
            setLoading(false);
          }



        })
        .catch((err) => {
          console.log("Something went wrong !");
          setLoading(false);
        });



      return () => (isSubscribed = false);
    }

  }, [params]);
  useEffect(() => {
    employeeDetails();
  }, [params]);




  const getEmployeeAdditionInfo = useCallback(async () => {

    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
        action: "getEmployeeAdditionInfo",
        employee_id: params,
      })
      .then((res) => {
        if (isSubscribed) {

          setAdditions(res.data.data)
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [isReady, params]);
  useEffect(() => {
    getEmployeeAdditionInfo();
  }, [getEmployeeAdditionInfo]);





  const getEmployeeDeductionInfo = useCallback(async () => {
    if (!isReady) {
      // console.log("fetching...");
      return;
    }
    let isSubscribed = true;
    setLoading(true);
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, {
        action: "getEmployeeDeductionInfo",
        employee_id: params,
      })
      .then((res) => {
        if (isSubscribed) {

          setDeductions(res.data.data)
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong !");
        setLoading(false);
      });

    return () => (isSubscribed = false);
  }, [isReady, params]);
  useEffect(() => {
    getEmployeeDeductionInfo();
  }, [getEmployeeDeductionInfo]);




  //get All countries data
  const getAllContries = async () => {
    let isSubscribed = true;
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
        action: "allCountries",
      })
      .then((res) => {
        if (isSubscribed) {
          // setEmployee((prev) => ({
          //   ...prev,
          //   countryData: res.data.data,
          // }));
          setCountryData(res.data.data)
        }
      })
      .catch((err) => { });
    return () => (isSubscribed = false);
  };

  const changeState = (e) => {
    if (e.value) {
      setEmployee((prev) => ({
        ...prev,
        country_id: e.value,
      }));
    }
  };

  useEffect(() => {
    getStateById();
  }, [employee?.country_id]);

  const getStateById = async () => {
    let isSubscribed = true;
    if (employee?.country_id !== null) {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
          action: "getState",
          country_id: employee?.country_id,
        })
        .then((res) => {
          if (isSubscribed) {
            // setEmployee((prev) => ({
            //   ...prev,
            //   stateData: res.data.data,
            // }));
            setStateData(res.data.data)
          }
        })
        .catch((err) => {
          console.log("error state");
        });
    }
    return () => (isSubscribed = false);
  };

  const changeCity = (e) => {
    if (e.value) {
        ((prev) => ({
        ...prev,
        state_id: e.value,
      }));
    }
  };

  const getCityById = async () => {
    let isSubscribed = true;
    if (employee.state_id !== null) {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/location`, {
          action: "getCity",
          state_id: employee?.state_id,
        })
        .then((res) => {
          if (isSubscribed) {
            // setEmployee((prev) => ({
            //   ...prev,
            //   cityData: res.data.data,
            // }));
            setCityData(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => (isSubscribed = false);
  };

  useEffect(() => {
    getCityById();
  }, [employee?.state_id]);

  async function submitForm(e) {
    e.preventDefault();
    // console.log(updateForm ===false)
    // return;
    if (params === null) {
      let body = {
        ...employee,
        // is_user:employee?.is_user,
        roster_id: roster?.roster_id,
        employee_id: employee_id,
        action: "addEmployee",

      };


      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
        .then((res) => {
          // window.sessionStorage.removeItem("emp")
          // window.sessionStorage.removeItem("step")
          notify("success", `create successfully`);
          // router.push("/modules/hrm/employee");
          setParams(res?.data?.data)
        })
        .catch((e) => {
          const msg = e.response?.data?.response;
          notify("warning", msg);
        });
      return;
    } else {
      let body = {
        ...employee,
        action: "updateEmployeeInfo",
        employee_id: params,
      };

      // console.log("body: ",body);
      // return;
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
        .then((res) => {
          notify("success", `Successfully update`);
          // router.push("/modules/hrm/employee");
        })
        .catch((e) => {
          const msg = e.response?.data?.response;

          if (typeof e.response?.data?.response == "string") {
            notify("error", `${e.response?.data?.response}`);
          } else {
            if (msg?.department_id) {
              notify("error", `${msg.department_id.Department_id}`);
            }
            if (msg?.designation_id) {
              notify("error", `${msg.designation_id.Designation_id}`);
            }
            if (msg?.salary_type) {
              notify("error", `${msg.salary_type.Salary_type}`);
            }
            if (msg?.gender) {
              notify("error", `${msg.gender.Gender}`);
            }
            if (msg?.status) {
              notify("error", `${msg.status.Status}`);
            }
            if (msg?.role_id) {
              notify("error", `${msg.role_id?.Role_id}`);
            }
            if (msg?.country_id) {
              notify("error", `${msg.country_id.Country_id}`);
            }
            if (msg?.state_id) {
              notify("error", `${msg.state_id.State_id}`);
            }
            if (msg?.city_id) {
              notify("error", `${msg.city_id.City_id}`);
            }
            // if (msg?.password) {
            //   notify("error", `${msg.password.Password}`);
            // }
          }
        });

    }
  }
  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Employee", link: "/modules/hr/employee" },
    { text: "Edit Employee", link: `/modules/hr/employee/update/[id]` },
  ];

  // start sector and under sector section
  const [submitData, setSubmitData] = useState([]);
  const [sectorLists, setSectorList] = useState([]);
  const accountHead = [
    { label: "Assets", value: "asset" },
    { label: "Liabilities", value: "liability" },
    { label: "Expenses", value: "expenditure" },
    { label: "Revenue", value: "revenue" },
  ];
  const [generalLedger, setGeneralLedger] = useState({
    name: "",
    sector_head: "",
    sector_id: null,
    opening_balance: null,
    balance: null,
    description: "",
    status: 1,
  });

  const SubSectors = ({ sect, dot }) => {
    return (
      <>
        {sect?.children_recursive?.map((subsect, i) => (
          <Fragment key={i}>
            <option value={subsect.id} data_name={subsect.title}>
              {dot}
              {subsect.title}
            </option>
            {subsect?.children_recursive?.length != 0 && (
              <SubSectors sect={subsect} dot={"----" + dot} />
            )}
          </Fragment>
        ))}
      </>
    );
  };


  useEffect(() => {
    setSubmitData({ ...submitData, acctype: "bank" });
  }, []);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const sectorList = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, {
          account_type: employee.sector_head,
          action: "getSubSectors",
        })
        .then((res) => {
          setSectorList(res.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("fetching sector list error", error);
        });
    };
    sectorList();
    return () => controller.abort();
  }, [employee.sector_head]);


  // handleUpdateSalary
  const handleUpdateSalary = async () => {

    let body = {
      ...employeeSalary,
      action: "updateEmployeeSalaryInfo",
      employee_id: params ? params : employee_id,
      additions,
      deductions
    };
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        notify("success", `Successfully update`);
        // router.push("/modules/hrm/employee");
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response?.data?.response}`);
        } else {

          if (msg?.salary_type) {
            notify("error", `${msg.salary_type.Salary_type}`);
          }
          if (msg?.salary_amount) {
            notify("error", `${msg.salary_amount.Salary_amount}`);
          }


        }
      });


  }

  const  handleUserCredential = async ()=>{
    let body = {
      action: "saveUserCredential",
      email:employee?.email,
      data_access_type: employee?.data_access_type,
      password: employee?.password
    };
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, body)
      .then((res) => {
        notify("success", `Successfully update`);
        // router.push("/modules/hrm/employee");
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof e.response?.data?.response == "string") {
          notify("error", `${e.response?.data?.response}`);
        } else {

          if (msg?.salary_type) {
            notify("error", `${msg.salary_type.Salary_type}`);
          }
          if (msg?.salary_amount) {
            notify("error", `${msg.salary_amount.Salary_amount}`);
          }


        }
      });

  }
  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },

  })


  return (
    <>
      <HeadSection title={params === null ? "Create-Employee" : "Update-Employee"} />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}


        <div className="row">
          <div className="col-12 col-md-7 custom-col-md-6">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body border-bottom" style={{ margin: '5px', padding: '5px' }}>
                    <h4 className="card-title" style={{ margin: '5px', padding: '5px' }}>Profile Info</h4>
                  </div>
                  <Form onSubmit={submitForm}>
                    <div className="card-body">
                      <div className="">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Group controlId="formBasicName">
                              <Form.Label className="custom-label-emp">
                                Name <span className="text-danger">*</span>
                                {" "}
                              </Form.Label>
                              <Form.Control
                                className="custom-input-emp"
                                type="text"
                                placeholder="Full Name Here"
                                name="name"
                                onChange={handleChange}
                                value={employee.name}
                                required
                              // style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                              />
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group controlId="validationCustom02" className="mt-4">

                              <LocalizationProvider dateAdapter={AdapterDateFns} >
                                <DatePicker

                                  size={1}
                                  label="Date of Birth"
                                  open={dobOpen}
                                  onClose={() => setDobOpen(false)}
                                  value={employee?.birth_date}
                                  inputFormat="yyyy-MM-dd"
                                  onChange={(event) => {
                                    setEmployee(prev => ({ ...prev, birth_date: event }));
                                    // setHandleValidationErrors(prev => ({
                                    //   ...prev,
                                    //   birth_date_error: false
                                    // }));
                                  }}
                                  //  className="custom-input-emp"

                                  renderInput={(params) =>
                                    <ThemeProvider theme={theme}>
                                      <TextField onClick={() => setDobOpen(true)} fullWidth={true} size='small' {...params} required />
                                    </ThemeProvider>
                                  }
                                />
                              </LocalizationProvider>
                              {/* <div className="text-danger">{handleValidationErrors.birth_date_error && "DoB is required"}</div> */}
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group controlId="formBasicAddress">
                              <Form.Label className="custom-label-emp">
                                {" "}
                                Gender <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <div className="row" style={{ marginTop: '0px' }}>
                                <div className="col-md-10">
                                  <div className="flex-gap align-items-center">
                                    <RadioButton
                                      label="Male"
                                      id="Male"
                                      name="gender"
                                      value="male"
                                      checked={employee.gender == "male"}
                                      onChange={handleChange}
                                    />

                                    <RadioButton
                                      label="Female"
                                      id="Female"
                                      name="gender"
                                      value="female"
                                      checked={employee.gender == "female"}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <Form.Group controlId="formBasicName">
                              <Form.Label className="custom-label-emp">
                                {" "}
                                Mobile <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                className="custom-input-emp"
                                type="number"
                                placeholder="017xx-xxx-xxx"
                                value={employee.mobile}
                                name="mobile"
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>
                          </div>
                          <div className="col-12 col-md-6">
                            <Form.Group controlId="formBasicName" >
                              <Form.Label className="custom-label-emp">
                                Email <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                className="custom-input-emp"

                                type="email"
                                placeholder="example@gmail.com"
                                name="email"
                                value={employee.email}
                                onChange={handleChange}
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className="row  mt-2">
                          <div className="col-12 col-md-4">
                            <Form.Group controlId="formBasicName" >
                              <Form.Label className="custom-label-emp">
                                {" "}
                                Country <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              {/* {employee?.country_id === undefined && (
                                <>
                                  {" "}
                                  <Select2
                                    defaultValue={{
                                      value: "",
                                      label: "loading...",
                                    }}
                                    options={countryData.map(
                                      ({ id, name }) => ({ value: id, label: name })
                                    )}
                                    onChange={changeState}
                                    className="custom-input-emp"
                                  // style={{ fontSize: '12px', height: '32px', marginTop: '0px',marginBottom: '0px' }}

                                  />
                                </>
                              )}
                              {employee?.country_id !== undefined && (
                                <>
                                  {" "}
                                  <Select2
                                    defaultValue={selected_country_options}
                                    options={countryData?.map(
                                      ({ id, name }) => ({ value: id, label: name })
                                    )}
                                    onChange={changeState}
                                    className="custom-input-emp"

                                  />{" "}
                                </>
                              )} */}
                              <select
                                value={employee?.country_id}
                                onChange={(event) => {
                                  setEmployee(prev => ({ ...prev, country_id: event.target.value }));

                                }}
                                className="form-select "
                              >
                                {countryData && countryData.map(({ id, name }) => (
                                  <option key={id} value={id}>
                                    {name}
                                  </option>
                                ))}
                              </select>


                            </Form.Group>
                          </div>
                          <div className="col-12 col-md-4">
                            <Form.Group controlId="formBasicName">
                              <Form.Label className="custom-label-emp">State <span className="text-danger">*</span></Form.Label>
                              {/* {employee?.state_id === undefined && (
                                <>
                                  <Select2
                                    defaultValue={{
                                      value: "",
                                      label: "loading...",
                                    }}
                                    options={stateData?.map(
                                      ({ id, name }) => ({ value: id, label: name })
                                    )}
                                    onChange={changeCity}
                                    className="custom-input-emp"
                                  />
                                </>
                              )}
                              {employee?.state_id !== undefined && (
                                <>
                                  {" "}
                                  <Select2
                                    defaultValue={selected_state_options}
                                    options={stateData?.map(
                                      ({ id, name }) => ({ value: id, label: name })
                                    )}
                                    onChange={changeCity}
                                    className="custom-input-emp"
                                  />
                                </>
                              )} */}

                              <select
                                value={employee?.state_id}
                                onChange={(event) => {
                                  setEmployee(prev => ({ ...prev, state_id: event.target.value }));

                                }}
                                className="form-select "
                              >
                                {stateData && stateData.map(({ id, name }) => (
                                  <option key={id} value={id}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            </Form.Group>
                          </div>
                          <div className="col-12 col-md-4">
                            <Form.Group controlId="formBasicName">
                              <Form.Label className="custom-label-emp">City <span className="text-danger">*</span></Form.Label>
                              {/* {employee?.state_id === undefined && (
                                <>
                                  <Select2
                                    defaultValue={{
                                      value: "",
                                      label: "loading...",
                                    }}
                                    options={cityData?.map(
                                      ({ id, name }) => ({ value: id, label: name })
                                    )}
                                    onChange={(e) =>
                                      setEmployee((prev) => ({
                                        ...prev,
                                        city_id: e.value,
                                      }))
                                    }
                                    className="custom-input-emp"

                                  />{" "}
                                </>
                              )}
                              {employee?.state_id !== undefined && (
                                <>
                                  <Select2
                                    defaultValue={selected_city_options}
                                    options={cityData?.map(
                                      ({ id, name }) => ({ value: id, label: name })
                                    )}
                                    onChange={(e) =>
                                      setEmployee((prev) => ({
                                        ...prev,
                                        city_id: e.value,
                                      }))
                                    }
                                    className="custom-input-emp"

                                  />
                                </>
                              )} */}

                              <select
                                value={employee?.city_id}
                                onChange={(event) => {
                                  setEmployee(prev => ({ ...prev, city_id: event.target.value }));

                                }}
                                className="form-select "
                              >
                                {stateData && stateData.map(({ id, name }) => (
                                  <option key={id} value={id}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            </Form.Group>
                          </div>


                        </div>

                        <div className="row">
                          <div className="col-12 col-md-12">
                            <Form.Group controlId="formBasicAddress" className="mt-1">
                              <Form.Label className="custom-label-emp"> Address <span className="text-danger">*</span>{" "}</Form.Label>
                              <textarea
                                className="form-control"
                                // style={{ height: "80px" }} 
                                placeholder="Address"
                                onChange={handleChange}
                                name="address"
                                value={employee.address}
                              // value={value}
                              // required
                              />
                            </Form.Group>
                          </div>
                        </div>

                      </div>



                    </div>


                    <div className="emp-info border-top mt-5">
                      <div className="card-body border-bottom" style={{ margin: '5px', padding: '5px' }}>
                        <h4 className="card-title" style={{ margin: '5px', padding: '5px' }}>Employee Info</h4>
                      </div>

                      <div className="card-body">
                        <div className="mb-3">
                          <div className="row">
                            <div className="col-12 col-md-4">

                              {/* {employee?.department_id !== undefined && (
                                <>
                                  <Form.Group controlId="formBasicName">
                                    <Form.Label className="custom-label-emp" >Department <span className="text-danger"> *</span>{" "}</Form.Label>
                                    <Select2
                                      className="mb-3"
                                      options={dept_options?.map(({ id, name }) => ({
                                        value: id,
                                        label: name,
                                      }))}
                                      defaultValue={selected_dept_options}
                                      onChange={(e) =>
                                        setEmployee((prev) => ({
                                          ...prev,
                                          department_id: e.value,
                                        }))
                                      }
                                      className="custom-input-emp"
                                    />
                                  </Form.Group>
                                </>
                              )}
                              {employee?.department_id === undefined && (
                                <>
                                  <Form.Group controlId="formBasicName">
                                    <Form.Label className="custom-label-emp" >Department <span className="text-danger"> *</span>{" "}</Form.Label>
                                    <Select2
                                      className="mb-3"
                                      options={dept_options?.map(({ id, name }) => ({
                                        value: id,
                                        label: name,
                                      }))}
                                      defaultValue={{
                                        value: "",
                                        label: "select...",
                                      }}
                                      onChange={(e) =>
                                        setEmployee((prev) => ({
                                          ...prev,
                                          department_id: e.value,
                                        }))
                                      }
                                      className="custom-input-emp"
                                    />
                                  </Form.Group>
                                </>
                              )} */}
                              <Form.Group controlId="formBasicName">
                                <Form.Label className="custom-label-emp"> Department <span className="text-danger">*</span>{" "}</Form.Label>

                                <select
                                  value={employee?.department_id}
                                  onChange={(event) => {
                                    setEmployee(prev => ({ ...prev, department_id: event.target.value }));

                                  }}
                                  className="form-select "
                                >
                                  {dept_options && dept_options.map(({ id, name }) => (
                                    <option key={id} value={id}>
                                      {name}
                                    </option>
                                  ))}
                                </select>
                              </Form.Group>

                            </div>

                            <div className="col-12 col-md-4">

                              {/* {employee?.designation_id !== undefined && (
                                <>
                                  <Form.Group controlId="formBasicName">
                                    <Form.Label className="custom-label-emp">Designation <span className="text-danger">*</span>{" "}
                                    </Form.Label>
                                    <Select2
                                      options={designation_options?.map(
                                        ({ id, name }) => ({ value: id, label: name })
                                      )}
                                      defaultValue={selected_desig_options}
                                      onChange={(e) =>
                                        setEmployee((prev) => ({
                                          ...prev,
                                          designation_id: e.value,
                                        }))
                                      }
                                      className="custom-input-emp"
                                    />
                                  </Form.Group>
                                </>
                              )}

                              {employee?.designation_id === undefined && (
                                <>
                                  <Form.Group controlId="formBasicName">
                                    <Form.Label className="custom-label-emp">Designation <span className="text-danger">*</span>{" "}
                                    </Form.Label>
                                    <Select2
                                      options={designation_options?.map(
                                        ({ id, name }) => ({ value: id, label: name })
                                      )}
                                      defaultValue={{
                                        value: "",
                                        label: "select...",
                                      }}
                                      onChange={(e) =>
                                        setEmployee((prev) => ({
                                          ...prev,
                                          designation_id: e.value,
                                        }))
                                      }
                                      className="custom-input-emp"
                                    />
                                  </Form.Group>
                                </>
                              )} */}
                              <Form.Group controlId="formBasicName">
                                <Form.Label className="custom-label-emp"> Designation <span className="text-danger">*</span>{" "}</Form.Label>
                                <select
                                  value={employee?.designation_id}
                                  onChange={(event) => {
                                    setEmployee(prev => ({ ...prev, designation_id: event.target.value }));

                                  }}
                                  className="form-select "
                                >
                                  {designation_options && designation_options.map(({ id, name }) => (
                                    <option key={id} value={id}>
                                      {name}
                                    </option>
                                  ))}
                                </select>
                              </Form.Group>
                            </div>
                            <div className="col-12 col-md-4">
                              <Form.Group controlId="formBasicName">
                                <Form.Label className="custom-label-emp"> Role <span className="text-danger">*</span>{" "}</Form.Label>
                                {/* {employee?.role_id === undefined && (
                                  <>
                                    {" "}
                                    <Select2
                                      defaultValue={{
                                        value: "",
                                        label: "select...",
                                      }}
                                      options={
                                        roles &&
                                        roles.map(({ id, title }) => ({
                                          value: id,
                                          label: title,
                                        }))
                                      }
                                      onChange={(e) =>
                                        setEmployee((prev) => ({
                                          ...prev,
                                          role_id: e.value,
                                        }))
                                      }
                                      className="custom-input-emp"
                                    />
                                  </>
                                )}
                                {employee?.role_id !== undefined && (
                                  <>
                                    {" "}
                                    <Select2
                                      defaultValue={selected_role_options}
                                      options={
                                        roles &&
                                        roles.map(({ id, title }) => ({
                                          value: id,
                                          label: title,
                                        }))
                                      }
                                      onChange={(e) =>
                                        setEmployee((prev) => ({
                                          ...prev,
                                          role_id: e.value,
                                        }))
                                      }
                                      className="custom-input-emp"
                                    />
                                  </>
                                )} */}


                                <select
                                  value={employee?.role_id}
                                  onChange={(event) => {
                                    setEmployee(prev => ({ ...prev, role_id: event.target.value }));

                                  }}
                                  className="form-select "
                                >
                                  {roles && roles.map(({ id, title }) => (
                                    <option key={id} value={id}>
                                      {title}
                                    </option>
                                  ))}
                                </select>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row mt-2">

                            <div className="col-md-4 col-12">
                              <Form.Group controlId="formBasicName" className='mb-3 mt-2'>
                                <Form.Label className="custom-label-emp">Roster<span className="text-danger">*</span></Form.Label>
                                {/* <Select2
                                  options={rosterList && rosterList.map(({ id, name, start_date, end_date }) => ({
                                    value: id,
                                    label:
                                      name + "    " + "(" + (start_date + "   -  " + end_date) + ")",

                                  }))}
                                  onChange={(e) => { onSelectRoster(e.value); }}
                                  className="custom-input-emp"
                                /> */}

                                <select
                                  value={employee?.roster}
                                  onChange={(e) => onSelectRoster(e.target.value)}
                                  className="form-select "
                                >
                                  {rosterList && rosterList.map(({ id, name, start_date, end_date }) => (
                                    <option key={id} value={id}>
                                      {name} ({start_date} - {end_date})
                                    </option>
                                  ))}
                                </select>

                              </Form.Group>
                            </div>
                            <div className="col-md-4 col-12">
                              <Form.Group >
                                <Form.Label className="custom-label-emp">
                                  Sector Head<span className="text-danger">*</span>
                                </Form.Label>

                                <Select2
                                  options={accountHead?.map(({ label, value }) => ({
                                    value: value,
                                    label: label,
                                    name: "sector_head",
                                  }))}
                                  value={accountHead.find(option => option.value === employee.sector_head)}
                                  onChange={(e) => {
                                    setEmployee((prev) => ({
                                      ...prev,
                                      sector_head: e?.value,
                                    }));
                                  }}
                                  // required
                                  // disabled={true}
                                  className="custom-input-emp"
                                />
                              </Form.Group>
                            </div>
                            {updateForm  &&

                            <div className="col-md-4 col-12">
                              <Form.Group className="mb-3" >
                                <Form.Label className="custom-label-emp">
                                  Under Sector<span className="text-danger">*</span>
                                </Form.Label>

                                {loading ? (
                                  <Select>
                                    <option value="">loading...</option>
                                  </Select>
                                ) : (
                                  <Select
                                    onChange={(e) => {
                                      setEmployee((prev) => ({
                                        ...prev,
                                        sector_parent_id: e?.target?.value,
                                      }));
                                    }}
                                    value={employee.sector_id}
                                    disabled
                                  >
                                    <option value="0">none</option>
                                    {sectorLists &&
                                      sectorLists?.map((sect, ind) => (
                                        <Fragment key={ind}>
                                          <option value={sect.id}>{sect.title}</option>
                                          {sect?.children_recursive?.length != 0 && (
                                            <SubSectors sect={sect} dot="----" />
                                          )}
                                        </Fragment>
                                      ))}
                                  </Select>
                                )}
                              </Form.Group>
                            </div>
                            } 
                          </div>


                          <div className="row  mt-1">
                            <div className="col-12 col-md-4">
                              <Form.Group md="10" controlId="validationCustom02" >
                                <Form.Label>Bank Name</Form.Label>
                                <Form.Control
                                  required
                                  name="bankName"
                                  type="text"
                                  placeholder="Bank Name"
                                  defaultValue={employee.bankName}
                                  onChange={handleChange}
                                // onBlur={validateForm}
                                
                                />

                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-4">
                              <Form.Group md="10" controlId="validationCustom01">
                                <Form.Label>Account Number</Form.Label>
                                <Form.Control
                                  required
                                  name="accNumber"
                                  type="text"
                                  placeholder="Account Number"
                                  defaultValue={employee.accNumber}
                                  onChange={handleChange}
                                // onBlur={validateForm}

                                />

                              </Form.Group>
                            </div>

                            <div className="col-12 col-md-4">
                              <Form.Group md="10" controlId="validationCustom01" >
                                <Form.Label>Branch Address</Form.Label>
                                <Form.Control
                                  required
                                  name="branchAddress"
                                  type="text"
                                  className="mb-3"
                                  // onBlur={validateForm}
                                  defaultValue={employee.branchAddress}
                                  onChange={handleChange}
                                  placeholder="Branch Address"
                                />

                              </Form.Group>
                            </div>
                          </div>
                          <div className="row  mt-2 mb-4">
                            <div className="col-12 col-md-4 mt-4">
                              <Form.Group md="10" controlId="validationCustom02">

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    size={1}
                                    label="Joining Date"
                                    open={joinDateOpen}
                                    onClose={() => setJoinDateOpen(false)}
                                    value={employee?.join_date}
                                    inputFormat="yyyy-MM-dd"
                                    onChange={(event) => {
                                      // setCustomer(prev => ({ ...prev, join_date: event }));
                                      setEmployee(prev => ({ ...prev, join_date: event }));


                                    }}
                                    renderInput={(params) =>
                                      <ThemeProvider theme={theme}>
                                        <TextField onClick={() => setJoinDateOpen(true)} fullWidth={true} size='small' {...params} required />
                                      </ThemeProvider>
                                    }
                                  />
                                </LocalizationProvider>

                              </Form.Group>

                            </div>

                            {
                              updateForm === 'true' &&
                              (<div className="col-12 col-md-4 mt-4">
                              <Form.Group md="10" controlId="validationCustom02">

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DatePicker
                                    size={1}
                                    label="Resign Date"
                                    open={regineDateOpen}
                                    onClose={() => setRegieDateOpen(false)}
                                    value={employee?.regine_date}
                                    inputFormat="yyyy-MM-dd"
                                    onChange={(event) => {
                                      // setCustomer(prev => ({ ...prev, join_date: event }));
                                      setEmployee(prev => ({ ...prev, regine_date: event }));


                                    }}
                                    renderInput={(params) =>
                                      <ThemeProvider theme={theme}>
                                        <TextField onClick={() => setRegieDateOpen(true)} fullWidth={true} size='small' {...params} />
                                      </ThemeProvider>
                                    }
                                  />
                                </LocalizationProvider>

                              </Form.Group>

                            </div>
                            )
                            
                            }

                            <div className="col-12 col-md-4">

                              <Form.Group md="10" controlId="validationCustom02" >
                                <Form.Label>Employee Status</Form.Label>
                                <select value={employee?.emp_status} onChange={handleChange} name="emp_status" className="form-select" >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>

                              </Form.Group>
                            </div>


                          </div>
                          <div className="row">
                            <div className="col-md-12 col-12">
                              <Form.Group controlId="formBasicAddress">
                                <Form.Label className="custom-label-emp">
                                  {" "}
                                  Description <span className="text-danger">
                                    *
                                  </span>{" "}
                                </Form.Label>

                                <textarea
                                  className="form-control mb-2"
                                  // style={{ height: "150px" }} 
                                  placeholder="Description..."
                                  onChange={handleChange}
                                  name="description"
                                  value={employee.description}
                                // required
                                />
                              </Form.Group>
                            </div>

                          </div>
                        </div>


                        {/* <div className="border-top mt-2 pt-3">
                          <div className="text-end">
                            <button onClick={handleUpdateSalary} className="btn-info">Update</button>
                           
                          </div>
                        </div>
                         */
                          //   <div className="border-top mt-2 pt-3">
                          //   <div className="text-end">
                          //     <button onClick={handleUpdateSalary} className="btn-info">Update Salary</button>

                          //   </div>
                          // </div>



                        }
                      </div>
                    </div>
                    <div className="p-3">

                      <div className="text-end">
                        {/* <Button className="btn-info">
                          {params === null ? 'Create' : 'Update'}

                        </Button> */}

                        <button className="btn-primary" style={{ padding: '5px 30px', fontSize: '15px' }}>{params === null ? 'Create' : 'Update'}</button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>

            </div>
          </div>
          <div className="col-12 col-md-5 custom-col-md-6">
            <div className="row">
              <div className="col-12">
                <div className="card ">

                  {/* <div className="card-body border-bottom" style={{ margin: '5px', padding: '5px' }}>
                    <h4 className="card-title" style={{ margin: '5px', padding: '5px' }}>Employee Info</h4>
                  </div> */}

                  <div className="d-flex border-bottom title-part-padding align-items-center" style={{ margin: '5px', padding: '5px' }}>
                    <div>
                      <h4 className="card-title" style={{ margin: '5px', padding: '5px' }}>USER CREDENTIALS</h4>
                    </div>
                    <div className="ms-auto flex-shrink-0">
                      {/* <div className="d-flex align-items-center">
                        <h6 className="mb-0 mr-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>Is user</h6>
                        <div className="form-check form-switch ml-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            name="is_user"
                            onChange={() =>
                              setEmployee((prev) => ({
                                ...prev,
                                is_user: !employee.is_user,
                              }))
                            }
                            checked={employee.is_user}
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>




                  <div className="card-body">
                    <div className="container">
                      <div className={`${employee.is_user ? "" : "d-none"}`}>
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Group controlId="formBasicName" >
                              <Form.Label>
                                {" "}
                                Username <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                className="mb-3"
                                type="text"
                                placeholder="Your email "
                                name="Username"
                                // disabled={employee.user_defined_password}
                                defaultValue={employee.email}
                                // value={employee.email}
                                disabled={true}
                              // onChange={handleChange}
                              // required
                              />
                            </Form.Group>
                          </div>

                          <div className="col-md-4">
                            <Form.Group controlId="formBasicName" >
                              <Form.Label>
                                {" "}
                                Password <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                className="mb-3"
                                type="text"
                                placeholder="Type 8-character "
                                name="password"
                                // disabled={employee.user_defined_password}
                                onChange={handleChange}
                              // required
                              />
                            </Form.Group>
                          </div>
                          <div className="col-md-4">

                            <Form.Group md="10" controlId="validationCustom02" >
                              <Form.Label>Data Access Type</Form.Label>
                              <select value={employee.data_access_type} onChange={handleChange} name="data_access_type" className="form-select" >
                                <option value="as_role">As role</option>
                                <option value="own">Own</option>
                              </select>
                              <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                                Please provide role
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>



                          <div className="border-top mt-2 pt-3">
                            <div className="text-end">
                              <button className="btn-primary" style={{ padding: '5px 25px', fontSize: '15px' }} onClick={handleUserCredential} >
                                {params === null ? 'Create' : 'Update'}

                              </button>
                              {/* <Button onClick={handleUpdateSalary} className="btn-info">Update</Button> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card ">

                  <div className="card-body border-bottom" style={{ margin: '5px', padding: '5px' }}>
                    <h4 className="card-title" style={{ margin: '5px', padding: '5px' }}>Salary Info</h4>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group controlId="formBasicName">
                          <Form.Label >
                            {" "}
                            Salary Type <span className="text-danger">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Select
                            value={employee?.salary_type || ""}
                            name="salary_type"
                            onChange={handleChange}
                          //  className="custom-input-emp"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                          </Select>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group controlId="formBasicName" >
                          <Form.Label>
                            {" "}
                            Salary Amount(Basic) <span className="text-danger">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Form.Control
                            className="mb-3"
                            type="number"
                            placeholder="Salary Amount"
                            name="salary_amount"
                            onChange={handleChange}
                            value={employee.salary_amount}
                            required
                          />
                        </Form.Group>
                      </div>
                    </div>



                    <div>
                      {loading ? (
                        <div className="text-center my-5">
                          <PropagateLoading />
                        </div>
                      ) : (
                        <>
                          <div className="border-top mt-4 px-3 py-2 mb-3" >
                            <div className="row align-items-center border-bottom">
                              <div className="col">
                                <h4 className="card-title mt-1 pt-1" style={{ fontSize: '13px' }}>Addition</h4>
                              </div>
                              <div className="col text-end">
                                <button
                                  className="btn btn-primary"
                                  onClick={handleAddAdditionField}
                                  style={{ padding: '2px 30px', fontSize: '12px' }}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                            {additions?.map((addition, index) => (
                              <div className="row  mt-2" key={index}>
                                <div className="col-md-6">
                                  <Form.Group controlId={`formBasicName-${index}`}>
                                    <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Additions Type</Form.Label>
                                    <Form.Select
                                      value={addition.addition_typeId}
                                      name="addition_typeId"
                                      onChange={(e) => handleChangeadditions(index, e)}
                                      style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                    >
                                      <option value=''>None</option>
                                      {additionList.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                </div>
                                <div className="col-md-4">
                                  <Form.Group controlId={`formBasicAmount-${index}`}>
                                    <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Amount</Form.Label>
                                    <Form.Control
                                      type="number"
                                      placeholder="Amount"
                                      name="addition_amount"
                                      onChange={(e) => handleChangeadditions(index, e)}
                                      value={addition.addition_amount}
                                      style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                      required
                                    />
                                  </Form.Group>
                                </div>
                                <div className="col-md-2 align-items-end" style={{ marginTop: '30px' }}>
                                  {/* <button className="btn btn-danger" style={{ padding: '2px 30px', fontSize: '12px' }} onClick={() => handleRemoveAdditionField(index, addition)}>
                                    Remove
                                  </button> */}

                                  <button className="btn btn-danger" style={{ padding: '2px 30px', fontSize: '12px', marginLeft: '-6px' }} onClick={() => handleRemoveAdditionField(index, addition)}>
                                    <DeleteIcon />
                                  </button>

                                  {/* <a href="#" onClick={() => handleRemoveAdditionField(index, addition)} className='text-danger'>
                                    <DeleteIcon className='text-danger' />
                                  </a> */}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>


                      )}

                    </div>




                    {loading ? (
                      <div className="text-center my-5">
                        <PropagateLoading />
                      </div>
                    ) : (
                      <>
                        <div className="border-top mt-4 px-3 py-2 ">
                          <div className="row align-items-center border-bottom mt-2">
                            <div className="col">
                              <h4 className="card-title mt-1 pt-1" style={{ fontSize: '13px' }}>Deduction</h4>
                            </div>
                            <div className="col text-end">
                              <button
                                className="btn btn-primary"
                                onClick={handleAddDeductionField}
                                style={{ padding: '2px 30px', fontSize: '12px' }}
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          {deductions?.map((deduction, index) => (
                            <div className="row mt-2" key={index}>
                              <div className="col-md-6">
                                <Form.Group controlId={`formBasicName-${index}`}>
                                  <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Deductions Type</Form.Label>
                                  <Form.Select
                                    value={deduction.deduction_typeId}
                                    name="deduction_typeId"
                                    onChange={(e) => handleChangeDeductions(index, e)}
                                    style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                  >
                                    <option value=''>None</option>
                                    {deductionList.map((item) => (
                                      <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </div>
                              <div className="col-md-4">
                                <Form.Group controlId={`formBasicAmount-${index}`}>
                                  <Form.Label style={{ fontSize: '13px', marginBottom: '5px' }}>Amount</Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="Amount"
                                    name="deduction_amount"
                                    onChange={(e) => handleChangeDeductions(index, e)}
                                    value={deduction.deduction_amount}
                                    style={{ fontSize: '12px', height: '30px', marginTop: '0px' }}
                                    required
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-md-2 align-items-end" style={{ marginTop: '30px' }}>
                                {/* <button className="btn btn-danger" style={{ padding: '2px 30px', fontSize: '12px' }} onClick={() => handleRemoveDeductionField(index, deduction)}>
                                  Remove
                                </button> */}

                                <button className="btn btn-danger" style={{ padding: '2px 30px', fontSize: '12px', marginLeft: '-6px' }} onClick={() => handleRemoveDeductionField(index, deduction)}>
                                  <DeleteIcon />
                                </button>

                              </div>
                            </div>
                          ))}
                        </div>
                      </>

                    )}
                    <div className="border-top mt-4 pt-3">
                      <div className="text-end">
                        {/* <button disabled={params === null} onClick={handleUpdateSalary} variant={params === null ? 'secondary' : 'info'} >
                          {params === null ? 'Create' : 'Update Salary'}

                        </button> */}



                        <button
                          onClick={handleUpdateSalary}
                          className="btn-primary"
                          style={{ padding: '5px 25px', fontSize: '15px' }}
                        >
                          {data === '' ? 'Create' : 'Update'}
                        </button>
                        {/* <Button onClick={handleUpdateSalary} className="btn-info">Update</Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
