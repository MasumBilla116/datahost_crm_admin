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

const AddCategoryForm = ({ onSubmit }) => {

  const {http} = Axios();

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState();
  const [categories, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false)

  const CategoryParentId = (Item) =>{
		setParentId(Item);
	}

  useEffect(() => {
    categoryList()
}, []);

const categoryList = async () => {
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,{action: "getSubCategories"})
  .then((res)=>{
    setCategoryList(res.data.data);
    setLoading(false);
  });
};

  let formData = new FormData(); 

  formData.append('action', "createCategory");
  formData.append('name', name);
  formData.append('parentId', parentId);
  formData.append('description', description)
  formData.append('status', status)


  return (
    <Form >
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Category Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDesc" >
          <Form.Label>Select Parent</Form.Label>
          {loading ? (
            <Select onChange={(e) => setParentId(e.target.value)}>
              <option value="">loading...</option>
            </Select>
          ) : (
            <Select onChange={(e) => setParentId(e.target.value)}>
            <option value="0">none</option>
            {categories &&
            categories?.map((cat,ind)=>(
             <>
              <option value={cat.id}>{cat.name}</option>
              {cat?.children_recursive?.length != 0 && (
                <SubCategories cat={cat} dot='----' />
              )} 
            </>
            ))
            }
          </Select>
          )}

      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Description </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Check 
          type="switch"
          id="custom-switch"
          label="Check this switch"
          onChange={(e) => setStatus(e.target.value)}
      />
      </Form.Group>

      <Button disabled={loading} variant="info" style={{ marginTop: "5px", marginLeft: "40%" }} type="button" onClick={()=>onSubmit(formData)} block>
        Add
      </Button>
    </Form>
  );
};


const EditCategoryForm = ({ onSubmit, id }) => {

  const {http} = Axios();

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState();
  const [categories, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false)

  let formData = new FormData(); 

  formData.append('action', "editCategory");
  formData.append('category_id', id);
  formData.append('name', name);
  formData.append('parentId', parentId);
  formData.append('description', description);
  formData.append('status', status);

  useEffect(()=>{
    const getCategory = async () =>{
      const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,{action: " ",category_id: id})
      setName(res.data.data.name);
      setParentId(res.data.data.parent_id);
      setDescription(res.data.data.description);
      setStatus(res.data.data.status);
      console.log(res.data.data.name)
    }
    const categoryList = async () => {
      setLoading(true);
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,{action: "getSubCategories"})
      .then((res)=>{
        setCategoryList(res.data.data);
        setLoading(false);
      });
    };
    getCategory()
    categoryList()
  },[id])

  return (
    <Form >
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Category Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Category Name"
          defaultValue={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDesc" >
          <Form.Label>Select Parent</Form.Label>
          {loading ? (
            <Select onChange={(e) => setParentId(e.target.value)}>
              <option value="">loading...</option>
            </Select>
          ) : (
            <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="0">none</option>
            {categories &&
            categories?.map((cat,ind)=>(
             <>
              <option value={cat.id}>{cat.name}</option>
              {cat?.children_recursive?.length != 0 && (
                <SubCategories cat={cat} dot='----' />
              )} 
            </>
            ))
            }
          </Select>
          )}

      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Description"
          defaultValue={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Button disabled={loading} variant="info" style={{ marginTop: "5px", marginLeft: "40%" }} type="button" onClick={()=>onSubmit(formData)} block>
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
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,{action: "getAllCategories"})
  .then((res)=>{
    setCategoryList(res.data.data);
    setLoading(false);
  });
};

const submitForm=async(items)=> {
  let isSubscribed = true;
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,items)
  .then((res)=>{
    if(isSubscribed){
      notify("success", "successfully Added!");
      handleClose();
      setLoading(false);
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
  });

  categoryList();

  return ()=>isSubscribed=false;
}

const editForm=async(items)=> {
  console.log(items)
  let isSubscribed = true;
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,items)
  .then((res)=>{
    if(isSubscribed){
      notify("success", "successfully Updated!");
      handleEditClose();
      setLoading(false);
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
  });

  categoryList();

  return ()=>isSubscribed=false;
}

 async function deleteCategory(id)
 {
  setLoading(true);
  await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/inventory/category`,{action: "deleteCategory", category_id: id})
    .then((res)=>{
      notify("success", "successfully has been deleted!");
      setLoading(false);
    });
    categoryList()
 }

  if (loading)
    return (
      <>
        <HeadSection title="All-Inventory-Categories" />

        <TablePlaceholder header_name="All-Inventory-Categories"/>
        
      </>
    );

  return (
    <>
      <HeadSection title="All-Inventory-Categories" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="border-bottom title-part-padding">
                <h4 className="card-title mb-0">All Inventory-Categories</h4>
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

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <AddCategoryForm onSubmit={submitForm}/>
                  </Modal.Body>
                </Modal>

                <Modal show={edit} onHide={handleEditClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditCategoryForm onSubmit={editForm} id={categoryId}/>
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
                        <th>Total Items</th>
                        <th>Status</th>
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
                            <td>{category.items.length}</td>
                            <td>{category.status == 1 ? 'Active' : 'Inactive'}</td>
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