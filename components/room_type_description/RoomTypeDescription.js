import { CKEditor } from "ckeditor4-react";
import { useEffect, useState } from "react";
import Axios from '../../utils/axios';


export default function RoomTypeDescription({roomTypeId,handleEditorData}){
    const {http} = Axios();
 
    const [roomTypeDescription,setRoomTypeDescription] = useState("");

    const fetchRoomTypeData = async ()=>{  
        await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/roomManagement/room_type`,{action: "roomTypeInfo", room_type_id:roomTypeId })
        .then((res)=>{
            setRoomTypeDescription(res?.data?.data?.description) 
        })
        .catch((err)=>{
          console.log('Something went wrong !') 
        }); 
      }
      
      useEffect(()=>{
        fetchRoomTypeData();
      },[roomTypeDescription])

    return( 
        <CKEditor  placeholder="Enter Room Description"
            // onFocus={handleEditorData}
            // onBlur={handleEditorData } 
            // onSelectionChange={handleEditorData}
            // onChange={handleEditorData} 
            initData={ roomTypeDescription }
            onSetData={roomTypeDescription}
        />
    )
};