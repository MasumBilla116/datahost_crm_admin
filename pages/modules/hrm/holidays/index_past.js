import moment from 'moment';
import Link from 'next/link';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import HeadSection from '../../../../components/HeadSection';
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import Label from '../../../../components/elements/Label';
import Select2 from '../../../../components/elements/Select2';
import TablePlaceholder from '../../../../components/placeholder/TablePlaceholder';
import Axios from '../../../../utils/axios';
import style from './holiday.module.css';

export default function tableList() {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const { http } = Axios();

  const options = [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
  ];

  const [holidays, setHolidayList] = useState([]);
  const [year, setYear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    holidayList()
  }, [year]);

  const holidayList = async () => {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "getHolidays", year: year })
      .then((res) => {
        // console.log(res)
        setHolidayList(res.data.data);
        setLoading(false);
      });
  };

  //-------------------------search by title ------------------


  useEffect(() => {
    let controller = new AbortController();
    const result = holidays?.filter((dept) => {
      return dept.title.toLowerCase().match(search.toLocaleLowerCase())
    });

    setHolidayList(result);
    return () => controller.abort();
  }, [search])

  //-------------------------search by title end ------------------

  async function deleteHoliday(id) {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "deleteHoliday", holiday_id: id })
      .then((res) => {
        notify("success", "successfully has been deleted!");
        setLoading(false);
      });
    holidayList()
  }


  if (loading)
    return (
      <>
        <HeadSection title="All-Holidays" />

        <TablePlaceholder header_name="All-Holidays" />
      </>
    );

  const RedLed = () => {
    return (<div className={style.ledbox}>
      <div className={style.ledred}></div>
      <p>Yellow LED</p>
    </div>)
  }
  const GreenLed = () => {
    return (<div className={style.ledbox}>
      <div className={style.ledgreen}></div>
      <p>Yellow LED</p>
    </div>)
  }


  const columns = [

    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,

    },
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,

    },
    {
      name: 'Type',
      selector: row => row.type,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },

    {
      name: 'Created By',
      selector: row => row.creator.name,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => moment(row.created_at).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Updated At',
      selector: row => moment(row.updated_at).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => actionButton(row.id),
    },

  ];

  const conditionalRowStyles = [
    {
      when: row => row.status == 0,
      style: {
        color: 'red',
      }
    },

  ];

  const actionButton = (id) => {
    return <>
      <ul className="action">
        <li>
          <Link href={`/modules/hrm/holidays/update/${id}`}>
            <a>
              <EditIcon />
            </a>
          </Link>
        </li>

        <li>

          <Link href='#'>
            <a onClick={() => deleteHoliday(id)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>
      </ul>
    </>
  }



  //breadcrumbs
  const breadcrumbs = [
    { text: 'Dashboard', link: '/dashboard' },
    { text: 'All Holidays', link: '/modules/hr/holidays' },
  ];

  return (
    <>
      <HeadSection title="All-Holidays" />

      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12 p-xs-2">
            <div className="card mb-xs-1">
              {/* <div className="border-bottom title-part-padding">
              <h4 className="card-title mb-0">All Holidays</h4>
              <Link href="/modules/housekeeping/managelaundryoperator/laundryReceiveBackSlip/createlaundryReceiveBackSlip/rcv-back">
                      <Button
                        className="shadow rounded"
                        variant="primary"
                        type="button"
                        // onClick={handleShow}
                        // block
                      >
                        Create Laundry Receive Back Slip
                      </Button>
                      </Link>
            </div> */}

              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Holidays</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  <Link href="/modules/hrm/holidays/create">
                    <Button
                      className="shadow rounded btn-sm"
                      variant="primary"
                      type="button"
                      block
                    >
                      Add Holiday
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="card-body">
                <div className="mb-3 row">
                  <Label text="Select Year :" />
                  <div className="col-sm-5">
                    <Select2 options={options} onChange={(options) => setYear(options.value)} />
                  </div>
                </div>

                <DataTable
                  columns={columns}
                  data={holidays}
                  pagination
                  highlightOnHover
                  subHeader
                  conditionalRowStyles={conditionalRowStyles}
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
    </>
  );
}


