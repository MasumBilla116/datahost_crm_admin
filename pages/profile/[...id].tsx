import { useCallback, useEffect, useState } from 'react';
import toast from "../../components/Toast/index";
// import { getToken } from '../utils/getdata';
import Axios from '../../utils/axios';

const Profile = ({user1}) => {

  const notify = useCallback((type:any, message:any) => {
    toast({ type, message });
  }, []);

  const [user, setUser]:any = useState([]);
  // const {token} = getToken();
  const {token} = Axios();
  useEffect(() => {
    try {
      let localstoragevar: any = JSON.parse(localStorage.getItem("user") || "");
      let newVal: any = [];

      localstoragevar &&
        Object.keys(localstoragevar).map((item: any, i: any) => {
          newVal.push(localstoragevar[item]);
      });
      setUser(newVal)

      notify("success", "Successfully Logged In !");
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <>
    {<h1 className="text-center">Welcome to Your Profile {user[0]}</h1>}
    </>
  );
};
export default Profile;
