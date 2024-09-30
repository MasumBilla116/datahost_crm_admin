import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HeadSection from '../../../../../components/HeadSection';
import Axios from '../../../../../utils/axios';
import * as CryptoJS from 'crypto-js';

export default function EmployeeDetails() {

    const [items, setItems] = useState();
    const [details, setDetails] = useState('')
    const [loading,setLoading] = useState(true)

    const {http} = Axios();

    const router = useRouter();
    const {
      isReady,
      query: {
        id,
      }
    } = router;

    
    // const ciphertext = AES.encrypt(id, '123');
    // console.log(ciphertext);
    const[empId,setEmpId] = useState(null);
    
    // const key='123';
    // const decrypted = CryptoJS.AES.decrypt(id, key);

    // const empId = decrypted.toString(CryptoJS.enc.Utf8);

    console.log(empId);

    useEffect(()=>{
        if(!isReady){
            console.log('fetching...')
            return;
        }

        const key='123';
        const decrypted = CryptoJS.AES.decrypt(id, key);
    
        setEmpId(decrypted.toString(CryptoJS.enc.Utf8)) ;

    },[])


    useEffect(() => {
        let isSubscribed = true;

        if(!isReady){
            console.log('fetching...')
            return;
        }
        setLoading(true);
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`,{action: "getEmployeeInfo",employee_id:empId})
        .then((res) =>{
            if(isSubscribed){
                setDetails(res?.data);
                setLoading(false);
            }
        })
        .catch((err)=>{
            console.log('Something went wrong !')
            setLoading(false);
          });

        return () =>{
            isSubscribed = false;
          }

    },[empId,isReady])

    useEffect(() => {
        let mount = true;
        if(mount && !loading){
          $("#multi_col_order").DataTable();
        }
    
        return ()=> mount=false;
    
      },[loading]);



// if(loading){
// return (
//     <MyLoader loading={loading}>
//     <div className="container-fluid vh-100">
//     <div className="row">
//         <div className="col-12">
//         <div className="card">
//             <div className="border-bottom title-part-padding">
//             <h4 className="card-title mb-0">Employee Info</h4>
//             </div>
//             <div className="card-body">

//             <p>Processing...</p>

//             </div>
//         </div>
//         </div>
//     </div>
//     </div>

// </MyLoader>

// );
// }
    
    
return(
    <>
    <HeadSection title="Employee Basic Info" />
    <div className="container-fluid ">
        <div className="row">
            {/* Column */}
            <div className="col-lg-6">
                <div className="card shadow">
                    <div className="card-body">

                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <h3 className="box-title mt-5">Employee’s Basic Info</h3>
                                <div className="table-responsive">
                                    <table className="table">
                                    <tbody>
                                        <tr>
                                            <td width={390}>Name</td>
                                            <td>{details && details.data.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Description</td>
                                            <td>
                                                {details && details.data.description}
                                            </td>
                                        </tr>
                                        <tr>
                                        <td>Address</td>
                                        <td>{details && details.data.address}</td>
                                        </tr>
                                        <tr>
                                        <td>Department of the Employee</td>
                                        <td>{details && details.data.department?.name}</td>
                                        </tr>
                                        <tr>
                                        <td>Designation of the  Employee</td>
                                        <td>{details && details.data.designation.name}</td>
                                        </tr>
                                        <tr>
                                        <td>Gender</td>
                                        <td>{details && details.data.gender}</td>
                                        </tr>
                                        <tr>
                                        <td>Salary Type</td>
                                        <td>{details && details.data.salary_type}</td>
                                        </tr>
                                        <tr>
                                        <td>Salary Amount</td>
                                        <td>30k</td>
                                        </tr>
                                        <tr>
                                        <td>Mobile</td>
                                        <td>{details && details.data.mobile}</td>
                                        </tr>
                                        <tr>
                                        <td>E-mail</td>
                                        <td>{details && details.data.email}</td>
                                        </tr>
                                        <tr>
                                        <td>Status</td>
                                        <td>{details && details.data.status}</td>
                                        </tr>
                                        
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <h3 className="box-title mt-5">Creation/updation related info</h3>
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                            <td width={390}>Created By</td>
                                            <td>{details && details.data.creator.name}</td>
                                            </tr>
                                            <tr>
                                            <td>Created At</td>
                                            <td>{details && details.data.created_at}</td>
                                            </tr>
                                            <tr>
                                            <td>Updated By</td>
                                            <td>{details && details.data.updated_by}</td>
                                            </tr>
                                            <tr>
                                            <td>Updated At</td>
                                            <td>{details && details.data.updated_at}</td>
                                            </tr>
                                    
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6">

                <div className="card shadow">
                <div className="border-bottom title-part-padding">
                    <h4 className="card-title mb-0">Employee’s Attendance History</h4>
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
                                <th>Date</th>
                                <th>Check-in time</th>
                                <th>Check-out time</th>
                                <th>Time logged</th>
                            
                            </tr>
                            </thead>
                            <tbody>
                            {
                                !loading &&
                                <tr>
                                    <td>05-07-22</td>
                                    <td>10:00 AM</td>
                                    <td>6:30 PM</td>
                                    <td>8 Hrs</td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>

            </div>
            {/* Column */}
        </div>
    </div>
    </>
);
}