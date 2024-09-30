import React,{useEffect,useCallback,useState} from 'react';
import { useRouter } from 'next/router';
import Axios from '../../../../utils/axios';

const InfoPermission = () => {
  const { http } = Axios();
  const router = useRouter();
  const {
    isReady,
    query: {
      info,
    }
  } = router;


  const fetchRolePermissionsInfo=useCallback(async()=>{
    if(!isReady){
      console.log('fetching...')
      return;
    }

    let isSubscribed = true;

    await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`,{action: "GeneralSettingsValue", value: info })
    .then((res)=>{
      if(isSubscribed){
        console.log('response',res)
       
      }
    })
    .catch((err)=>{
      console.log('Something went wrong !')
 
    });

    return ()=> isSubscribed=false;

  },[isReady,info]);

  useEffect(()=>{
    fetchRolePermissionsInfo();
  },[fetchRolePermissionsInfo])


  console.log('info',info)

  return (
    <div> info </div>
  )
}

export default InfoPermission;