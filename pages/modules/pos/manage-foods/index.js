import MyToast from "@mdrakibul8001/toastify";
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { HeadSection } from '../../../../components';
import FileSelectButton from '../../../../components/MRIfileManager/FileSelectButton';
import MRI_Uploader from '../../../../components/MRIfileManager/MRI_Uploader';
import MRIfileManagerRender from '../../../../components/RenderMethods/MRIfileManagerRender';
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Select from '../../../../components/elements/Select';
import ActiveCurrency from '../../../../components/ActiveCurrency';
import Axios from '../../../../utils/axios';
import { getSSRProps } from "../../../../utils/getSSRProps";
import FoodCategories from '../categories';
import FoodMenuType from '../menu-types';
import themeContext from "../../../../components/context/themeContext";

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.rstrnt.fd",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const [food, setFood] = useState({
    restaurant_category_id: null,
    restaurant_menu_type_id: null,
    restaurant_promo_offer_id: null,
    name: "",
    price: null,
    vat: null,
    image: null,
    upload_files: [],
    note: "",
    components: "",
    description: "",
  })



  const [categories, setCategoryList] = useState([]);
  const [menuTypes, setMenuTypes] = useState([]);
  const [promoOffers, setPromoOffers] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [pending, setPending] = useState(false)

  const [inputVal, setInputVal] = useState([]);

  const [variant, setVariant] = useState([]);

  const nameRef = React.useRef(null);
  const priceRef = React.useRef(null);
  const vatRef = React.useRef(null);

  const [vName, setVName] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [vVat, setVVat] = useState("");

  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);

  const handleChange = (e) => {
    setFood(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }

    setFood(prev => ({
      ...prev, upload_files: filesArr
    }))
  }

  //function set selected files ids
  const setIds = (Ids) => {

    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setFood(prev => ({
      ...prev, image: arr
    }))

  };

  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setFood(prev => ({
      ...prev, image: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setFood(prev => ({
      ...prev, upload_files: newList
    }))

  }
  // End File manager section

  useEffect(() => {
    categoryList();
    menuTypeList();
    promoList();
    taxList();
  }, []);

  const categoryList = async () => {
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, { action: "getAllCategories" })
      .then((res) => {
        setCategoryList(res.data.data);
        setPending(false);
      });
  };

  const menuTypeList = async () => {
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/menu-type`, { action: "getAllMenutypes" })
      .then((res) => {
        setMenuTypes(res.data.data);
        setPending(false);
      });
  };

  const promoList = async () => {
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, { action: "getAllPromos" })
      .then((res) => {
        setPromoOffers(res.data.data);
        setPending(false);
      });
  };

  const taxList = async () => {
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, { action: "getAllTax" })
      .then((res) => {
        setTaxes(res.data.data);
        setPending(false);
      });
  };

  const [ind, setInd] = useState(1)

  function variantChange() {
    setInd(() => ind + 1)

    setInputVal([...inputVal,
    {
      id: ind,
      input: InputForm(ind)
    }
    ])
  }

  const handleSave = (e) => {
    if (nameRef.current.value == null) {
      notify("error", "can not add same item!");
    }
    setVariant([...variant,
    { id: ind, name: nameRef.current.value, price: priceRef.current.value, vat: vatRef.current.value }
    ])
    setInputVal([]);
  }

  const [objedit, setObjEdit] = useState(false);
  const [editId, setEditId] = useState();

  function editobj(index, editId) {
    setObjEdit(true)
    setEditId(editId)
    setVName(variant[index]?.name)
    setVPrice(variant[index]?.price)
    setVVat(variant[index]?.vat)
  }

  const UpdateData = (e) => {
    //e.preventDefault();

    const newState = variant.map(obj => {
      if (obj.id === editId) {
        return { ...obj, name: nameRef.current.value, price: priceRef.current.value, vat: vatRef.current.value };
      }
      return obj;
    });

    setVariant(newState);

    setObjEdit(false)
  }

  async function removeObjectFromArray(id) {
    setInputVal(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );
    setVariant(currentLevel =>
      currentLevel.filter(objLevel => {
        return objLevel.id !== id;
      }),
    );
  };

  const InputForm = (no) => {
    return (
      <>
        <div className="form-group">
          <h4 for="memberName">Variant No: {no}</h4>



          <Form.Group controlId="formBasicEmail">
            <Form.Label>Variant Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Variant Name"
              name='vName'
              ref={nameRef}
              required
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Price Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Variant Price"
                  name='vPrice'
                  ref={priceRef}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail mb-3">
                <Form.Label>Vat Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Variant Vat"
                  name='vVat'
                  ref={vatRef}
                />
              </Form.Group>
            </div>
          </div>

          <Link href='#'>
            <a className="btn btn-primary" onClick={handleSave}>
              Add
            </a>
          </Link>
        </div>
      </>
    )
  }

  let dataset = { ...food, variant, action: "createFood" }

  return (

    //wrap this MRIfileManagerRender component where you want to integrate file-manager. Make sure exist setIds function.
    <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData} render={(show, handleClose, uploadIds, selecteLoading, handleShow, files) => (<>

      {/* MRI_Uploader Modal Form */}
      <Modal dialogClassName="modal-xlg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>File Uploader</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <MRI_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading} />

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
      {/* End MRI_Uploader Modal Form */}

      <Form validated={validated}>

        <div className="row ">
          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Category</Form.Label>
              {loading ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={food.restaurant_category_id} name="restaurant_category_id" onChange={handleChange}>
                  <option value="0">none</option>
                  {categories &&
                    categories?.map((cat, ind) => (
                      <>
                        <option value={cat.id}>{cat.name}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Food Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Food Name"
                name='name'
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Components</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Food Components"
                name='components'
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Menu Type</Form.Label>
              {loading ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={food.restaurant_menu_type_id} name="restaurant_menu_type_id" onChange={handleChange}>
                  <option value="0">none</option>
                  {menuTypes &&
                    menuTypes?.map((menu, ind) => (
                      <>
                        <option value={menu.id}>{menu.name}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Unit Price"
                name='price'
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Food Note"
                name='note'
                onChange={handleChange}
              />
            </Form.Group>

          </div>

        </div> 
        {/* Choose File Button */}
        <FileSelectButton handleShow={handleShow} files={food} removePhoto={removePhoto} />
        {/* End choose file button */}

        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-2" controlId="formBasicDesc" >
              <Form.Label>Select Promo Offer</Form.Label>
              {loading ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select name="restaurant_promo_offer_id" onChange={handleChange}>
                  <option value="0">none</option>
                  {promoOffers &&
                    promoOffers?.map((promo, ind) => (
                      <>
                        <option value={promo.id}>{promo.name}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group className="mb-2" controlId="formBasicDesc" >
              <Form.Label>Select Tax</Form.Label>
              {loading ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select name="vat" onChange={handleChange}>
                  <option value="0">none</option>
                  {taxes &&
                    taxes?.map((tax, ind) => (
                      <>
                        <option value={tax.id}>{tax.name} ({tax.tax}%)</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
          </div>
        </div>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='description'
            onChange={handleChange}
          />
        </Form.Group>

        {variant != "" &&
          <>
            <div className="border-bottom title-part-padding">
              <h4 className="card-title mb-0">All Variants</h4>
            </div>
            <table
              id="multi_col_order"
              className="table table-striped table-bordered display"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Vat</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {variant?.map((item, index) => (
                  <>
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.vat}</td>
                      <td>
                        <ul className="action">
                          <li>
                            <Link href="#">
                              <a onClick={() => editobj(index, item.id)}>
                                <EditIcon />
                              </a>
                            </Link>
                          </li>
                          <li>
                            <Link href='#'>
                              <a onClick={() => removeObjectFromArray(item.id)}>
                                <DeleteIcon />
                              </a>
                            </Link>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </>
                ))}

              </tbody>
            </table>
          </>
        }

        <Button variant="primary" className="shadow rounded mb-3" style={{ marginTop: "5px" }} type="button" onClick={variantChange} block>
          {variant.length >= 1 ? 'Add More Variant' : 'Add Variant'}
        </Button>

        {objedit &&
          <>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Variant Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Variant Name"
                name='vName'
                ref={nameRef}
                required
                value={vName}
                onChange={(e) => setVName(e.target.value)}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Price Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Variant Price"
                    name='vPrice'
                    ref={priceRef}
                    required
                    value={vPrice}
                    onChange={(e) => setVPrice(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formBasicEmail mb-3">
                  <Form.Label>Vat Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Variant Vat"
                    name='vVat'
                    ref={vatRef}
                    value={vVat}
                    onChange={(e) => setVVat(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <Link href='#'>
              <a className="btn btn-primary" onClick={UpdateData}>
                Update
              </a>
            </Link>
          </>
        }

        <div id="dd_handle">
          {inputVal.map((v, i) => (
            <>
              {v.input}
            </>
          ))}
        </div>

        <Button variant="success" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px", float: "right" }} type="button" onClick={() => onSubmit(dataset)} block>
          Create Food
        </Button>
      </Form>

    </>)} />
  );
};


//Update component
const EditForm = ({ onSubmit, foodId, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState({
    restaurant_category_id: null,
    restaurant_menu_type_id: null,
    restaurant_promo_offer_id: null,
    name: "",
    price: null,
    vat: null,
    image: null,
    upload_files: [],
    note: "",
    components: "",
    description: "",
    food_id: foodId
  })

  const [categories, setCategoryList] = useState([]);
  const [menuTypes, setMenuTypes] = useState([]);
  const [promoOffers, setPromoOffers] = useState([]);
  //const [loading, setLoading] = useState(false)

  const [inputVal, setInputVal] = useState([]);

  const [variant, setVariant] = useState([]);

  const nameRef = React.useRef(null);
  const priceRef = React.useRef(null);
  const vatRef = React.useRef(null);

  const [taxes, setTaxes] = useState([]);
  const [taxPending, setTaxPending] = useState(false)

  const [vName, setVName] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [vVat, setVVat] = useState("");

  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);

  const handleChange = (e) => {
    setFood(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  // start File manager section
  //function set selected files ids
  const setFilesData = (data) => {
    for (let i = 0; i < data.length; i++) {
      filesArr.push(data[i]);
    }

    setFood(prev => ({
      ...prev, upload_files: filesArr
    }))
  }

  //function set selected files ids
  const setIds = (Ids) => {

    for (let i = 0; i < Ids.length; i++) {
      arr.push(Ids[i]);
    }

    setFood(prev => ({
      ...prev, image: arr
    }))

  };

  const removePhoto = (id) => {
    //Ids array remove
    let filtered = arr.filter(function (item) {
      return item != id;
    });

    setArr(filtered);

    setFood(prev => ({
      ...prev, image: filtered
    }))

    //remove files array of objects
    const newList = filesArr.filter((item) => item.id !== id);
    setFilesArr(newList);

    setFood(prev => ({
      ...prev, upload_files: newList
    }))

  }
  // End File manager section

  useEffect(() => {
    categoryList();
    menuTypeList();
    promoList();
    taxList();
  }, []);

  const taxList = async () => {
    setTaxPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, { action: "getAllTax" })
      .then((res) => {
        setTaxes(res.data.data);
        setTaxPending(false);
      });
  };

  const categoryList = async () => {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/category`, { action: "getAllCategories" })
      .then((res) => {
        setCategoryList(res.data.data);
        setLoading(false);
      });
  };

  const menuTypeList = async () => {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/menu-type`, { action: "getAllMenutypes" })
      .then((res) => {
        setMenuTypes(res.data.data);
        setLoading(false);
      });
  };

  const promoList = async () => {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/promo-offer`, { action: "getAllPromos" })
      .then((res) => {
        setPromoOffers(res.data.data);
        setLoading(false);
      });
  };

  const [ind, setInd] = useState()

  function variantChange() {
    setInd(() => ind + 1)

    setInputVal([...inputVal,
    {
      id: ind,
      input: InputForm(ind)
    }
    ])
  }

  const handleSave = (e) => {
    if (nameRef.current.value == null) {
      notify("error", "can not add same item!");
    }
    setVariant([...variant,
    { id: ind, name: nameRef.current.value, price: priceRef.current.value, vat: vatRef.current.value }
    ])
    setInputVal([]);
  }

  const [objedit, setObjEdit] = useState(false);
  const [editId, setEditId] = useState();

  function editobj(index, editId) {

    setObjEdit(true)
    setEditId(editId)
    setVName(variant[index]?.name)
    setVPrice(variant[index]?.price)
    setVVat(variant[index]?.vat)
  }

  const UpdateData = (e) => {
    //e.preventDefault();

    const newState = variant.map(obj => {
      if (obj.id === editId) {
        return { ...obj, name: nameRef.current.value, price: priceRef.current.value, vat: vatRef.current.value };
      }
      return obj;
    });

    setVariant(newState);

    setObjEdit(false)
  }

  const [deletedVariants, setDeletedVariants] = useState([])

  async function removeObjectFromArray(id, index) {
    setDeletedVariants([...deletedVariants,
    {
      id: id,
      name: variant[index]?.name,
      price: variant[index]?.price,
      vat: variant[index]?.vat
    }
    ])

    setInputVal(current =>
      current.filter(obj => {
        return obj.id !== id;
      }),
    );
    setVariant(currentLevel =>
      currentLevel.filter(objLevel => {
        return objLevel.id !== id;
      }),
    );
  };

  const fetchFoodData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, { action: "getFoodInfo", food_id: foodId })
      .then((res) => {
        if (isSubscribed) {
          setFood(prev => ({
            ...prev,
            restaurant_category_id: res.data.data.restaurant_category_id,
            restaurant_menu_type_id: res.data.data.restaurant_menu_type_id,
            restaurant_promo_offer_id: res.data.data.restaurant_promo_offer_id,
            name: res.data.data.name,
            price: res.data.data.price,
            vat: res.data.data.tax_head_id,
            image: res.data.data.image,
            note: res.data.data.note,
            components: res.data.data.components,
            description: res.data.data.description,
          }));
          setInd(res.data.data.item_variants_no + 1)
          setVariant(res.data.data.variant_list)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [foodId]);

  useEffect(() => {
    fetchFoodData();
  }, [fetchFoodData])


  const InputForm = (no) => {
    return (
      <>
        <div className="form-group">
          <h4 for="memberName">Variant No: {no}</h4>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Variant Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Variant Name"
              name='vName'
              ref={nameRef}
              required
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Price Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Variant Price"
                  name='vPrice'
                  ref={priceRef}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group controlId="formBasicEmail mb-3">
                <Form.Label>Vat Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Variant Vat"
                  name='vVat'
                  ref={vatRef}
                />
              </Form.Group>
            </div>
          </div>

          <Link href='#'>
            <a className="btn btn-primary" onClick={handleSave}>
              Add
            </a>
          </Link>
        </div>
      </>
    )
  }

  console.log(variant)

  let dataset = { ...food, variant, deletedVariants, action: "updateFood" }

  return (

    //wrap this MRIfileManagerRender component where you want to integrate file-manager. Make sure exist setIds function.
    <MRIfileManagerRender setIds={setIds} setFilesData={setFilesData} render={(show, handleClose, uploadIds, selecteLoading, handleShow, files) => (<>

      {/* MRI_Uploader Modal Form */}
      <Modal dialogClassName="modal-xlg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>File Uploader</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <MRI_Uploader onSubmitUploads={uploadIds} selectLoading={selecteLoading} />

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
      {/* End MRI_Uploader Modal Form */}

      <Form validated={validated}>


        <div className="row ">
          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Category</Form.Label>
              {loading ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={food.restaurant_category_id} name="restaurant_category_id" onChange={handleChange}>
                  <option value="0">none</option>
                  {categories &&
                    categories?.map((cat, ind) => (
                      <>
                        <option value={cat.id}>{cat.name}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Food Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Food Name"
                name='name'
                onChange={handleChange}
                defaultValue={food.name}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Components</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Food Components"
                name='components'
                onChange={handleChange}
                defaultValue={food.components}
              />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group className="mb-3" controlId="formBasicDesc" >
              <Form.Label>Select Menu Type</Form.Label>
              {loading ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={food.restaurant_menu_type_id} name="restaurant_menu_type_id" onChange={handleChange}>
                  <option value="0">none</option>
                  {menuTypes &&
                    menuTypes?.map((menu, ind) => (
                      <>
                        <option value={menu.id}>{menu.name}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Unit Price"
                name='price'
                onChange={handleChange}
                defaultValue={food.price}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Food Note"
                name='note'
                onChange={handleChange}
                defaultValue={food.note}
              />
            </Form.Group>

          </div>
        </div>












        {/* Choose File Button */}
        <FileSelectButton handleShow={handleShow} files={food} removePhoto={removePhoto} />
        {/* End choose file button */}

        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-2" controlId="formBasicDesc" >
              <Form.Label>Select Promo Offer</Form.Label>
              {loading ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={food.restaurant_promo_offer_id} name="restaurant_promo_offer_id" onChange={handleChange}>
                  <option value="0">none</option>
                  {promoOffers &&
                    promoOffers?.map((promo, ind) => (
                      <>
                        <option value={promo.id}>{promo.name}</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
          </div>

          {/* <div className="col-md-6">
        <Form.Group controlId="formBasicEmail">
        <Form.Label>Vat</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Vat"
          name='vat'
          onChange={handleChange}
          defaultValue={food.vat}
        />
      </Form.Group>
        </div> */}
          <div className="col-md-6">
            <Form.Group className="mb-2" controlId="formBasicDesc" >
              <Form.Label>Select Tax</Form.Label>
              {taxPending ? (
                <Select>
                  <option value="">loading...</option>
                </Select>
              ) : (
                <Select value={food.vat} name="vat" onChange={handleChange}>
                  <option value="0">none</option>
                  {taxes &&
                    taxes?.map((tax, ind) => (
                      <>
                        <option value={tax.id}>{tax.name} ({tax.tax}%)</option>
                      </>
                    ))
                  }
                </Select>
              )}
            </Form.Group>
          </div>
        </div>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Description</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Description"
            name='description'
            onChange={handleChange}
            defaultValue={food.description}
          />
        </Form.Group>

        {variant != "" &&
          <>
            <div className="border-bottom title-part-padding">
              <h4 className="card-title mb-0">All Variants</h4>
            </div>
            <table
              id="multi_col_order"
              className="table table-striped table-bordered display"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Vat</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {variant?.map((item, index) => (
                  <>
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.vat}</td>
                      <td>
                        <ul className="action">
                          <li>
                            <Link href="#">
                              <a onClick={() => editobj(index, item.id)}>
                                <EditIcon />
                              </a>
                            </Link>
                          </li>
                          <li>
                            <Link href='#'>
                              <a onClick={() => removeObjectFromArray(item.id, index)}>
                                <DeleteIcon />
                              </a>
                            </Link>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </>
                ))}

              </tbody>
            </table>
          </>
        }

        <Button variant="primary" className="shadow rounded mb-3" style={{ marginTop: "5px" }} type="button" onClick={variantChange} block>
          {variant.length >= 1 ? 'Add More Variant' : 'Add Variant'}
        </Button>

        {objedit &&
          <>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Variant Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Variant Name"
                name='vName'
                ref={nameRef}
                required
                value={vName}
                onChange={(e) => setVName(e.target.value)}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Price Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Variant Price"
                    name='vPrice'
                    ref={priceRef}
                    required
                    value={vPrice}
                    onChange={(e) => setVPrice(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formBasicEmail mb-3">
                  <Form.Label>Vat Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Variant Vat"
                    name='vVat'
                    ref={vatRef}
                    value={vVat}
                    onChange={(e) => setVVat(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <Link href='#'>
              <a className="btn btn-primary" onClick={UpdateData}>
                Update
              </a>
            </Link>
          </>
        }

        <div id="dd_handle">
          {inputVal.map((v, i) => (
            <>
              {v.input}
            </>
          ))}
        </div>


        <Button variant="success" className="shadow rounded"
          disabled={pending || loading} style={{ marginTop: "5px", float: "right" }}
          onClick={() => onSubmit(dataset)}
        >
          {pending ? 'updating...' : 'Update Food'}
        </Button>

      </Form>
    </>)} />
  );
};

//Delete component
const DeleteComponent = ({ onSubmit, foodId, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState({
    food_id: foodId
  })

  let dataset = { ...food, action: "deleteFood" }

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to delete ?</Modal.Title>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="danger" disabled={pending} onClick={() => onSubmit(dataset)}>
          Confirm
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView({accessPermissions}) {

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  // const notify = React.useCallback((type, message) => {
  //     toast({ type, message });
  //   }, []);

  const { notify } = MyToast();
  const context = useContext(themeContext);
  const {golbalCurrency} = context;

  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Form validation
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //create floor form
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
        }
        setValidated(false);
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
          if (msg?.restaurant_category_id) {
            notify("error", `Restaurant Category must not be empty!`);
          }
          if (msg?.restaurant_menu_type_id) {
            notify("error", `Restaurant Menu-Type must not be empty!`);
          }
          if (msg?.price) {
            notify("error", `Ending Date must not be empty!`);
          }
        }
        setValidated(true);
        setLoading(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }




  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [foodId, setFoodId] = useState(null)

  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (food_id) => {
    setShowUpdateModal(true);
    setFoodId(food_id);
  }


  //Update floor form
  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
        }
        setValidated(false);
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
          if (msg?.restaurant_category_id) {
            notify("error", `Restaurant Category must not be empty!`);
          }
          if (msg?.restaurant_menu_type_id) {
            notify("error", `Restaurant Menu-Type must not be empty!`);
          }
          if (msg?.price) {
            notify("error", `Ending Date must not be empty!`);
          }
        }
        setValidated(true);
        setPending(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (food_id) => {
    setShowDeleteModal(true);
    setFoodId(food_id);
  }


  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }

      })
      .catch((e) => {
        console.log('error delete !')
        setPending(false);
      });

    fetchItemList();

    return () => isSubscribed = false;
  }

  //Food data list
  const [foodList, setFoodList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItemList();
    });
    return () => clearTimeout(timeout);
  }, []);


  //Fetch List Data for datatable
  const data = foodList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/foods`, {
      action: "getAllFood",
    })
      .then((res) => {
        if (isSubscribed) {
          setFoodList(res?.data);
          setFilteredData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase())
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search])





  const actionButton = (foodId) => {
    return <>
      <ul className="action ">

       {accessPermissions.createAndUpdate && <li>
          <Link href="#">
            <a onClick={() => handleOpen(foodId)}>
              <EditIcon />
            </a>
          </Link>

        </li>}
       {accessPermissions.delete &&  <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(foodId)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}

      </ul>
    </>
  }


  const columns = [

    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    }, 
    {
      name: 'Discount',
      selector: row => row.discount_amount ? row.discount_amount : 0,
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => `${golbalCurrency[0]?.symbol}${row.price}`,
      sortable: true,
    },
    {
      name: 'Vat',
      selector: row => `${golbalCurrency[0]?.symbol}${row.tax}`  || '--',
      sortable: true,
    },
    {
      name: 'Components',
      selector: row => row.components,
      sortable: true,
    }, 
    {
      name: 'Action',
      selector: row => actionButton(row.id), 
    },

  ];



  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'Foods', link: '/modules/restaurant/foods' },

  ];



  return (

    <>
      <HeadSection title="Manage Foods" />
      <div className="row container-fluid">
      <div className="col-12 col-md-5">
          <div className="row">
            <div className="col-12">
              <FoodCategories accessPermissions={accessPermissions}/>
            </div>
            <div className="col-12">
              <FoodMenuType   accessPermissions={accessPermissions}/>
            </div>
          </div>
        </div>
        <div className="col-md-7 "> 
          <div className="card shadow">
            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Foods</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
               {accessPermissions.createAndUpdate && <Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Add Food
                </Button>}


                {/* Create Modal Form */}
                <Modal dialogClassName="modal-md pl-0" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Food</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}

                {/* Update Modal Form */}
                <Modal dialogClassName="modal-md pl-0" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Food</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} foodId={foodId} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} foodId={foodId} pending={pending} />
                </Modal>

              </div>
            </div>  
            <div className="card-body"> 
                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  subHeader
                  subHeaderComponent={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                    <input
                      type="text"
                      placeholder="search..."
                      className="w-25 form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    </div>
                  }
                  striped
                /> 
            </div> 
          </div> 
        </div>
        
      </div>



    </>
  )
} 