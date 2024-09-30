import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DeleteIcon from '../../../../../components/elements/DeleteIcon';
import EditIcon from '../../../../../components/elements/EditIcon';
import HeadSection from '../../../../../components/HeadSection';
import TablePlaceholder from '../../../../../components/placeholder/TablePlaceholder';
import toast from "../../../../../components/Toast/index";
import Axios from '../../../../../utils/axios';
import { getSSRProps } from '../../../../../utils/getSSRProps';

export const getServerSideProps = async (context) => {
  const { permission, query, accessPermissions } = await getSSRProps({
    context: context,
    access_code: "m.hrm.lvaplctn",
  });
  return {
    props: {
      permission,
      query,
      accessPermissions,
    },
  };
};

export default function tableList({accessPermissions}) {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const { http } = Axios();

  const [leaves, setLeaveList] = useState([]);
  const [leavelist, setLeavelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    $("#multi_col_order").DataTable();
  });



  React.useEffect(() => {
    const timeout = setTimeout(() => {
      leaveList();
    });
    return () => clearTimeout(timeout);
  }, []);

  const leaveList = async () => {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "getAllLeaveCategories" })
      .then((res) => {
        setLeaveList(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      });
  };

  async function deleteLeave(id) {
    setLoading(true);
    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`, { action: "deleteLeaveCategory", leave_id: id })
      .then((res) => {
        notify("success", "successfully has been deleted!");
        setLoading(false);
      });
    leaveList()
  }

  let data = leaves;
  let listOfTitle;
  console.log(leaves)
  for (let item of data) {
    console.log(item.title)
  }

  useEffect(() => {
    let controller = new AbortController();
    const result = data?.filter((leave) => {
      return leave.title.toLowerCase().match(search.toLocaleLowerCase())
    });

    setLeaveList(result);
    return () => controller.abort();
  }, [search])


  if (loading)
    return (
      <>
        <HeadSection title="All-Leave-Categories" />

        <TablePlaceholder header_name="All-Leave-Categories" />

      </>
    );


  const columns = [

    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    // {
    //   name: 'Description',
    //   selector: row => row.description,
    //   sortable: true,
    // },
    {
      name: 'Application Count',
      selector: row => row.applications.length,
      sortable: true,
    },
    {
      name: 'Created By',
      selector: row => row.creator.name,
      sortable: true,
    },

    {
      name: 'Created At',
      selector: row => moment(row.created_at).format('Do MMM YYYY'),
      sortable: true,
    },

    {
      name: 'Updated By',
      selector: row => row.updator ? row.updator.name : 'Not Updated',
      sortable: true,
    },
    {
      name: 'Updated At',
      selector: row => moment(row.updated_at).format('Do MMM YYYY'),
      sortable: true,
    },

    {
      name: 'Action',
      selector: row => actionButton(row),
    },

  ];





  // {row.status=1 ? style={{color:"red"}} : style={{color:"green"}} }
  const actionButton = (row) => {
    return <>
      <ul className="action" >
        {/* <li>
            <Link href={`/modules/hr/department/details/${id}`}>
              <a>
                <ViewIcon />
              </a>
            </Link>
          </li> */}
        {accessPermissions.createAndUpdate &&<li>
          <Link href={`/modules/hrm/leave-application/categories/update/${row.id}`}>
            <a>
              <EditIcon />
            </a>
          </Link>
        </li>}

        {accessPermissions.delete &&<li>

          <Link href='#'>
            <a onClick={() => deleteLeave(row.id)}>
              <DeleteIcon />
            </a>
          </Link>

        </li>}
      </ul>
    </>
  }



  const conditionalRowStyles = [
    {
      when: row => row.status == 0,
      style: {
        color: 'red',
      }
    },


  ];


  //breadcrumbs
  // const breadcrumbs = [
  //   { text: 'Dashboard', link: '/dashboard' },
  //   { text: 'All Leave-Categories', link: '/modules/hr/leaveCategories' },
  // ];

  return (
    <>
      <HeadSection title="All-Leave-Categories" />

      <div className="container-fluid">
        {/* <Breadcrumbs crumbs={breadcrumbs} currentPath={pathname} /> */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="d-flex border-bottom title-part-padding">
                <div>
                  <h4 className="card-title mb-0">All Leave-Categories</h4>
                </div>
                <div className="ms-auto flex-shrink-0">
                  <Link href="/modules/hrm/leave-application/categories/create">
                    <Button
                      className="shadow rounded btn-sm"
                      variant="primary"
                      type="button"
                      block
                    >
                      Create Leave-Categories
                    </Button>
                  </Link>

                </div>
              </div>
              <div className="card-body">

                <DataTable
                  columns={columns}
                  data={leaves}
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
                />

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}