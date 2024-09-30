import React, { useState, useEffect } from "react";
import Button from '../../../../components/elements/Button';
// import Form from '../../../../components/elements/Form';
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
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import format from 'date-fns/format';
import Breadcrumbs from "../../../../components/Breadcrumbs";

const AddLeaveApplication = () => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);


  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selectionn",
    },
  ]);

  var startDate = format(dates[0].startDate, "MM/dd/yyyy");
  var endDate = format(dates[0].endDate, "MM/dd/yyyy");

  //console.log(format(dates[0].startDate,"MM/dd/yyyy")+" To "+ format(dates[0].endDate,"MM/dd/yyyy"));

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [date, setDate] = useState([]);
  const [subject, setSubject] = useState("");
  const [leave_category, setLeavecategory] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDesc] = useState("");
  const [getLeaveCategories, setLeaveCategories] = useState("");
  const leaveCategory_options = getLeaveCategories.data;

  const options = [
    { value: 'Single Day', label: 'Single Day' },
    { value: 'Half Day', label: 'Half Day' },
    { value: 'Multiple Day', label: 'Multiple Day' }
  ];

  useEffect(() => {
    const controller = new AbortController();
    async function getLeavecategories() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "getAllLeaveCategories", })
        .then((res) => {
          setLeaveCategories(res.data);
        });
    }
    getLeavecategories()
    return () => controller.abort();
  }, [leave_category])

  async function submitForm(e) {
    e.preventDefault();
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "createLeaveApplication", subject, description, leave_category, duration, date, startDate, endDate })
      .then((res) => {
        notify("success", "successfully Added!");
        router.push('/modules/hrm/leave-application');
      }).catch((e) => {

        const msg = e.response.data.response;

        if (typeof (e.response.data.response) == 'string') {
          notify("error", `${e.response.data.response}`);
        }
        else {
          if (msg?.subject) {
            notify("error", `${msg.subject.selectionnubject}`);
          }
          if (msg?.leave_category) {
            notify("error", `${msg.leave_category.Leave_category}`);
          }
        }
      });
  }

  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'New Application', link: '/modules/hr/leaveApplications/addLeaveApplication' },
  ];

  return (

    <>
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Add Leave-Application</h4>
              </div>

              <Form onSubmit={submitForm}>
                <div className="card-body">


                  <div className="row container">
                    <div className="col-md-6">

                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Subject Of Leave Application <span className="text-danger">*</span> </Form.Label>
                        <Form.Control
                          className="mb-3"
                          type="text"
                          placeholder="Subject Of Leave Application"
                          // name="name"
                          onChange={(e) => setSubject(e.target.value)}
                          // required
                          className="mb-3"
                        />
                      </Form.Group>







                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Select Duration <span className="text-danger">*</span> </Form.Label>
                        <Select2 options={options} onChange={(options) => setDuration(options.value)} />
                      </Form.Group>

                      <div className={`${(duration == 'Single Day') ? '' : (duration == 'Half Day') ? '' : 'd-none'}`}>
                        <Form.Group controlId="formBasicName" >
                          <Form.Label> Date <span className="text-danger">*</span> </Form.Label>
                          <input type="date" onChange={(e) => setDate(e.target.value)} className="form-control" id="date" />
                        </Form.Group>

                      </div>




                      <div className={`${(duration == 'Multiple Day') ? '' : 'd-none'}`}>
                        <Form.Group controlId="formBasicName" >
                          <Form.Label> Select Date Range <span className="text-danger">*</span> </Form.Label>
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setDates([item.selectionn])}
                            moveRangeOnFirstSelection={false}
                            ranges={dates}
                            className="date"
                            minDate={new Date()}
                          />
                        </Form.Group>

                      </div>




                    </div>

                    <div className="col-md-6">

                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Select Leave Category <span className="text-danger">*</span> </Form.Label>
                        <Select2
                          options={leaveCategory_options?.map(({ id, title }) => ({ value: id, label: title }))}
                          onChange={(e) =>
                            setLeavecategory(e.value)
                          }
                        />
                      </Form.Group>
                      <Form.Group controlId="formBasicAddress">
                        <Form.Label> Description <span className="text-danger">*</span> </Form.Label>


                        <textarea
                          className="form-control"
                          style={{ height: "150px" }} // Adjust the height as needed
                          placeholder="Description..."
                          onChange={(e) => setDesc(e.target.value)}
                          name="description"
                        // value={value}
                        // required
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

export default AddLeaveApplication;