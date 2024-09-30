import React, { useState, useCallback, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Axios from "../../../../../../utils/axios";
import Switch from "react-switch";
import toast from "../../../../../../components/Toast/index";
import HomePageBasic from "../../../../../../components/updatePages/HomePageBasic";
import HomePagePremium from "../../../../../../components/updatePages/HomePagePremium";
import { Label, Select2, TextInput, HeadSection, RadioButton } from "../../../../../../components";
import { useRouter } from 'next/router';
import Router from 'next/router'
import Select from "../../../../../../components/elements/Select";




const Update = ({ submit, changeHandler, status, setStatus, submitData, values }) => {

  const { http } = Axios();
  const router = useRouter()
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { isReady, query: { id } } = router;

  const [selectedPage, setSelectedPage] = useState("");
  const [pageData, setPageData] = useState(
    {
      page_name: "",
      menu_id: null,
      template_id: null,
      prevData: {}
    });



  const getPageInfo = useCallback(async () => {


    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/page`, { action: "getPageInfo", id: id }
    ).then((res) => {
      let data = res?.data?.data;

      setSelectedPage(data?.template?.title);
      setPageData(prev => ({
        ...prev,
        prevData: data,
        page_name: data.page_name,
        template_id: data.template_id,
        menu_id: data.menu_id
      }));


    }).catch((err) => console.log(err))
  }, [isReady, id]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getPageInfo();
    });
    return () => clearTimeout(timeout);
  }, [isReady, id]);

  const submitForm = async (template_data) => {

    template_data.template_id = pageData.template_id;
    template_data.menu_id = pageData.menu_id;
    template_data.page_name = pageData.page_name;
    template_data.action = "editPage";
    if (pageData.template_id == '') {
      notify("error", "Please Select Template");
      return
    }
    if (pageData.menu_id == '') {
      notify("error", "Please Select Menu");
      return
    }
    if (pageData.page_name == '') {
      notify("error", "Page title is required");
      return
    }
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/page`, template_data)
      .then((res) => {
        notify("success", "successfully Added!");
        // this.forceUpdate()
        // Router.reload(window.location.pathname)
        router.push('/modules/website-configuration/pageCreation')

        // let data = {...pageData};
        // data.template_id = ""; 
        // data.menu_id = ""; 
        // data.page_name = ""; 
        // setSelectedPage("");
        // setPageData(data);
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.name) {
            notify("error", `${msg.name.Name}`);
          }

        }
      });

  }

  return (
    <>
      <div className="card shadow p-3">
        <Form noValidate validated={true} onSubmit={submit}>
          <div className="card-body border-bottom ">
            <h4 className="card-title fw-bolder">Update New Page</h4>
          </div>
          <div className="card-body mb-5">

            <div className='row'>

              <div className='col-md-3'>
                <Form.Group controlId="formBasicName" className='mb-3'>
                  <Form.Label>Menus</Form.Label>
                  <Select disabled>
                    <option selected>{pageData.prevData?.menu?.title}</option>
                  </Select>

                </Form.Group>
              </div>

              <div className='col-md-3'>
                <Form.Group controlId="formBasicName" className='mb-3'>
                  <Form.Label>Template</Form.Label>
                  <Select disabled>
                    <option selected>{pageData.prevData?.template?.title}</option>
                  </Select>
                </Form.Group>
              </div>

              <div className='col-md-6'>
                <Form.Label className="">
                  Page Title <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  name="page_name"
                  value={pageData.page_name}
                  onChange={(e) => setPageData(prev => ({ ...prev, page_name: e.target.value }))}
                  required
                />
              </div>
            </div>

          </div>
        </Form>
        {(() => {
          if (selectedPage == "Home Page Basic") {
            return (
              <HomePageBasic onSubmit={submitForm} pageDetails={pageData?.prevData} />
            )
          } else if (selectedPage == "Home Page Premium") {
            return (
              <HomePagePremium onSubmit={submitForm} />
            )
          }

        })()}


      </div>
    </>
  )
}


export default Update
