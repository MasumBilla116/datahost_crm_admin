import React, { useEffect, useState } from "react";
import Button from '../../../../../../components/elements/Button';
import { Form } from "react-bootstrap";
import Label from '../../../../../../components/elements/Label';
import Option from '../../../../../../components/elements/Option';
import RadioButton from '../../../../../../components/elements/RadioButton';
import Select2 from '../../../../../../components/elements/Select2';
import TextInput from '../../../../../../components/elements/TextInput';
import MyComponent from '../../../../../../components/elements/Select2';
import HeadSection from '../../../../../../components/HeadSection';
import Axios from '../../../../../../utils/axios';
import { useRouter } from 'next/router';
import toast from "../../../../../../components/Toast/index";
import Breadcrumbs from "../../../../../../components/Breadcrumbs";

const EditLeave = () => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [status, setStatus] = useState();

  useEffect(() => {
    const getLeave = async () => {
      setLoading(true);
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "getLeaveCategoryInfo", leave_id: id })
      setTitle(res.data.data.title);
      setDesc(res.data.data.description);
      setStatus(res.data.data.status);
      setLoading(false);
    }
    router.isReady && getLeave()
  }, [id])

  async function submitForm(e) {
    e.preventDefault();
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "editLeaveCategory", leave_id: id, title, description, status })
      .then((res) => {
        notify("success", "successfully Updated Leave Category!");
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

  if (loading)
    return (
      <>
        <HeadSection title="Edit-Leave-Category" />
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
          { text: 'All Leave-Category', link: '/modules/hr/leaveCategories' },
          { text: 'View Leave-Category', link: `/modules/hr/leaveCategories/update/[id]` }
      ]

  return (

    <>
      <div className="container-fluid ">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body border-bottom">
                <h4 className="card-title">Edit Leave-Category</h4>
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
                          value={title}
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
                          value={description}
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

export default EditLeave;