import * as moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import toast from "../../../../../components/Toast/index";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import ViewIcon from '../../../../../components/elements/ViewIcon';
import Axios from '../../../../../utils/axios';
import { getSSRProps } from '../../../../../utils/getSSRProps';
import { HeadSection } from '../../../../../components';


export const getServerSideProps = async (context) => {
  const {
    permission,
    query,
    accessPermissions
  } = await getSSRProps({ context: context, access_code: "m.acnt.mng_adjstmnt" });
  return {
    props: {
      permission,
      query,
      accessPermissions
    },
  };
};


//Delete component
const DeleteComponent = ({ onSubmit, invoiceId, pending }) => {
  
    let myFormData = new FormData(); 
  
    myFormData.append('action', "deleteInvoice");
    myFormData.append('invoice_id', invoiceId);

    return (
      <>
        <Modal.Body>
          <Modal.Title>Are you sure to Cancel </Modal.Title>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="danger"  disabled={pending} onClick={()=>onSubmit(myFormData)}>
            Confirm Cancel
          </Button>
        </Modal.Footer>
      </>
    );
  };

export default function ListView({accessPermissions}) {

    const {http} = Axios();
    const router = useRouter();
    const { pathname } = router;
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);


  //Create Tower
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //Delete Tower Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExitDelete = () => setShowDeleteModal(false);
  const handleOpenDelete = (voucherId) =>{
    setShowDeleteModal(true);
    setInvoiceId(voucherId);
  } 

    //Delete Tower form
    const handleDelete=async(formData)=> {
        let isSubscribed = true;
        setPending(true);
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/restaurant/food-order`,formData)
        .then((res)=>{
            if(isSubscribed){
                notify("success", "successfully deleted!");
                handleExitDelete();
                setPending(false);
            }
        })
        .catch((e)=>{
            console.log('error delete !')
            setPending(false);
        });

        fetchItemList();

        return ()=>isSubscribed=false;
    }

  //Voucher data list
  const [itemList, setItemList] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [pending, setPending] = useState(false);
  const [invoice_id, setInvoiceId] = useState('')

  React.useEffect(() => {
    const timeout = setTimeout(() => {
          fetchItemList();
    });
    return () => clearTimeout(timeout);
}, []);


//Fetch List Data for datatable
const data = itemList?.data;

  const fetchItemList = async () => {

    let isSubscribed = true;
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`,{
      action: "adjustmentList",
    })
    .then((res)=>{
      if(isSubscribed){
        setItemList(res?.data);
        setFilteredData(res.data?.data);
      }
    })
    .catch((err)=>{
      console.log("Server Error ~!")
    });
    
    return ()=> isSubscribed=false;
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange =(e)=>{
    if(e.target.name == 'start_date'){
      setStartDate(e.target.value);
    }
    if(e.target.name == 'end_date'){
      setEndDate(e.target.value);
    }
    
  }

useEffect(()=>{
  let controller = new AbortController();
  const result = data?.filter((item)=>{
    return item.account.account_name.toLowerCase().match(search.toLocaleLowerCase())
  });

  setFilteredData(result);
  return ()=> controller.abort();
},[search])

const actionButton=(adjust_id)=>{
    return <>
        <ul className="action">
            {accessPermissions.listAndDetails &&<li>
                <Link href={`/modules/accounts/adjustment-balance/details/${adjust_id}`}>
                    <a>
                        <ViewIcon />
                    </a>
                </Link>
   
            </li>}
           {accessPermissions.delete && <li>
                <Link href="#">
                    <a onClick={()=>handleOpenDelete(adjust_id)}>
                        <DeleteIcon />
                    </a>
                </Link>
   
            </li>}

        </ul>
    </>
}

const columns = [

    {
        name: 'Slip Number',
        selector: row =>row.slip_num,
        sortable: true,

    },
    {
      name: 'Account',
      selector: row => row.account.account_name,
      sortable: true,
    },
    {
        name: 'Amount',
        selector: row => row.amount,
        sortable: true,
    },
    {
        name: 'Type',
        selector: row => row.type,
        sortable: true,
    },
    {
        name: 'Old Balance',
        selector: row => row.old_balance,
        sortable: true,
    },
    {
        name: 'New Balance',
        selector: row => row.new_balance,
        sortable: true,
    },
    {
        name: 'Remarks',
        selector: row => row.remarks,
        sortable: true,
    },
    {
      name: 'Creator',
      selector: row => row.creator.name,
      sortable: true,
    },
    {
        name: 'Created At',
        selector: row => moment(row.created_at).format('DD/MM/YYYY'),
        sortable: true,
    },
    {
        name: 'Action',
        selector: row => actionButton(row.id),
    },
  
];



  return (
    <div className="container-fluid">
            <HeadSection title="Adjustment Balance" />

        <div className="row">
            <div className="col-12 p-xs-2 ">
                <div className="card shadow">

                  <div className="d-flex border-bottom title-part-padding align-items-center">
                    <div>
                      <h4 className="card-title mb-0">Adjustment Balance</h4>
                    </div>
                    <div className="ms-auto flex-shrink-0">
                    <Link href={`/modules/accounts/adjustment-balance`}>
                      <Button
                        className="shadow rounded btn-sm"
                        variant="primary"
                        type="button"
                        block
                      >
                        Create Adjustment to AC
                      </Button>
                    </Link>
                      
                      {/* Delete Modal Form */}
                      <Modal show={showDeleteModal} onHide={handleExitDelete}>
                        <Modal.Header closeButton></Modal.Header>
                        <DeleteComponent onSubmit={handleDelete} invoiceId={invoice_id} pending={pending}/>
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
                                <input 
                                type="text" 
                                placeholder="search..." 
                                className="w-25 form-control" 
                                value={search} 
                                onChange={(e)=>setSearch(e.target.value)}
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