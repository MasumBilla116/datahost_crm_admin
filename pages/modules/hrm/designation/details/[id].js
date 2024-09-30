import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HeadSection from '../../../../../components/HeadSection';
import MyLoader from '../../../../../components/placeholder/MyLoader';
import Axios from '../../../../../utils/axios';

export default function EmployeeDetails() {

    const [details, setDetails] = useState('')
    const [loading,setLoading] = useState(true)

    const router = useRouter();
    const { pathname } = router;
    const {http} = Axios();
    const {id} = router.query


    useEffect(() => {
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/designations`,{action: "getDesignationInfo",designation_id: id})
        .then((res) =>{
          setDetails(res.data);
          setLoading(false);
        });
    },[id])


    // useEffect(() => {
    //     $("#multi_col_order").DataTable();
    //   });

    if (loading)
    return (
    <>
        <HeadSection title="Designations-Details" />
        <MyLoader loading={loading}>
            <div className="container-fluid vh-100">
                <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="border-bottom title-part-padding">
                                <h4 className="card-title mb-0">Designation Info</h4>
                            </div>
                            <div className="card-body">

                            <p>Processing...</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyLoader>
        
    </>
    );
       
    
return(
    <>
    <HeadSection title="Designations-Details" />

    <div className="container-fluid ">
        <div className="row">
           
            <div className="col-lg-6">
                <div className="card">
                    <div className="card-body">
            
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                            <h3 className="box-title">Designations Basic Info</h3>
                            <div className="table-responsive">
                                <table className="table">
                                <tbody>
                                    <tr>
                                        <td width={390}>Name</td>
                                        <td>{details?.data?.name ?? '---'}</td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>
                                            {details?.data?.description ?? '---'}
                                        </td>
                                    </tr>
                                    <tr>
                                    <td>Status</td>
                                    <td>
                                        {details.data.status == 1 ? 
                                        <button className="btn btn-primary">Active</button> :
                                        <button className="btn btn-danger">Inactive</button>
                                        } 
                                    </td>
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
                                    <td>{details?.data?.creator?.name ?? '---'}</td>
                                    </tr>
                                    <tr>
                                    <td>Created At</td>
                                    <td>{moment(details?.data?.created_at ?? '---').format('DD-MM-YYYY')}</td>
                                    </tr>
                                    <tr>
                                    <td>Updated By</td>
                                    <td>{details?.data?.updated_by ?? '---'}</td>
                                    </tr>
                                    <tr>
                                    <td>Updated At</td>
                                    <td>{moment(details.data.updated_at).format('DD-MM-YYYY') ?? '---'}</td>
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
                
                <div className="card">
                <div className="border-bottom title-part-padding">
                    <h4 className="card-title mb-0">Employee’s under the Designations</h4>
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
                            <th>Designation</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Created At</th>
                        
                        </tr>
                        </thead>
                        <tbody>
                        {
                        details.data.employees.map((employee, index) => (
                          <tr key={index}>
                            <th>{employee.name}</th>
                            <td>{details.data.name}</td>
                            <td>
                                {employee.status == 1 ? 
                                <button className="btn btn-primary">Active</button> :
                                <button className="btn btn-danger">Inactive</button>
                                } 
                            </td>
                            <td>{employee.creator.name}</td>
                            <td>{moment(employee.created_at).format('DD-MM-YYYY')}</td>
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