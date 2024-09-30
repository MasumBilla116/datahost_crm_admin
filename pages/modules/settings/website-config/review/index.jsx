import MyToast from '@mdrakibul8001/toastify';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Switch from "react-switch";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import Axios from '../../../../../utils/axios';
import { getSSRProps } from '../../../../../utils/getSSRProps';

export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.stng.wb_cnfg" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};

//Create Component
const CreateForm = ({ onSubmit, loading, validated }) => {

  const { http } = Axios();
  const [reviewList, setReviewList] = useState([]);


  const [review, setReview] = useState({
    name: "",
    email: "",
    review: "",
    rating: 1,
    status: 0

  })


  const handleChange = (e) => {

    setReview(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))

  }

  // start File manager section




  let dataset = { ...review, action: "createReview" }

  return (



    <>

      <Form validated={validated}>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter Name"
            name='name'
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Email"
            name='email'
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicDesc" className="mt-3">
          <Form.Label>Review</Form.Label>

          <Form.Control as="textarea" rows={5}
            placeholder="Enter Review"
            name='review'
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicNumber">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            name="rating"
            min="1"
            max="5"
            value={review.rating}
            onChange={handleChange}
          />
        </Form.Group>


        <Form.Group controlId="formBasicStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={review.status}
            onChange={handleChange}
          >
            <option value="">Select status</option>
            <option value={1}>True</option>
            <option value={0}>False</option>
          </Form.Control>
        </Form.Group>



        <Button variant="success" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px", float: "right" }} type="button" onClick={() => onSubmit(dataset)} block>
          Create review
        </Button>
      </Form>
    </>



  );
};






