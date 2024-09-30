import { createTheme } from "@mui/material/styles";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa";
import toast from "../../../../components/Toast/index";
import Select from "../../../../components/elements/Select";
import Select2 from "../../../../components/elements/Select2";
import Axios from "../../../../utils/axios";
import PrintButton from "../../../../components/elements/PrintButton";
import { HeadSection } from "../../../../components";

//Delete component
const DeleteComponent = ({ onSubmit, invoiceId, pending }) => {
  let myFormData = new FormData();

  myFormData.append("action", "deleteInvoice");
  myFormData.append("invoice_id", invoiceId);

  return (
    <>
      <Modal.Body>
        <Modal.Title>Are you sure to Cancel </Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => onSubmit(myFormData)}
        >
          Confirm Cancel
        </Button>
      </Modal.Footer>
    </>
  );
};

export default function ListView() {
  const { http } = Axios();
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
  const handleOpenDelete = (voucherId) => {
    setShowDeleteModal(true);
    setInvoiceId(voucherId);
  };

  //Delete Tower form
  const handleDelete = async (formData) => {
    let isSubscribed = true;
    setPending(true);
    await http
      .post(
        `${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`,
        formData
      )
      .then((res) => {
        if (isSubscribed) {
          notify("success", "successfully deleted!");
          handleExitDelete();
          setPending(false);
        }
      })
      .catch((e) => {
        console.log("error delete !");
        setPending(false);
      });

    fetchItemList();

    return () => (isSubscribed = false);
  };

  //Voucher data list
  const [itemList, setItemList] = useState([]);
  const [pending, setPending] = useState(false);
  const [invoice_id, setInvoiceId] = useState("");

  //   React.useEffect(() => {
  //     const timeout = setTimeout(() => {
  //           fetchItemList();
  //     });
  //     return () => clearTimeout(timeout);
  // }, []);

  const handleDownloadPdf = async () => {
    const element = document.getElementById("printME");
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    const marginTop = 15; // Adjust this value to set the desired top margin

    pdf.addImage(data, "PNG", 0, marginTop, pdfWidth, pdfHeight);
    // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("ledger.pdf");
  };

  const [sectorLists, setSectorList] = useState([]);

  const [ledgerFilter, setLedgerFilter] = useState({
    account_type: "",
    // sector_id: [],
    sector_name: "",
    // start_date:null,
    // end_date:null
    sector_id: null,
    parent_id: null,
  });

  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: { color: "red" },
        },
      },
    },
  });

  //start date and end date
  const [dobOpenStartDate, setDobOpenStartDate] = useState(false);
  const [dobOpenEndDate, setDobOpenEndDate] = useState(false);
  const [start_date, set_start_date] = useState(null);
  const [end_date, set_end_date] = useState(null);
  //  start_date,end_date
  const [totalCredit, setTotalCredit] = useState("");
  const [totalDebit, setTotalDebit] = useState("");

  const [childrenData, stChildrenData] = useState([]);
  const handleChange = (e) => {
    setLedgerFilter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const changeSector = (e) => {
    if (e.target.value) {
      setLedgerFilter((prev) => ({
        ...prev,
        sector_id: e?.target?.value,
        sector_name: $("#sectorSelect")
          .find("option:selected")
          .attr("data_name"),
      }));
    }
  };

  // const filterLedger = async () => {
  //   await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/voucher`, { ...ledgerFilter, start_date, end_date, action: "getAllLedgerByFiltered" })
  //     .then((res) => {
  //       setItemList(res?.data?.data?.ledgers);
  //       setTotalCredit(res.data.data.total_credit)
  //       setTotalDebit(res.data.data.total_debit)
  //     })
  // };

  // const filterLedger = async () => {
  //   await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, { ...ledgerFilter, action: "getAllSectorsTryToFixed" })
  //     .then((res) => {
  //       const filteredData = res.data.data.filter(item => item.children_recursive.length > 0);

  //       if (filteredData.length === 0) {
  //         stChildrenData(res.data.data);
  //       } else {stChildrenData(res.data.data);}
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const [usersDatalist, setUsersDatalist] = useState([]);
  const filterLedger = async () => {
    await http
      .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/general-ledger`, {
        ...ledgerFilter,
        action: "getAllLedgerUsers",
      })
      .then((res) => {
        setUsersDatalist(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [option, setOption] = useState([]);
  const treeFilterData = function (jsonData, level = "") {
    for (const parent of jsonData) {
      if (parent?.children_recursive?.length > 0) {
        setOption((prev) => [
          ...prev,
          {
            value: parent.id,
            label: level + parent.title,
            parent_id: parent.parent_id,
          },
        ]);

        treeFilterData(parent.children_recursive, level + "----");
      }
      // else {
      //   setOption((prev) => ([...prev, { value: parent.id, label: level + parent.title }]));

      // }
    }
  };

  useEffect(() => {
    setOption([]);
    sectorLists.length && treeFilterData(sectorLists);
  }, [sectorLists.length]);

  useEffect(() => {
    const controller = new AbortController();
    const sectorList = async () => {
      await http
        .post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/accounts/sector`, {
          account_type: ledgerFilter.account_type,
          action: "getSubSectors",
        })
        .then((res) => {
          setSectorList(res.data.data);
        });
    };
    sectorList();
    return () => controller.abort();
  }, [ledgerFilter.account_type]);

  //Fetch List Data for datatable
  // const data = itemList?.data;

  //breadcrumbs
  const breadcrumbs = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "All Accounts Ledgers", link: "/modules/accounts/ledger" },
  ];

  return (
    <div className="container-fluid">
      {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
      <HeadSection title="Accounts Ledgers" />

      <div className="row">
        <div className="col-12 p-xs-2">
          <div className="card shadow">
            <div className="d-flex border-bottom title-part-padding align-items-center">
              <div>
                <h4 className="card-title mb-0">All Accounts Ledgers</h4>
              </div>
              <div className="ms-auto flex-shrink-0">
                {/* Delete Modal Form */}
                <Modal show={showDeleteModal} onHide={handleExitDelete}>
                  <Modal.Header closeButton></Modal.Header>
                  <DeleteComponent
                    onSubmit={handleDelete}
                    invoiceId={invoice_id}
                    pending={pending}
                  />
                </Modal>
              </div>
            </div>

            <div className="card-body p-3">
              <div className="mb-3 row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <label className="col-form-label ">
                    Select Account Type:
                  </label>
                  <Select name="account_type" onChange={handleChange}>
                    <option value="">Select Account type</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="revenue">Revenue</option>
                    <option value="expenditure">Expenditure</option>
                  </Select>
                </div>

                <div className="col-lg-3 col-md-6 col-sm-12">
                  <label className="col-form-label ">Select Sector:</label>
                  <Select2
                    // isMulti={true}
                    options={option}
                    // onChange={(e) => setLedgerFilter((prev) => ({ ...prev, sector_id: Array.isArray(e) ? e.map(x => x.value) : [] }))}
                    onChange={(e) => {
                      if (e) {
                        const cleanedLabel = e.label.replace(/-/g, ""); // Remove hyphens from the label
                        setLedgerFilter((prev) => ({
                          ...prev,
                          sector_id: e.value,
                          parent_id: e.parent_id,
                          sector_name: cleanedLabel, // Set the cleaned label
                        }));
                      } else {
                        // Handle the case when nothing is selected
                        setLedgerFilter((prev) => ({
                          ...prev,
                          sector_id: null,
                          parent_id: null,
                          sector_name: null, // Set label to null or an empty string based on your requirements
                        }));
                      }
                    }}
                    name="access_id"
                    maxMenuHeight={1200}
                    menuPosition="fixed"
                  />
                </div>
                <div className="col-md-12 col-sm-12 col-lg-6 "> 
                  <Button variant="success" className="cust-mt-2.2rem w-xs-100" onClick={filterLedger}>
                    <span className="fs-5 me-1"></span>View Ledger
                  </Button>
                </div>
              </div>
              <div className="table-responsive"> 
                <div id="printME" className="mt-5 p-5">
                  {usersDatalist?.length ? (
                    <>
                      <div className="border-bottom title-part-padding">
                        <h4 className="card-title mb-0">All Ledgers</h4>
                      </div>
                      <div className="card-body  p-0">
                        <div className="table-responsive">
                          <table
                            id="multi_col_order"
                            className="table table-striped table-bordered display"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {usersDatalist?.map((item, index) => (
                                <>
                                  {item.itemId !== null && (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <Link
                                          href={`/modules/accounts/ledger/transection_history/[account_type]/[id]`}
                                          as={`/modules/accounts/ledger/transection_history/${ledgerFilter.sector_name}/${item.id}`}
                                        >
                                          <a>{item.name}</a>
                                        </Link>
                                      </td>
                                      {/* <td>{item.account_type}</td> */}
                                      {/* <td>{moment(item.created_at).format('DD/MM/YYYY')}</td> */}
                                    </tr>
                                  )}
                                </>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6 text-end">
                      <PrintButton contentId="printME" />
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
