import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import toast from '../../components/Toast/index';
import Axios from "../../utils/axios";
import MyPagination from "../MyPagination";
import PropagateLoading from "../PropagateLoading";

const MRI_Uploader=({onSubmitUploads,selectLoading})=>{

    const {http} = Axios();
    const ref = useRef();
  
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
      }, []);
  
    const [image, setImage] = useState([]);
  
     // image onchange hander
    const handleChange = (e) => {
      const imagesArray = [];
  
      for (let i = 0; i < e.target.files.length; i++) {
        fileValidate(e.target.files[i]);
        imagesArray.push(e.target.files[i]);
      }
     setImage(imagesArray);
    };
  
  
      const [pending, setPending] = useState(false);
      // submit handler
      const onUpload=async(e)=> {
        e.preventDefault();
  
        const data = new FormData();
        data.append("action", "imageUpload");
  
        for (let i = 0; i < image.length; i++) {
          data.append("image[]", image[i]);
        }
  
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/uploader/upload`,data)
        .then((res)=>{
          
          if(isSubscribed){
            notify("success", "successfully Added!");
            ref.current.value = "";
              
            get_uploads_files();
            setPending(false);
  
          }
    
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
           setPending(false);
        });
    
        return ()=>isSubscribed=false;
      }
  
    // file validation
    const fileValidate = (file) => {
      if (
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg"
      ) {
        return true;
      } else {
        notify("error", "File type allowed only jpg, png, jpeg!");
        return false;
      }
    };
  
  
    //Fetch All Uploaded Files
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const get_uploads_files = useCallback(async ()=>{
      let isSubscribed = true;
      setLoading(true)
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/uploader/upload`,{action: "getAllUploadedFiles" })
      .then((res)=>{
        if(isSubscribed){
          setImages(res.data.data)
          setLoading(false)
         }
      })
      .catch((err)=>{
        console.log('Something went wrong !')
        setLoading(false)
      });
  
      return ()=> isSubscribed=false;
  
    },[]);
  
    useEffect(()=>{
      get_uploads_files();
    },[get_uploads_files])
  
  
    const [upload_ids, setUploadIds] = useState();
  
    const storeUploadIds=(Ids)=>{
      setUploadIds(Ids);
    }
  
  
  
    return(
      <>
    <div className="container-fluid">
  
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="border-bottom title-part-padding">
              
            <Form onSubmit={onUpload}>
              <Form.Group as={Row}>
                <Col md={10}>
  
                  <input type="file" className="form-control" onChange={handleChange} multiple ref={ref} />
                  
                </Col>
  
                <Col md={2}>
                  <Button variant="primary" disabled={pending} className="shadow rounded" type="submit"block>
                    upload
                  </Button>
                </Col>
              </Form.Group>
            </Form>
  
            </div>
            <div className="card-body text-center">
  
            {loading && <PropagateLoading/>}
  
              {/* <hr/> */}
  
  
            <Form>
             
                {
                  !loading &&  <MyPagination submit={storeUploadIds}  Items={images} />
                }
              
                {/* <hr/> */}
  
                <Button variant="danger" className="shadow rounded mb-3"
                  style={{  float:"right" }}
                  type="button"  
                  onClick={()=>onSubmitUploads(upload_ids)}
                  
                >
                 {selectLoading ? 'processing...' : 'select'}
                </Button>
             
            </Form>
  
  
            </div>
          </div>
        </div>
      </div>
  
    </div>
    </>
    );
  }

export default MRI_Uploader;