import * as CryptoJS from 'crypto-js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ViewIcon } from '../../../../../components';
import HeadSection from '../../../../../components/HeadSection';
import Axios from '../../../../../utils/axios';
import ActiveCurrency from '../../../../../components/ActiveCurrency';

export default function EmployeeDetails() {

    const [items, setItems] = useState();
    const [details, setDetails] = useState('')
    const [loading, setLoading] = useState(true)
    const [filteredData, setFilteredData] = useState([]);
    const [leaveList, setLeaveList] = useState([]);
    const { http } = Axios();
    const data = leaveList?.data;
    const [search, setSearch] = useState("");
    const router = useRouter();
    const {
        isReady,
        query: {
            id,
        }
    } = router;




    const [params, setParams] = useState(null);


    useEffect(() => {
        if (!isReady) {
            console.log('fetching...')
            return;
        }

        const key = '123';
        const str = id.replace(/--/g, '/');
        const decrypted = CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
        setParams(decrypted);

    }, [isReady])


    useEffect(() => {
        let isSubscribed = true;

        if (!isReady) {
            console.log('fetching...')
            return;
        }
        setLoading(true);
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/employee`, { action: "getEmployeeInfo", employee_id: params })
            .then((res) => {
                console.log("response: ", res)
                if (isSubscribed) {
                    setDetails(res?.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false);
            });

        return () => {
            isSubscribed = false;
        }

    }, [params, isReady])




    useEffect(() => {
        let isSubscribed = true;

        if (!isReady) {
            console.log('fetching...')
            return;
        }
        setLoading(true);
        http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "getAllLeaveApplicantByEmployee", employee_id: params })
            .then((res) => {
                if (isSubscribed) {
                    // setDetails(res?.data);
                    setFilteredData(res?.data?.data);
                    setLeaveList(res?.data);
                }
            })
            .catch((err) => {
                console.log('Something went wrong !')
                setLoading(false);
            });

        return () => {
            isSubscribed = false;
        }

    }, [params, isReady])


    // useEffect(() => {
    //     let mount = true;
    //     if (mount && !loading) {
    //         $("#multi_col_order").DataTable();
    //     }

    //     return () => mount = false;

    // }, [loading]);



    const columns = [
        {
            name: "SL",
            selector: (row, index) => index + 1,
            sortable: true,
            width: "75px",
        },
        {
            name: "Date",
            selector: (row) => row.date,
            sortable: true,
        },
        {
            name: "Subject",
            selector: (row) => row?.leave_category?.title,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.description,
            sortable: true,
        },
        {
            name: "Leave Status",
            selector: (row) => row.leave_status,
            sortable: true,
        },

        {
            name: "Action",
            selector: (row) => actionButton(row.id),
        },

    ];


    const actionButton = (id) => {
        return (
            <>
                <ul className="action">
                    <li>
                        <Link
                            href={`/modules/hr/leaveApplications/details/${id}`}
                        >
                            <a>
                                <ViewIcon />
                            </a>
                        </Link>
                    </li>

                </ul>
            </>
        );
    };



    //----------------- search operation-----------------

    useEffect(() => {
        let controller = new AbortController();
        const result = data?.filter((leave) => {
            return leave.leave_category.title
                .toLowerCase()
                .match(search.toLocaleLowerCase());
        });

        setFilteredData(result);
        return () => controller.abort();
    }, [search]);



    //-----------------End search operation-----------------



    const { pathname } = router;

    //breadcrumbs
    const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'All Employee', link: '/modules/hr/employee' },
        { text: 'View Employee', link: `/modules/hr/employee/details/[id]` }
    ]

    return (
        <>
            <HeadSection title="Employee Basic Info" />
            <div className="container-fluid ">
                {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
                <div className="row">
                    {/* Column */}
                    <div className="col-lg-6">
                        <div className="card shadow">
                            <div className="card-body">

                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <h3 className="box-title ">Employee’s Basic Info</h3>
                                        <div className="table-responsive">
                                            <table className="table text-capitalize">
                                                <tbody>
                                                    <tr>
                                                        <td width={390}>Name</td>
                                                        <td>{details && details?.data?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Description</td>
                                                        <td>
                                                            {details && details?.data?.description}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Address</td>
                                                        <td>{details && details?.data?.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Department of the Employee</td>
                                                        <td>{details && details?.data?.department?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Designation of the  Employee</td>
                                                        <td>{details && details?.data?.designation?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Gender</td>
                                                        <td>{details && details?.data?.gender}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Salary Type</td>
                                                        <td>{details && details?.data?.salary_type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Salary Amount</td>
                                                        <td>{details?.data?.salary_amount}  <ActiveCurrency /> </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mobile</td>
                                                        <td>{details && details?.data?.mobile}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>E-mail</td>
                                                        <td>{details && details?.data?.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status</td>
                                                        <td>{details && details?.data?.status}</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <h3 className="box-title">Creation/updation related info</h3>
                                        <div className="table-responsive">
                                            <table className="table text-capitalize">
                                                <tbody>
                                                    <tr>
                                                        <td width={390}>Created By</td>
                                                        <td>{details && details?.data?.creator.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Created At</td>
                                                        <td>{details && details?.data?.created_at}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Updated By</td>
                                                        <td>{details && details?.data?.updated_by}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Updated At</td>
                                                        <td>{details && details?.data?.updated_at}</td>
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
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card shadow">
                                    <div className="border-bottom title-part-padding">
                                        <h4 className="card-title mb-0">Employee’s Leave History</h4>
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
                    {/* Column */}

                </div>



            </div>
        </>
    );
}