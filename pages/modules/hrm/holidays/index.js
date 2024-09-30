import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import FilterDatatable from "../../../../components/Filter/FilterDatatable";
import ServiceFilter from "../../../../components/Filter/ServiceFilter";
import toast from "../../../../components/Toast/index";
import DeleteIcon from '../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../components/elements/EditIcon';
import HolidayModal from "../../../../components/pages/Holidays/HolidayModal";
import Axios from '../../../../utils/axios';
import { getSSRProps } from "./../../../../utils/getSSRProps";
import { HeadSection } from '../../../../components';

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.hlds",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};


const AddHoliday = ({ accessPermissions }) => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const { http } = Axios();
  const router = useRouter();
  const { pathname } = router;

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDesc] = useState("");
  // const [date, setDate] = useState(null);
  const [status, setStatus] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dateState, setDateState] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);

  const [year, setYear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const[holiday_id,setHolidayId]=useState(null)


  /**** Table  */

  // @ Default date
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;

  const [currentPage, setCurrentPage] = useState(1)
  const [perPageShow, setPerPageShow] = useState(15)
  const [tblLoader, setTblLoader] = useState(true);
  const [filterValue, setFilterValue] = useState({
    status: "all",
    yearMonth: `${y}-${m}`,
    search: null,
    filter: false,
    paginate: true,
  });


  // for data table chagne
  const handleChangeFilter = (e) => {
    setFilterValue(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      paginate: true,
      filter: true
    }));
    setSearch("");
  };



  /**** Table  */


  React.useEffect(() => {
    const timeout = setTimeout(() => {
      holidayList();
    });
    return () => clearTimeout(timeout);
  }, [filterValue, currentPage]);

  const holidayList = async () => {
    let isSubscribed = true;
    setLoading(true);
    // setTimeout(async () => {
    if (!filteredData?.[currentPage] || filterValue.filter === true) {
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays?page=${currentPage}&perPageShow=${perPageShow}`, { action: "getHolidayList", filterValue: filterValue })
        .then((res) => {
          setFilteredData(prev => ({
            ...prev,
            total: res.data?.data?.total || prev.total,
            paginate: true,
            [currentPage]: res?.data?.data[currentPage]
          }));
          setLoading(false);
        });
        setFilterValue(prev => ({
        ...prev,
        filter: false,
        search: null
      }));
    }
    setTblLoader(false);
    // }, 800)
    return () => isSubscribed = false;

  };

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selectionn",
    },
  ]);

  const options = [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' }
  ];




  const columns = [

    {
      name: 'Date',
      selector: row => row.date,
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
      name: 'Action',
      selector: row => actionButton(row),
      width: "150px",                       // added line here
    },

  ];


  const actionButton = (row) => {
    return <>
      <ul className="action">
        {/* {accessPermissions.createAndUpdate && <li>
          <Link href="#" >
            <a onClick={() => handleOpen(row)}>
              <EditIcon />
            </a>
          </Link>
        </li>} */}

      <li>

          <Link href='#'>
            <a onClick={() => deleteHoliday(row.id)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>
      </ul>
    </>
  }


  async function deleteHoliday(id) {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/holidays`, { action: "deleteHoliday", holiday_id: id })
      .then((res) => {
        notify("success", "successfully has been deleted!");
        setLoading(false);
      });
      setFilterValue((prev)=>({
        ...prev,
        filter:true
    }))
    holidayList()
  }



  const conditionalRowStyles = [
    {
      when: row => row.status == 0,
      style: {
        color: 'red',
      }
    },

  ];




  //-----------------calender operation ------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(null);
  const [item, setItem] = useState({});
  const changeDate = (e) => {
    setDateState(e);
  }

  const handleClick = () => {
    // Show the value on single click
    // setSelectedDate(moment(dateState).format('YYYY-MM-DD'));
    setIsModalOpen(true);
    setHolidayId(null);

  };


  const handleOpen = (obj) => {
    // setIsModalOpen(true);
    setItem(obj);
  };

  const handleDoubleClick = () => {
    console.log("You have Clicked Twice");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFilterValue((prev)=>({
      ...prev,
      filter:true
  }))
    holidayList();

  };



  let selectedDate = moment(dateState).format('YYYY-MM-DD');

  const onDoubleClickCaptureHandler = () => {
    console.log("You have Clicked Twice");
  };


  //------------------------------calender operation end -------------------------------

  const dynamicStatusList = [
    { title: "All", value: "all", selected: true },
    { title: "Deleted", value: "deleted" },

  ];


  return (

    <>
    <HeadSection title="Holidays" />
      <div className="container-fluid ">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-lg-8 p-xs-2 d-flex align-items-stretch">
            <div className="card mb-xs-2 w-100">
              <div className="d-flex border-bottom title-part-padding align-items-center">
                <div>
                  <h4 className="card-title mb-0">All Holidays</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {accessPermissions.createAndUpdate && <Link href="/modules/hrm/holidays/leaveTypes">
                    <Button
                      className="shadow rounded btn-sm"
                      variant="primary"
                      type="button"
                      block
                    >
                      Add Leave Type
                    </Button>
                  </Link>}
                </div>
              </div>
              <div className="card-body">

                <ServiceFilter
                  statusList={dynamicStatusList}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleChangeFilter={handleChangeFilter}
                  placeholderText="Date / Type"
                />
                <FilterDatatable tblLoader={tblLoader} columns={columns} setFilterValue={setFilterValue} filteredData={filteredData} setCurrentPage={setCurrentPage} currentPage={currentPage} perPage={perPageShow} />



              </div>
            </div>
          </div>
          {/* -------------------------------------------------------------- */}
          {/* visit charts*/}
          {/* -------------------------------------------------------------- */}
          <div className="col-lg-4 p-xs-2 d-flex align-items-stretch">
            <div className="card mb-xs-2 w-100">
              <div className="card-body">
                <h4 className="card-title">
                  <span className="lstick" />

                </h4>
                <h5 style={{ color: "gray" }}> </h5>
                <div className="">
                  {/* <p>Selected Date is <b >{moment(dateState).format('YYYY-MM-DD')}</b></p> */}
                  <Calendar
                    className="w-100"
                    value={dateState}
                    onChange={changeDate}
                    onClickDay={() => handleClick()} // Use onClickDay instead of onClick
                    onDoubleClick={handleDoubleClick}
                  />

                  {/* Bootstrap Modal Component */}
                  <HolidayModal
                    isModalOpen={isModalOpen}
                    handleCloseModal={handleCloseModal}
                    selectedDate={selectedDate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddHoliday;