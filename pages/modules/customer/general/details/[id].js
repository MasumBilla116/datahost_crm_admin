import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaFilePdf } from 'react-icons/fa';
import HeadSection from '../../../../../components/HeadSection';
import Axios from "../../../../../utils/axios";
// import Breadcrumbs from '../../../../../components/Breadcrumbs';

function viewCustomerInfo() {
    const { http } = Axios();
    const router = useRouter();
    const { pathname } = router;
    const {
      isReady,
      query: { id },
    } = router;

    const [customer,setCustomer]=useState({});
    const [customerBookings,setCustomerBookings] = useState(null);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    //fetch Customer info
    const fetchCustomerInfo = useCallback(async () => {
        if (!isReady) {
          console.log("fetching...");
          return;
        }
    
        let isSubscribed = true;
        await http
          .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/customers/addNewCustomer`, {
            action: "customerInfo",
            customer_id: id,
          })
          .then((res) => {
            if (isSubscribed) {
                setCustomer(res.data.data);
                setCustomerBookings(res.data.data?.bookings);
                setFilteredData(res.data.data?.bookings);
            }
          })
          .catch((err) => {
            console.log("Something went wrong !");
          });
    
        return () => (isSubscribed = false);
      }, [id, isReady]);
    
      useEffect(() => {
        fetchCustomerInfo();
      }, [fetchCustomerInfo]);

      useEffect(()=>{
        let controller = new AbortController();
        const result = customerBookings?.filter((booking)=>{
          return booking?.date_from?.toLowerCase().match(search.toLocaleLowerCase())
        });
      
        setFilteredData(result);
        return ()=> controller.abort();
      },[search])


      const columns = [

        {
          name: 'Check-In Date',
          selector: row => moment(row.date_from).format('DD/MM/YYYY'),
          sortable: true,
        },
        {
            name: 'Checkout Date',
            selector: row => moment(row.date_to).format('DD/MM/YYYY'),
            sortable: true,
        },
        {
            name: 'Booking Type',
            selector: row => row?.checkout_type,
            sortable: true,
        },
        {
            name: 'Room Number',
            selector: row => row?.booking_days["0"]?.room?.room_no,
            sortable: true,
        }
      
    ];
 
      //Print function
      const handleDownloadPdf = async () => {
        const element = document.getElementById('printME');
        const file_name = customer?.first_name;
    
        try {
          const canvas = await html2canvas(element);
          const imgData = canvas.toDataURL('image/png');
    
          const pdf = new jsPDF();
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${file_name}.pdf`);
        } catch (error) {
          console.error('Error creating PDF:', error);
        }
    
      }; 


      //breadcrumbs
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'Individual Clients', link: '/modules/customer' },
        { text: 'View Client', link: `/modules/customer/view/[id]` }
        // { text: 'Corporate Clients', <lin></lin>k: '/modules/customer/client' },

    ];


  return (
    <Fragment>
        <HeadSection title="Customer Information" />

        <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
            <div className="row">
                <div className="col-12">
                    
                    <div className="card shadow">
                        <div id='printME'>

                            <div className="border-bottom title-part-padding">
                            <h4 className="card-title mb-0">
                                Customer info
                            </h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="table-responsive">
                                        <table className="table border table-striped">
                                            <tbody>
                                            <tr>
                                                <td width={300}>Full Name</td>
                                                <td>{customer?.title ?? "---"} {customer?.first_name} {customer?.last_name}</td>
                                            </tr>
                                            <tr>
                                                <td>Contact Number</td>
                                                <td>{customer?.mobile  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Gender</td>
                                                <td>{customer?.gender  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Date of birth</td>
                                                <td>{customer?.dob  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Anniversary Date</td>
                                                <td>{customer?.anniversary_date  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Nationality</td>
                                                <td>{customer?.nationality  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Country</td>
                                                <td>{customer?.country?.name  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>State</td>
                                                <td>{customer?.state?.name  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>City</td>
                                                <td>{customer?.city?.name  ?? "---"}</td>
                                            </tr>


                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="table-responsive">
                                        <table className="table border table-striped">
                                            <tbody>
                                            <tr>
                                                <td width={300}>Pin Code</td>
                                                <td>{customer?.pin_code  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Arrival From</td>
                                                <td>{customer?.arrival_from  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Address</td>
                                                <td>{customer?.address  ?? "---"}</td>
                                            </tr>
                                            <tr>
                                                <td>Created At</td>
                                                <td>{customer && moment(customer?.created_at).format('DD-MM-YYYY')  }</td>
                                            </tr>
                                            <tr>
                                                <td>Status</td>
                                                <td>{customer?.status === 1 ? 'Active':'Inactive'}</td>
                                            </tr>
                                            <tr>
                                                <td>Customer Type</td>
                                                <td>{customer?.customer_type === 0 ? 'Individual Customer':'Corporate Customer'}</td>
                                            </tr>

                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className='card-footer text-right'>
                            <Button className='btn-sm' variant='primary' onClick={handleDownloadPdf} ><span className='me-1'><FaFilePdf /></span>Print Customer Info</Button>
                        </div>
                    </div>

                </div>
            </div>
            {/* booking list */}
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">

                    <div className="d-flex border-bottom title-part-padding align-items-center">
                        <div>
                        <h4 className="card-title mb-0">All Bookings</h4>
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
    </Fragment>
  )
}

export default viewCustomerInfo;