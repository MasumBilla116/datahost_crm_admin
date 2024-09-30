import { useEffect } from 'react';
import { useRouter } from "next/router";
// import { getToken } from '../../../../utils/getdata';
import Axios from '../../../../../utils/axios';
// import useSWR from 'swr';
import { ToastContainer, toast } from 'react-toastify';
const Delete = () => {
    const { http } = Axios();
    const router = useRouter();
    const { id } = router.query;
    // const response = userData.response && userData.response;
    const notify = (msg:any) => toast(msg);
 
    // const body = {
    // action: "deleteDepartment",
    // department: id,
    // };

    useEffect(()=>{

        // const fetcher1 = async (url:string, bodyPart:any, head:any) => await http.post(body).then((res) => res.data);
        // const { data, error } = useSWR('http://hotel.api/app/hrm/departments', fetcher1);
        const fetcher1 = async () => {
            const body = {
                action: "deleteDepartment",
                department: id,
            };
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/hrm/departments`,
                body
            ).then(res => {
                notify('Item Deleted Successfully!');
                router.push('modules/hr/department/list');
            }).catch((err) => {
                console.log('Something went wrong !' + <br /> + err)
            });
        }

        fetcher1();

        return () => controller.abort();
    
    },[])


    return (
        <>
        <ToastContainer position="top-center"
            draggable
            closeOnClick
        />
        </>
    )
}

export default Delete