import React, { useEffect, useState } from "react";
import HeadSection from '../../../../components/HeadSection';
import TablePlaceholder from '../../../../components/placeholder/TablePlaceholder';
import Link  from 'next/link';
import ViewIcon from '../../../../components/elements/ViewIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Axios from '../../../../utils/axios';
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import Label from '../../../../components/elements/Label';
import Select2 from '../../../../components/elements/Select2';
import Select from '../../../../components/elements/Select';
import moment from 'moment';
import toast from "../../../../components/Toast/index";
import { Modal, Button, Form } from "react-bootstrap";
import SubCategories from '../../../../components/inventory_category/SubCategories';

const AddCategoryForm = ({ onSubmit, validated }) => {

  const {http} = Axios();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false)

  let formData = new FormData(); 

  formData.append('action', "createCategory");
  formData.append('name', name);
  formData.append('description', description)

  return (
    <Form validated={validated}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Category Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5} 
            placeholder="Enter Description"
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
        </Form.Group>

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={()=>onSubmit(formData)} block>
        Create
      </Button>
    </Form>
  );
};


const EditCategoryForm = ({ onSubmit, id, validated }) => {

  const {http} = Axios();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false)

  let formData = new FormData(); 

  formData.append('action', "editCategory");
  formData.append('category_id', id);
  formData.append('name', name);
  formData.append('description', description);

  useEffect(()=>{
    const getCategoryInfo = async () =>{
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`,{action: "getCategoryInfo",category_id: id})
      setName(res.data.data.name);
      setDescription(res.data.data.description);
      console.log(res.data.data.name)
    }
    getCategoryInfo()
  },[id])

  return (
    <Form validated={validated}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Category Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Category Name"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5} 
            placeholder="Enter Description"
            name='description'
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
        </Form.Group>

      <Button variant="primary" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px" }} type="button" onClick={()=>onSubmit(formData)} block>
        Update
      </Button>
    </Form>
  );
};



export default function TableList() {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const {http} = Axios();

  const [categories, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState("");

  //Form validation
  const [validated, setValidated] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [edit, setEdit] = useState(false);
  const handleEditClose = () => setEdit(false);
  const handleEdit = (id) => {
    setEdit(true);
    setCategoryId(id);
  }

  useEffect(() => {
    $("#multi_col_order").DataTable();
  });

  useEffect(() => {
    categoryList()
}, []);

const categoryList = async () => {
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`,{action: "getAllCategories"})
  .then((res)=>{
    setCategoryList(res.data.data);
    setLoading(false);
  });
};

const submitForm=async(items)=> {
  let isSubscribed = true;
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`,items)
  .then((res)=>{
    if(isSubscribed){
      notify("success", "successfully Added!");
      handleClose();
      setLoading(false);
      setValidated(false);
    }
  }).catch((e)=>{

    const msg = e.response.data.response;
     if(typeof(e.response.data.response) == 'string'){
      notify("error", `${e.response.data.response}`);
     }
     else{
      if(msg?.name){
        notify("error", `${msg.name.Name}`);
      }
     }
     setValidated(true);
  });

  categoryList();

  return ()=>isSubscribed=false;
}

const editForm=async(items)=> {
  let isSubscribed = true;
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`,items)
  .then((res)=>{
    if(isSubscribed){
      notify("success", "successfully Updated!");
      handleEditClose();
      setLoading(false);
      setValidated(false);
    }
  }).catch((e)=>{

    const msg = e.response.data.response;

     if(typeof(e.response.data.response) == 'string'){
      notify("error", `${e.response.data.response}`);
     }
     else{
      if(msg.name){
        notify("error", `${msg.name.Name}`);
      }
     }
     setValidated(true);
  });

  categoryList();

  return ()=>isSubscribed=false;
}

 async function deleteCategory(id)
 {
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`,{action: "deleteCategory", category_id: id})
    .then((res)=>{
      notify("success", "successfully has been deleted!");
      setLoading(false);
    });
    categoryList()
 }

  if (loading)
    return (
      <>
        <HeadSection title="All-Restaurant-Categories" />

        <TablePlaceholder header_name="All-Restaurant-Categories"/>
        
      </>
    );

  return (
    <>
      <HeadSection title="All-Restaurant-Categories" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Restaurant-Categories</h4>
              </div>
              <div className="ms-auto flex-shrink-0" style={{marginRight: '50px', marginTop: '10px'}}>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Add Category
                </Button>

                <Modal dialogClassName="modal-lg" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <AddCategoryForm onSubmit={submitForm} validated={validated} />
                  </Modal.Body>
                </Modal>

                <Modal dialogClassName="modal-lg" show={edit} onHide={handleEditClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditCategoryForm onSubmit={editForm} id={categoryId} validated={validated} />
                  </Modal.Body>
                </Modal>
              </div>
              <div className="card-body">
                
                <div className="table-responsive">
                  <table
                    id="multi_col_order"
                    className="table table-striped table-bordered display"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Total Foods</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories &&
                        categories.map((category, index) => (
                          <tr key={index}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>10</td>
                            <td>{category.creator.name}</td>
                            <td>{moment(category.created_at).format('DD-MM-YYYY')}</td>
                            <td>
                              <ul className="action">
                              <li>
                                <Link href="#">
                                  <a onClick={()=>handleEdit(category.id)}>
                                    <EditIcon />
                                  </a>
                                </Link>
                              </li>
                                <li>
                                  <Link href='#'>
                                    <a onClick={() => deleteCategory(category.id)}>
                                      <DeleteIcon />
                                    </a>
                                  </Link>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}