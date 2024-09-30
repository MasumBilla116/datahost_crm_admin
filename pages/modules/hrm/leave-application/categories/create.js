import React, { useState } from "react";
import Button from '../../../../../components/elements/Button';
// import Form from '../../../../components/elements/Form';
import { useRouter } from 'next/router';
import { Form } from "react-bootstrap";
import toast from "../../../../../components/Toast/index";
import Axios from '../../../../../utils/axios';


const AddLeaveCategory = () => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [status, setStatus] = useState("");


  async function submitForm(e) {
    console.log("submit form")
    e.preventDefault();
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "createLeaveCategory", title, description })
      .then((res) => {
        notify("success", "successfully Added!");
        router.push('/modules/hrm/leave-application/categories');
      }).catch((e) => {

        const msg = e.response.data.response;

        if (typeof (e.response.data.response) == 'string') {
          notify("error", `${e.response.data.response}`);
        }
        else {
          if (msg.title) {
            notify("error", `${msg.title.Title}`);
          }
          if (msg.description) {
            notify("error", `${msg.description.Description}`);
          }
        }
      });
  }


  // //breadcrumbs
  // const breadcrumbs = [
  //   { text: 'Dashboard', link: '/dashboard' },
  //   { text: 'All Leave-Categories', link: '/modules/hr/leaveCategories' },
  //   { text: 'Add Leave-Categories', link: '/modules/hr/leaveCategories/create' },
  // ];

  return (

    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-10">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Add Leave-Category</h4>
              </div>

              <Form onSubmit={submitForm}>
                <div className="card-body">

                  <div className="row container">
                    <div className="col-md-8">
                      <Form.Group controlId="formBasicName" >
                        <Form.Label> Title Of Leave Category <span className="text-danger">*</span> </Form.Label>
                        <Form.Control
                          className="mb-3"
                          type="text"
                          placeholder="Title Of Leave Category"
                          name="name"
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="mb-3"
                        />
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

                    <div className="col-md-3">


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

export default AddLeaveCategory;