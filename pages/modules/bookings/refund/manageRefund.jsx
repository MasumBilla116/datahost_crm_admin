import React, { useEffect, useState } from 'react'
import { HeadSection } from '../../../../components'
import Select2 from "../../../../components/elements/Select2";
import Axios from '../../../../utils/axios';
import DataTable from 'react-data-table-component';
import { Form, Modal } from "react-bootstrap";
import Button from '@mui/material/Button';
import MyToast from '@mdrakibul8001/toastify';

//RejectRefund
const WithDrawForm = ({ onSubmit, bookingId, refundable }) => {
    
    const [RefundAmount, setRefundAmount] = useState(refundable);
    const { http } = Axios();
    const [accounts, setAccounts] = useState([]);
    const [accountId, setAccountId] = useState();
    useEffect(() => {
        let isSubscribed = true;
        const fetchAllAccounts = async () => {
            await http
                .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts`, {
                    action: "listAccounts",
                })
                .then((res) => {
                    if (isSubscribed) {
                        setAccounts(res.data?.data);
                    }
                })
                .catch((err) => console.log(err));
        };
        fetchAllAccounts();
        return () => (isSubscribed = false);
    }, []);

    useEffect(() => {
        !!refundable && setRefundAmount(refundable);
    }, [])

    let dataset = { action: "withdrawRefund", booking_id: bookingId, withdraw_amount: RefundAmount,account_id:accountId }

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Refundable Amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter Refundable Amount"
                        name="refund_amount"
                        value={RefundAmount}
                        onChange={(e) => {
                            const enteredValue = parseFloat(e.target.value);
                            const newRefundAmount = isNaN(enteredValue) ? 0 : enteredValue;

                            if (newRefundAmount > refundAmount) {
                                setRefundAmount(refundAmount);
                            } else {
                                setRefundAmount(newRefundAmount);
                            }
                        }}
                    // disabled={refundDetails.calculation_type !== "custom_calculate"}
                    />

                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Payment Account{" "}
                    </Form.Label>

                    <Select2
                        maxMenuHeight={140}
                        options={accounts.map(
                            ({ id, account_name }) => ({
                                value: id,
                                label: account_name,
                            })
                        )}
                        onChange={(e) => setAccountId(e.value)}

                    // disabled={parseInt(bookingGrp?.payment_status) === 2}
                    // isDisabled={parseInt(bookingGrp?.payment_status) === 2}
                    />
                </Form.Group>
                <Form.Group>
                    <Button variant="contained" color="success" className="shadow rounded float-right" style={{ marginTop: "15px" }} onClick={() => onSubmit(dataset)} block="true" >
                        Refund
                    </Button>
                </Form.Group>
            </Form>
        </>
    );
};

const ManageRefund = () => {
    const [loading, setLoading] = useState(false);
    const [allRefundable, setAllRefundable] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [bookingId, setBookingId] = useState();
    const [withdrawAmount, setWithdrawAmount] = useState();
    const { notify } = MyToast();
    const { http } = Axios();
    const [search, setSearch] = useState("");
    const FetchAllRefundable = async () => {
        setLoading(true);
        try {
            const res = await http.post(
                `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`,
                {
                    action: "getAllRefund",
                }
            );
            setAllRefundable(res.data ?? []);
            setFilteredData(res.data?.data)
        } catch (error) {
            console.error("Something went wrong:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchAllRefundable();
    }, []);


    const salesColumns = [
        {
            name: "SL",
            selector: (row, index) => 1 + index,
            sortable: true,
        },
        {
            name: "booking Id",
            selector: (row) => row.booking_id,
            sortable: true,
        },
        {
            name: "Customer",
            selector: (row) => row.first_name,
            sortable: true,
        },
        {
            name: "Customer Mobile No",
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: "Paid Amount",
            selector: (row) => row.paid_amount,
            sortable: true,
        },
        {
            name: "Refund Amount",
            selector: (row) => row.refund_amount,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => (
                <span className={row.status === 2 ? "text-success" : "text-orange"}>
                    {row.status === 2 ? "Success" : "Processing"}
                </span>
            ),
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => action(row),
            center: true,
        },
    ];
    
    const action = (row) => {
        if (row.status === 2) {
            // Don't show the Withdraw button if status is 3 (Success)
            return null;
        }
    
        return (
            <>
                <ul className="action">
                    <li>
                        <button
                            className="btn btn-success me-2 btn-sm"
                            onClick={() => {
                                setBookingId(row?.booking_id);
                                setWithdrawAmount(parseFloat(row?.refund_amount));
                                handleOpenWithdrawModal();
                            }}
                        >
                            Withdraw
                        </button>
                    </li>
                </ul>
            </>
        );
    };
    
    const data = allRefundable?.data;
    useEffect(() => {
        let controller = new AbortController();
        const result = data?.filter((item) => {
            return item.mobile.toLowerCase().match(search.toLocaleLowerCase())
        });

        setFilteredData(result);
        return () => controller.abort();
    }, [search])




    /**
     * ----------------------------------------
     * -------------withdraw process-----------
     * ----------------------------------------
     */

    //Refund Modal
    const [showRejectRefund, setShowWithdraw] = useState(false);
    const handleCloseWithdrawModal = () => setShowWithdraw(false);
    const handleOpenWithdrawModal = () => {
        setShowWithdraw(true);
    }


    const submitWithDrawForm = async (formData) => {
        // return;
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/booking`, formData)
            .then((res) => {
                    notify("success", "Amount has been refunded!");
                    handleCloseWithdrawModal();
                    FetchAllRefundable();
                

            })
            .catch((e) => {
                const msg = e.response?.data?.response;

                if (typeof (msg) == 'string') {
                    notify("error", `${msg}`);
                }
            });

    }

    return (
        <>
            <HeadSection title="All-Refund" />
            <div className="container-fluid">

                <div className="row">
                    <div className="col-12 p-xs-2 ">
                        <div className="card shadow">

                            <div className="d-flex border-bottom title-part-padding align-items-center">
                                <div>
                                    <h4 className="card-title mb-0">Refundable List</h4>
                                </div>
                                <div className="ms-auto flex-shrink-0">


                                </div>
                            </div>

                            <div className="card-body">



                                <DataTable
                                    columns={salesColumns}
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



            {/* withdraw Modal */}
            <Modal show={showRejectRefund} onHide={handleCloseWithdrawModal}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <WithDrawForm onSubmit={submitWithDrawForm} bookingId={bookingId} refundable={withdrawAmount} />
                </Modal.Body>

            </Modal>
            {/* End withdraw Modal */}
        </>
    )
}

export default ManageRefund