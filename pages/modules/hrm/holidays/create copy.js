import React, { useState } from "react";
import Button from '../../../../components/elements/Button';
import { Form } from "react-bootstrap";
import Label from '../../../../components/elements/Label';
import Option from '../../../../components/elements/Option';
import RadioButton from '../../../../components/elements/RadioButton';
import Select2 from '../../../../components/elements/Select2';
import TextInput from '../../../../components/elements/TextInput';
import MyComponent from '../../../../components/elements/Select2';
import Axios from '../../../../utils/axios';
import { useRouter } from 'next/router';
import toast from "../../../../components/Toast/index";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { TextField } from '@mui/material';
import Breadcrumbs from "../../../../components/Breadcrumbs";

const AddHoliday = () => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDesc] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState("");
  const [openDate, setOpenDate] = useState(false);

  const options = [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' }
  ];


  async function submitForm(e) {
    e.preventDefault();
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "create", title, type, description, year, date })
      .then((res) => {
        notify("success", "successfully Added!");
        router.push('/modules/hrm/holidays');
      }).catch((e) => {
        const msg = e.response.data.response;
        if (typeof (e.response.data.response) == 'string') {
          notify("error", `${e.response.data.response}`);
        }
        else {
          if (msg.title) {
            notify("error", `${msg.title.Title}`);
          }
          if (msg.type) {
            notify("error", `${msg.type.Type}`);
          }
          if (msg.description) {
            notify("error", `${msg.description.Description}`);
          }
          if (msg.year) {
            notify("error", `${msg.year.Year}`);
          }
          if (msg.date) {
            notify("error", `${msg.date.Date}`);
          }
        }
      });
  }


  const theme = createTheme({

    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "" },
        },
      },
    },

  })


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Holidays', link: '/modules/hr/holidays' },
    { text: 'Add Holidays', link: '/modules/hr/holidays/create' },
  ];

  return (

    <>
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Add Holiday</h4>
              </div>

              <Form onSubmit={submitForm}>
                <div className="card-body">

                  <div className="row container">
                    <div className="col-md-6">
                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Title of Holiday <span className="text-danger">*</span> </Form.Label>
                        <Form.Control
                          className="mb-3"
                          type="text"
                          placeholder="Title of Holiday"
                          name="name"
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="mb-3"
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicName"  >
                        <Form.Label> Select Year <span className="text-danger">*</span> </Form.Label>
                        <Select2 className="select-bg" options={options} onChange={(department) => setYear(department.value)} />
                      </Form.Group>


                      <Form.Group controlId="formBasicAddress" className="mt-2">
                        <Form.Label> Description  </Form.Label>


                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Description"
                          onChange={(e) => setDesc(e.target.value)}
                          name="description"
                        // value={value}
                        // required
                        />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Type of Holiday <span className="text-danger">*</span> </Form.Label>
                        <Form.Control
                          className="mb-3"
                          type="text"
                          placeholder="Type of Holiday"
                          name="name"
                          onChange={(e) => setType(e.target.value)}
                          required
                          className="mb-3"
                        />
                      </Form.Group>


                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Date <span className="text-danger">*</span> </Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            required
                            size={1}
                            label="Enter the date"
                            open={openDate}
                            onClose={() => setOpenDate(false)}
                            value={date}
                            inputFormat="yyyy-MM-dd"
                            onChange={(event) => {
                              setDate(format(new Date(event), 'yyyy-MM-dd'));
                            }}
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

                </div>
                <div className="p-3 border-top">
                  <div className="text-end">
                    <Button className="btn-info">
                      Save
                    </Button>

                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddHoliday;