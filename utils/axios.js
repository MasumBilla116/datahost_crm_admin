// import MRIAxios from '@mdrakibul8001/axios';

// export default function Axios() {

//   return MRIAxios();

// }

import axios from 'axios';
import { useRouter } from 'next/router.js';
import { useState } from 'react';

export default function Axios() { 
  const router = useRouter();

      //get token string
      function getToken(){

        if (typeof window !== 'undefined') {
          const tokenString = localStorage.getItem('token');
          return JSON?.parse(tokenString);
        }


    }
    //get user string
    function getUser(){
      if (typeof window !== 'undefined') {
        const tokenString = localStorage.getItem('token');
        if(tokenString !== null && tokenString !== undefined){
          const token = JSON.parse(tokenString)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse(window.atob(base64));
        }
        return false;
      }
    }

  const [user,setUser] = useState(getUser());
  const [token,setToken] = useState(getToken());

  function saveToken(user,token){
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      const storeToken = localStorage.setItem('token',JSON.stringify(token));
      setToken(storeToken);

      // const storeUser = localStorage.setItem('user',JSON.stringify(user));
      // setUser(storeUser);

      router.replace("/profile/user/", "/");

    }
  }

  function logout(){
    localStorage.clear();
     router.replace("/profile/user/", "/user/login");
  }

    const http = axios.create({
        // baseURL:"http://hotel.api",
        headers:{
            "Content-Type":"application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": `Bearer ${token}`
        }
    });

  return {
    http,
    saveToken,
    logout,
    token,
    user,
    getToken
  };
}