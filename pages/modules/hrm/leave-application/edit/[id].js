import React,{ useEffect, useState } from "react";
import Button from '../../../../../components/elements/Button';
import Form from '../../../../../components/elements/Form';
import Label from '../../../../../components/elements/Label';
import Option from '../../../../../components/elements/Option';
import RadioButton from '../../../../../components/elements/RadioButton';
import Select2 from '../../../../../components/elements/Select2';
import TextInput from '../../../../../components/elements/TextInput';
import MyComponent from '../../../../../components/elements/Select2';
import HeadSection from '../../../../../components/HeadSection';
import Axios from '../../../../../utils/axios';
import { useRouter } from 'next/router';
import toast from "../../../../../components/Toast/index";

const EditApplication = () => {
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

    const [dates, setDates] = useState([
        {
        startDate: new Date(),
        endDate: new Date(),
        key: "selectionn",
        },
    ]);
    

    // var startDate = format(dates[0].startDate,"MM/dd/yyyy");
    // var endDate = format(dates[0].endDate,"MM/dd/yyyy");
    const [loading, setLoading] = useState(true);
    const {http} = Axios();
    const router = useRouter();
    const { id } = router.query;

    const [date, setDate] = useState([]);
    const [subject, setSubject] = useState("");
    const [leave_category, setLeavecategory] = useState("");
    const [leave_category_obj, setLeavecategoryObj] = useState();
    const [duration, setDuration] = useState("");
    const [description, setDesc] = useState("");
    const [getLeaveCategories, setLeaveCategories] = useState("");
    const leaveCategory_options = getLeaveCategories.data;
    const selected_leaveCategory_options = {value:leave_category_obj?.id, label:leave_category_obj?.title};

    const options = [
      { value: 'Single Day', label: 'Single Day' },
      { value: 'Half Day', label: 'Half Day' },
      { value: 'Multiple Day', label: 'Multiple Day' }
    ];

    useEffect(() =>{
      const getApplication = async () =>{
        setLoading(true);
        const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`,{action: "getLeaveApplicationInfo",application_id: id})
        setSubject(res.data.data.subject);
        setDesc(res.data.data.description);
        setLeavecategory(res.data.data.leave_category_id);
        setLeavecategoryObj(res.data.data.leave_category);
        //setDuration(res.data.data.status);
        setDate(res.data.data.date);
        setLoading(false);
      }

      async function getLeavecategories(){
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`,{action: "getAllLeaveCategories",})
        .then((res)=>{
          setLeaveCategories(res.data);
        });
      }

      router.isReady && getApplication()
      getLeavecategories()

    },[id])

    async function submitForm(e) {
      e.preventDefault();
      await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/leaves`,{action: "editEmployeeLeave", application_id: id, subject, leave_category, description, })
      .then((res)=>{
        notify("success", "successfully Updated Leave Category!");
         router.push('/modules/hr/leaveApplications');
      }).catch((e)=>{

        const msg = e.response.data.response;

         if(typeof(e.response.data.response) == 'string'){
          notify("error", `${e.response.data.response}`);
         }
         else{
            if(msg.subject){
              notify("error", `${msg.subject.subject}`);
            }
            if(msg.leave_category){
              notify("error", `${msg.leave_category.leave_category}`);
            }
        }
      });
    }

    // if (loading)
    // return (
    //   <>
    //     <HeadSection title="Edit-Leave-Category" />
    //     <div className="container-fluid d-flex justify-content-center align-items-center">
    //       <div className="spinner-border" role="status">
    //         <span className="visually-hidden">Loading...</span>
    //       </div>
    //     </div>
    //   </>
    // );

    return ( 

      <>
      <div className="container-fluid ">
        <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body border-bottom">
                  <h4 className="card-title">Edit Leave-Application</h4>
                </div>

                <Form onSubmit={submitForm}>
                    <div className="card-body">

                        <TextInput label="Subject Of Leave Application" placeholder="Subject Of Leave Application" value={subject} onChange={(e)=>setSubject(e.target.value)} />

                        {
                        loading && 
                        <div className="mb-3 row">
                            <Label text="Select Leave Category" />
                            <div className="col-sm-9">
                            <Select2
                                options={leaveCategory_options?.map(({ id, title }) => ({ value: id, label: title}))}
                                defaultValue={{value:"", label:"loading..."}}
                                onChange={(e) =>setLeavecategory(e.value)}
                            />
                            </div>
                        </div>
                        }

                        { !loading &&
                        <div className="mb-3 row">
                            <Label text="Select Leave Category" />
                            <div className="col-sm-9">
                            <Select2
                                options={leaveCategory_options?.map(({ id, title }) => ({ value: id, label: title}))}
                                defaultValue={selected_leaveCategory_options}
                                onChange={(e) =>setLeavecategory(e.value)}
                            />
                            </div>
                        </div>
                        }

                        <TextInput label="Description" placeholder="Description" value={description} onChange={(e)=>setDesc(e.target.value)} />

                        <div className="mb-3 row">
                        <Label text="Select Duration"/>
                        <div className="col-sm-9">
                            <Select2  options={options}  onChange={(options)=> setDuration(options.value)}/>
                        </div>
                        </div>

                        <div className={`${(duration == 'Single Day') ? '' : (duration == 'Half Day') ? '' : 'd-none'}`}>
                        <div className="mb-3 row">
                        <Label text="Date"/>
                            <div className="col-sm-2">
                            <input type="date" onChange={(e) => setDate(e.target.value)} className="form-control" id="date" />
                            </div>
                        </div>
                        </div>

                        {/* <div className={`${(duration == 'Multiple Day') ? '' : 'd-none'}`}>
                            <div className="mb-3 row">
                                <Label text="Select Date Range"/>
                                <div className="col-sm-9">
                                <DateRange
                                editableDateInputs={true}
                                onChange={(item) => setDates([item.selectionn])}
                                moveRangeOnFirstSelection={false}
                                ranges={dates}
                                className="date"
                                minDate={new Date()}
                                />
                                </div>
                            </div>
                        </div> */}
                    </div>
                  <div className="p-3 border-top">
                    <div className="text-end">
                      <Button className="btn-info">
                        Update
                      </Button>

                      <Button className="btn-dark">
                        Cancel
                      </Button>

                    </div>
                  </div>
                </Form>

              </div>
            </div>
        </div>
    </div>
      </>
        
     );
}
 
export default EditApplication;