//Update component
const EditForm = ({ onSubmit, review_id, pending, validated }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);
  const [arr, setArr] = useState([]);
  const [filesArr, setFilesArr] = useState([]);
  const [sliderList, setSliderList] = useState([]);
  const [review, setReview] = useState({
    name: "",
    email: "",
    review: "",
    rating: null,
    status: null

  })


  const handleChange = (e) => {

    setReview(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))

  }





  const fetchReviewerData = useCallback(async () => {
    let isSubscribed = true;
    setLoading(true)
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/review`, { action: "getReviewInfo", review_id: review_id })
      .then((res) => {
        if (isSubscribed) {
          setReview(prev => ({
            ...prev,
            review_id: review_id,
            name: res?.data?.data?.name,
            email: res.data.data.email,
            review: res.data.data.review,
            rating: parseInt(res.data.data.rating), // Convert to integer using parseInt()
            status: parseInt(res.data.data.status),
          }));



          setLoading(false)
        }
      })
      .catch((err) => {
        console.log('Something went wrong !')
        setLoading(false)
      });

    return () => isSubscribed = false;

  }, [review_id]);



  useEffect(() => {
    fetchReviewerData();
  }, [fetchReviewerData])




  let dataset = { ...review, action: "updateReview" }

  return (



    <Form validated={validated}>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="name"
          placeholder="Enter Name"
          name='name'
          onChange={handleChange}
          defaultValue={review.name}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Email"
          name='email'
          onChange={handleChange}
          defaultValue={review.email}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicDesc" className="mt-3">
        <Form.Label>Review</Form.Label>

        <Form.Control as="textarea" rows={5}
          placeholder="Enter Review"
          name='review'
          onChange={handleChange}
          defaultValue={review.review}
        />
      </Form.Group>

      <Form.Group controlId="formBasicNumber">
        <Form.Label>Rating</Form.Label>
        <Form.Control
          type="number"
          name="rating"
          min="1"
          max="5"
          defaultValue={review.rating}
          onChange={handleChange}
        />
      </Form.Group>


      <Form.Group controlId="formBasicStatus">
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          name="status"
          defaultValue={review.status}
          onChange={handleChange}
        >
          <option >Select status</option>
          <option value={1}>True</option>
          <option value={0}>False</option>
        </Form.Control>
      </Form.Group>



      <Button variant="success" className="shadow rounded mb-3" disabled={loading} style={{ marginTop: "5px", float: "right" }} type="button" onClick={() => onSubmit(dataset)} block>
        Update review
      </Button>
    </Form>

  );
};





//Delete component
const DeleteComponent = ({ onSubmit, review_id, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);


  let dataset = { review_id, action: "deleteReview" }

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


const Review = () => {
  const { http } = Axios();
  const { notify } = MyToast();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [review_id, setReviewId] = useState(null);


  //Form validation
  const [validated, setValidated] = useState(false);
  //Create 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //Update Tower Modal form
  const [showUpdateModal, setShowUpdateModal] = useState(false);


  const handleExit = () => setShowUpdateModal(false);
  const handleOpen = (id) => {
    setShowUpdateModal(true);
    setReviewId(id);

  }



  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (id) => {
    setShowDeleteModal(true);
    setReviewId(id);
  }





  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAllReviews();
    });
    return () => clearTimeout(timeout);
  }, []);


  const data = reviewList?.data;

  const fetchAllReviews = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/review`, {
      action: "getAllReview",
    })
      .then((res) => {
        if (isSubscribed) {
          setFilteredData(res.data?.data);
          setReviewList(res.data);
        }
      })
      .catch((err) => {
        console.log("Server Error ~!")
      });

    return () => isSubscribed = false;
  };



  /** create floor form */
  const submitForm = async (items) => {
    let isSubscribed = true;
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/review`, items)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Added!");
          handleClose();
          setLoading(false);
          setValidated(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.title) {
            notify("error", `${msg.title.Title}`);
          }
        }
        setLoading(false);
        setValidated(true);
      });

    fetchAllReviews();

    return () => isSubscribed = false;
  }

  /** create floor form end */





  /** update floor form start */


  const updateForm = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/review`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully Updated!");
          handleExit();
          setPending(false);
          setValidated(false);
        }
      })
      .catch((e) => {
        const msg = e.response?.data?.response;

        if (typeof (msg) == 'string') {
          notify("error", `${msg}`);
        }
        else {
          if (msg?.title) {
            notify("error", `${msg.title.Title}`);
          }

        }
        setPending(false);
        setValidated(true);
      });

    fetchAllReviews();

    return () => isSubscribed = false;
  }


  /** update floor form end */







  /** Delete  form start  */

  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/review`, formData)
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

    fetchAllReviews();

    return () => isSubscribed = false;
  }

  /** Delete  form end  */


  //----------------- search operation-----------------

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((review) => {
      return review.name
        .toLowerCase()
        .match(search.toLocaleLowerCase());
    });

    setFilteredData(result);
    return () => controller.abort();
  }, [search]);



  //-----------------End search operation-----------------

const columns = [
    // {
    //   name: 'Name',
    //   selector: row => row.name,
    //   sortable: true,
    //   width: '200px', // Example width
    // },
    {
      name: 'Email',
      selector: row => row.email,
      // sortable: true,
      // width: '250px', 
    },
    {
      name: 'Review',
      selector: row => row.review,
      sortable: true,
      width: '300px', 
    },
    {
      name: 'rating',
      selector: row => row.rating,
      // sortable: true,
      width: '150px', 
    },
    // {
    //   name: 'Status',
    //   selector: row => row.status,
    //   width: '150px', 
    // },
    {
      name: 'Access',
      selector: row => SwitchButton(row.id, row.status),
      // width: '150px', 
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: '200px', 
    },
];



  const SwitchButton = (id, status) => {

    const [selectedStatus, setSelectedStatus] = useState(status);
    let body = { action: "updateReviewStatus", review_id: id, status: selectedStatus }
    const handleChange = () => {
      const newStatus = selectedStatus === 1 ? 0 : 1;
      notify("success", "successfully Updated!");
      setSelectedStatus(newStatus);
    };


    useEffect(() => {

      handleUpdateStatus(body)

    }, [selectedStatus])

    return (
      <>
        <Switch
        //  height={20} width={40}
          onChange={handleChange}
          checked={selectedStatus === 1}
        />
      </>
    );
  };



  const actionButton = (id) => {
    return <>
      <ul className="action ">

        <li>
          <Link href="#">
            <a onClick={() => handleOpen(id)} >
              <EditIcon />
            </a>
          </Link>

        </li>
        <li>
          <Link href="#">
            <a onClick={() => handleOpenDelete(id)} >
              <DeleteIcon />
            </a>
          </Link>

        </li>

      </ul>
    </>
  }


  const handleUpdateStatus = async (formData) => {
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/review`, formData)
      .then((res) => {
        if (isSubscribed) {
          notify("success", "Successfully updated!");
        }

      })
      .catch((e) => {
        console.log('error updated !')

      });

    fetchAllReviews();
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12  p-xs-2">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Review</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                <Button
                  className="shadow rounded btn-sm"
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  block
                >
                  Add Review
                </Button>


                {/* Create Modal Form */}
                <Modal dialogClassName="modal-md" show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Review</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <CreateForm onSubmit={submitForm} loading={loading} validated={validated} />
                  </Modal.Body>
                </Modal>
                {/* End Create Modal Form */}



                {/* Update Modal Form */}
                <Modal dialogClassName="modal-md" show={showUpdateModal} onHide={handleExit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Review</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EditForm onSubmit={updateForm} review_id={review_id} pending={pending} validated={validated}
                    />
                  </Modal.Body>
                </Modal>
                {/* End Update Modal Form */}


                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} review_id={review_id} pending={pending} />
                </Modal>

                {/* Delete Modal Form end*/}

              </div>
            </div>


            <div className="card-body">
              <div className="">

                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  subHeader
                  subHeaderComponent={
                    <input
                      type="text"
                      placeholder="search..."
                      className="w-25 form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  }
                  striped
                />

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Review