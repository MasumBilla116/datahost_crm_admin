import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
 
import HeadSection from '../../../../../../components/HeadSection';
import Axios from '../../../../../../utils/axios';


export default function EmployeeDetails() {
 

    const { http } = Axios();
    const [name, setName] = useState("");
    const [employee, setEmployee] = useState([]);
    const router = useRouter();
    const {
        isReady,
        query: {
            id,
        }
    } = router;
 

    useEffect(() => {
        const controller = new AbortController();

         
        const getInvoiceDetails = async () => {
            let body: any = {}
            body = {
                action: "rosterAssignmentInfo",
                id: id
            }
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/rosterManagement/assignment`,
                body
            ).then(res => {
                // console.log(res.data.data.roster.name);
                setName(res.data.data.roster.name);
                setEmployee(res.data.data.roster_employee);
            }).catch((err) => {
                console.log(err + <br /> + 'Something went wrong !')
            });
        }

        isReady && getInvoiceDetails()

        return () => controller.abort();
    }, [id, isReady])
  

    return (
        <>
            <HeadSection title="Supplier Details" />
            <div className="container-fluid ">
                <div className="row">
                    <div className="row">
                        <div className='row bg-white p-5 m-3 shadow'>
                                <h3 className="box-title mt-1">Roster Dertails</h3>
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody> 
                                            <tr>
                                                <td>Name:</td>
                                                <td>
                                                    {name}
                                                </td>
                                            </tr> 
                                            <tr>
                                                <td>Employee:</td>
                                                <td>
                                                    {
                                                        employee.map(obj=>{
                                                            return(
                                                            <>
                                                                <p>
                                                                  <b>Name: </b>{obj.employee ? obj.employee.name : ''}
                                                                  <br /> 
                                                                  <b>Designation: </b>{obj.employee.designation ? obj.employee.designation.name : ''}
                                                                </p>
                                                            </>
                                                            )
                                                        })
                                                    }
                                                </td>
                                            </tr> 
                                            
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </>
    );
}