import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import FileSelectButton from "../MRIfileManager/FileSelectButton";
import MRI_Uploader from "../MRIfileManager/MRI_Uploader";
import MRIfileManagerRender from "../RenderMethods/MRIfileManagerRender";

const Biographical = ({ formData, setFormData, validateForm,handleValidationErrors,setHandleValidationErrors  }) => {

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



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,

    });

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

    setFormData(prev => ({
      ...prev, upload_ids: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setFormData(prev => ({
      ...prev, upload_files: newList
    }))

  }



  return (
    <>

      <div className=" p-3">
        <div className="card-body border-bottom ">
          <h4 className="card-title fw-bolder"> Biographical Information</h4>
        </div>
        <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData} render={(show, handleClose, uploadIds, selecteLoading, handleShow, files) => (<>


          {/* MRI_Uploader Modal Form */}
          <Modal dialogClassName="modal-xlg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>File Uploader</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <MRI_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading} />

            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
          </Modal>

          <Form noValidate>
            <div className="card-body">
              <div className="row ">
                <div className="col-md-6">
                  <Form.Group md="10" controlId="validationCustom02" className="mt-5">

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        size={1}
                        label="Date of Birth"
                        open={dobOpen}
                        onClose={() => setDobOpen(false)}
                        value={formData?.birth_date}
                        inputFormat="yyyy-MM-dd"
                        onChange={(event) => {
                          setFormData(prev => ({ ...prev, birth_date: event }));
                          setHandleValidationErrors(prev => ({
                            ...prev,
                            birth_date_error: false
                          }));
                        }}
                        renderInput={(params) =>
                          <ThemeProvider theme={theme}>
                            <TextField onClick={() => setDobOpen(true)} fullWidth={true} size='small' {...params} required />
                          </ThemeProvider>
                        }
                      />
                    </LocalizationProvider>
                    <div className="text-danger">{handleValidationErrors.birth_date_error && "DoB is required"}</div>
                  </Form.Group>

                  <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                    <Form.Label>Marital Status</Form.Label>
                    <select name="maritalStatus" onChange={handleChange} className="form-select" value={formData.maritalStatus}>
                      {/* <option selected>January 2021</option> */}
                      <option value="Single">Single</option>
                      <option value="married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Other">Other</option>
                    </select>
                    <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                      Please provide a mobile number.
                    </Form.Control.Feedback>
                  </Form.Group>


                  <Form.Group md="10" controlId="validationCustom02" className="mt-3" >
                    <Form.Label>City of Residence</Form.Label>
                    <select name="cityResidence"  onChange={handleChange} className="form-select" value={formData.cityResidence}>
                      {/* <option selected>January 2021</option> */}
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                      Please provide a mobile number.
                    </Form.Control.Feedback>
                  </Form.Group>



                  {/* Choose File Button */}
                  <FileSelectButton handleShow={handleShow} files={formData} removePhoto={removePhoto} />
                  {/* End choose file button */}

                </div>
                <div className="col-md-6">
                  <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                    <Form.Label>Gender</Form.Label>
                    <select name="gender" onChange={handleChange} className="form-select" value={formData.gender}>
                      {/* <option selected>January 2021</option> */}
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">other</option>
                    </select>
                    <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                      Please provide a mobile number.
                    </Form.Control.Feedback>
                  </Form.Group>



                  <Form.Group md="10" className="mt-3" controlId="validationCustom01">
                    <Form.Label>Work in City</Form.Label>
                    <Form.Control
                      required
                      name="workInCity"
                      type="text"
                      placeholder="Work in City"
                      value={formData.workInCity}
                      onChange={handleChange}
                    // onBlur={validateForm}
                    />
                    <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                      Please provide a name.
                    </Form.Control.Feedback>
                  </Form.Group>


                  <Form.Group md="10" controlId="validationCustom02" className="mt-3">
                    <Form.Label>Work Permit</Form.Label>
                    <select name="workPermit"  onChange={handleChange} className="form-select" value={formData.workPermit}>
                      {/* <option selected>January 2021</option> */}
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                      Please provide a mobile number.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

              </div>
            </div>
          </Form>

        </>)} />
      </div>
    </>
  );
};

export default Biographical;
