import React, { useEffect, useState } from "react";
import Button from '../../../../components/elements/Button';
// import Form from '../../../../components/elements/Form';
import format from 'date-fns/format';
import { useRouter } from 'next/router';
import { Form } from "react-bootstrap";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import toast from "../../../../components/Toast/index";
import Select2 from '../../../../components/elements/Select2';
import Axios from '../../../../utils/axios';
import { HeadSection } from "../../../../components";

const AddEmployeesLeave = () => {
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

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;
  const [date, setDate] = useState([]);
  const [leave_category, setLeavecategory] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDesc] = useState("");
  const [getLeaveCategories, setLeaveCategories] = useState("");
  const [getAllEmployees, setEmployees] = useState("");
  const leaveCategory_options = getLeaveCategories.data;
  const employees_options = getAllEmployees.data;

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

    async function getEmployees() {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "allEmployee", })
        .then((res) => {
          setEmployees(res.data);
        });
    }

    getLeavecategories();
    getEmployees();
    return () => controller.abort();

  }, [leave_category, employee_id])

  async function submitForm(e) {
    e.preventDefault();
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "createEmployeeLeaves", description, employee_id, leave_category, duration, date, startDate, endDate })
      .then((res) => {
        notify("success", "successfully Added!");
        router.push('/modules/hrm/leave-application');
      }).catch((e) => {

        const msg = e.response.data.response;

        if (typeof (e.response.data.response) == 'string') {
          notify("error", `${e.response.data.response}`);
        }
        else {
          if (msg.subject) {
            notify("error", `${msg.subject.subject}`);
          }
          if (msg.leave_category) {
            notify("error", `${msg.leave_category.leave_category}`);
          }
        }
      });
  }


  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'Add Leave', link: '/modules/hr/leaveApplications/addEmployeesLeave' },
  ];

  return (

    <>
    <HeadSection title="Add leave" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12 p-xs-2">
            <div className="card mb-xs-1">
              <div className="card-body border-bottom">
                <h4 className="card-title">Add Employees-Leave</h4>
              </div>

              <Form onSubmit={submitForm}>
                <div className="card-body">


                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Select Employee <span className="text-danger">*</span> </Form.Label>
                        <Select2
                          options={employees_options?.map(({ id, name }) => ({ value: id, label: name }))}
                          onChange={(e) =>
                            setEmployeeId(e.value)
                          }
                        />
                      </Form.Group>


                      <Form.Group controlId="formBasicAddress">
                        <Form.Label> Description </Form.Label>


                        <textarea
                          className="form-control"
                          style={{ height: "80px" }}
                          placeholder="Description..."
                          onChange={(e) => setDesc(e.target.value)}
                          name="description"
                        // value={value}
                        // required
                        />
                      </Form.Group>

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




                      <Form.Group controlId="formBasicName" >
                        <Form.Label>Select Duration <span className="text-danger">*</span> </Form.Label>
                        <Select2 options={options} onChange={(options) => setDuration(options.value)} />
                      </Form.Group>




                      <div className={`${(duration == 'Single Day') ? '' : (duration == 'Half Day') ? '' : 'd-none'}`}>
                        <Form.Group controlId="formBasicName" >
                          <Form.Label>Date <span className="text-danger">*</span> </Form.Label>
                          <input type="date" onChange={(e) => setDate(e.target.value)} className="form-control" id="date" />
                        </Form.Group>
                      </div>

                      <div className={`${(duration == 'Multiple Day') ? '' : 'd-none'}`}>
                        <Form.Group controlId="formBasicName" >
                          <Form.Label>Select Date Range <span className="text-danger">*</span> </Form.Label>
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
                  </div>


                </div>
                <div className="p-3 border-top">
                  <div className="text-end">
                    <Button className="btn-info me-4">
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

export default AddEmployeesLeave;