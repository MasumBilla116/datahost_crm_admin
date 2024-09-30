import MyToast from '@mdrakibul8001/toastify';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Switch from "react-switch";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
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


//Delete component
const DeleteComponent = ({ onSubmit, contact_id, pending }) => {

  const { http } = Axios();

  const [loading, setLoading] = useState(true);


  let dataset = { contact_id, action: "deleteContact" }

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


const ContactUs = () => {
  const { http } = Axios();
  const { notify } = MyToast();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [contact_id, setContactId] = useState(null);


  //Form validation
  const [validated, setValidated] = useState(false);


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (id) => {
    setShowDeleteModal(true);
    setContactId(id);
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
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/contact_us`, {
      action: "getAllContact",
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








  /** Delete  form start  */

  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/contact_us`, formData)
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


  const SwitchButton = (id, status) => {

    const [selectedStatus, setSelectedStatus] = useState(status);


    let body = { action: "updateSectionStatus", contact_id: id, status: selectedStatus }
    const handleChange = () => {
      const newStatus = selectedStatus === 1 ? 0 : 1;
      notify("success", "successfully Updated!");
      setSelectedStatus(newStatus);
    };


    const handleUpdateStatus = async (formData) => {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/website/contact_us`, formData)
        .then((res) => {
          if (isSubscribed) {
            notify("success", "successfully updated!");
          }
  
        })
        .catch((e) => {
          console.log('error updated !')
  
        });
  
        fetchAllReviews();
    }

    useEffect(() => {

      handleUpdateStatus(body)

    }, [selectedStatus])





    return (
      <>
        <Switch
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
            <a onClick={() => handleOpenDelete(id)} >
              <DeleteIcon />
            </a>
          </Link>

        </li>

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
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Subject',
      selector: row => row.subject,
      sortable: true,
    },
    {
      name: 'Content',
      selector: row => row.content,
      sortable: true,
    },

    {
      name: 'Status',
      selector: row => row.status,
      width: "150px",                       // added line here
    },

    {
      name: 'Action',
      selector: row => actionButton(row.id),
      width: "150px",                       // added line here
    },

    {
      name: 'Access',
      selector: row => SwitchButton(row.id, row.status),
      // width: "150px", 

    },

  ];


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow">

            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Review</h4>
              </div>
              <div className="ms-auto flex-shrink-0">



                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent onSubmit={handleDelete} contact_id={contact_id} pending={pending} />
                </Modal>

                {/* Delete Modal Form end*/}

              </div>
            </div>


            <div className="card-body table-responsive"> 

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
  )
}

export default ContactUs