import { classNames } from 'react-select/dist/declarations/src/utils';
import React, { useState, useCallback, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Axios from "../../../../../../utils/axios";
import Switch from "react-switch";
import toast from "../../../../../../components/Toast/index";
import HomePageBasic from "../../../../../../components/pages/HomePageBasic";
import HomePagePremium from "../../../../../../components/pages/HomePagePremium";
import { Label, Select2, TextInput, HeadSection, RadioButton } from "../../../../../../components";
import { useRouter } from 'next/router';
import Router from 'next/router'



const Create = ({ submit, changeHandler, status, setStatus, submitData, values }) => {
 
  const { http } = Axios();
  const router = useRouter()
  const notify = React.useCallback((type, message) => {
      toast({ type, message });
  }, []);
 

  const [templateList, setTemplateList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [pageData, setPagedata] = useState({page_name:"", menu_id:"", template_id:""});
  const page = [
    {
      name:"Home Page Basic"
    },
    {
      name:"Home Page Premium"
    }
  ]
  const onSelectTemplate =(e)=>{
    let template = templateList.find(template => template.id == e.value);
    let data = {...pageData};
    data.template_id = e.value; 
    setPagedata(data);
    setSelectedPage(template.title);
  };
  const onSelectMenu =(e)=>{
    let data = {...pageData};
    data.menu_id = e.value;
    setPagedata(data); 
  };
  const getTemplate = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/template`,{action: "getAllTemplates"})
    .then((res)=>{
      setTemplateList(res.data.data);
    });
  };
  
  const getMenus = async () => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/menu`,{action: "getAllMenus"})
    .then((res)=>{
      setMenuList(res.data.data);
    });
  };
  const varOne = "343453"
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getTemplate();
      getMenus();
    });
    return () => clearTimeout(timeout);
}, []);

const submitForm = async(template_data)=> {
  template_data.template_id = pageData.template_id;
  template_data.menu_id = pageData.menu_id;
  template_data.page_name = pageData.page_name;
  template_data.action = "createPage";
  console.log(template_data);
  if(pageData.template_id == ''){
    notify("error", "Please Select Template");
    return
  } 
  if(pageData.menu_id == ''){
    notify("error", "Please Select Menu");
    return
  } 
  if(pageData.page_name == ''){
    notify("error", "Page title is required");
    return
  } 
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/page`,template_data)
  .then((res)=>{
      notify("success", "successfully Added!");
      // this.forceUpdate()
      // Router.reload(window.location.pathname)
      router.push('/modules/website-configuration/pageCreation')
      
      // let data = {...pageData};
      // data.template_id = ""; 
      // data.menu_id = ""; 
      // data.page_name = ""; 
      // setSelectedPage("");
      // setPagedata(data);
  })
  .catch((e)=>{
    const msg = e.response?.data?.response;

     if(typeof(msg) == 'string'){
      notify("error", `${msg}`);
     }
     else{
      if(msg?.name){
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
            <h4 className="card-title fw-bolder">Create New Page</h4>
          </div>
          <div className="card-body mb-5">
  
            <div className='row'>

              <div className='col-md-3'>
                <Form.Group controlId="formBasicName" className='mb-3'>
                  <Form.Label>Menus</Form.Label>
                  <Select2
                    options={menuList && menuList.map(({ id, title }) => ({ value: id, label: title}))}
                    // onChange={onSelectMenu}
                    onChange={(e) =>setPagedata(prev=>({...prev, menu_id:e.value}))}
                  />
                </Form.Group>
              </div>

              <div className='col-md-3'>
                <Form.Group controlId="formBasicName" className='mb-3'>
                  <Form.Label>Template</Form.Label>
                  <Select2
                    options={templateList && templateList.map(({ id, title }) => ({ value: id, label: title}))}
                    // onChange={(e) =>setPagedata(prev=>({...prev, template_id:e.value}))}
                    onChange={onSelectTemplate}
                  />
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
                    onChange={(e) =>setPagedata(prev=>({...prev, page_name:e.target.value}))}
                    required
                  />
              </div>
            </div>

          </div>
        </Form>
          {(() => {
            if (selectedPage == "Home Page Basic") {
              return (
                <HomePageBasic onSubmit={submitForm}/>
              )
            } else if (selectedPage == "Home Page Premium") {
              return (
                <HomePagePremium varOne={varOne}/>
              )
            } 
          })()}
      </div>
    </>
  )
}

 
export default Create
