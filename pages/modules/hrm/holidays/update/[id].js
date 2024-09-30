import React, { useEffect, useState } from "react";
import Button from '../../../../../components/elements/Button';
// import Form from '../../../../../components/elements/Form';
import { Form } from "react-bootstrap";
import Label from '../../../../../components/elements/Label';
import Option from '../../../../../components/elements/Option';
import RadioButton from '../../../../../components/elements/RadioButton';
import Select2 from '../../../../../components/elements/Select2';
import TextInput from '../../../../../components/elements/TextInput';
import MyComponent from '../../../../../components/elements/Select2';
import HeadSection from '../../../../../components/HeadSection';
import Axios from '../../../../../utils/axios';
import { useRouter } from 'next/router';
import toast from "../../../../../components/Toast/index";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

const EditHoliday = () => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDesc] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getHoliday = async () => {
      setLoading(true);
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "getHolidayInfo", holiday_id: id })
      setTitle(res.data.data.title);
      setType(res.data.data.type);
      setDesc(res.data.data.description);
      setYear(res.data.data.year);
      setDate(res.data.data.date);
      setStatus(res.data.data.status);
      setLoading(false);
    }
    getHoliday()
  }, [id])

  const options = [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' }
  ];

  const selected_options = { value: year, label: year };



  async function submitForm(e) {
    e.preventDefault();
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "editHoliday", holiday_id: id, title, type, description, year, date, status })
      .then((res) => {
        notify("success", "successfully Updated holiday!");
        router.push('/modules/hrm/holidays');
      });
  }


  if (loading)
    return (
      <>
        <HeadSection title="Edit-Holiday" />
        <div className="container-fluid d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );


        //breadcrumbs
        const breadcrumbs = [
          { text: 'Dashboard', link: '/dashboard' },
          { text: 'All Holiday', link: '/modules/hr/holidays' },
          { text: 'Edit Holiday', link: `/modules/hr/holidays/update/[id]` }
      ]

  return (

    <>
      <div className="container-fluid ">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Edit Holiday</h4>
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
                          value={title}
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Select Year <span className="text-danger">*</span> </Form.Label>
                        <Select2 options={options} value={selected_options} onChange={(options) => setYear(options.value)} />
                      </Form.Group>


                      <Form.Group controlId="formBasicAddress" className="mt-2">
                        <Form.Label> Description  </Form.Label>


                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDesc(e.target.value)}
                          name="description"

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
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          required
                          className="mb-3"
                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Date <span className="text-danger">*</span> </Form.Label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="form-control"
                          id="date"
                        />
                      </Form.Group>

                    </div>
                  </div>

                </div>
                <div className="p-3 border-top">
                  <div className="text-end">
                    <Button className="btn-info">
                      Save
                    </Button>

                    <Button className="btn-dark">
                      Cancel
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

export default EditHoliday;