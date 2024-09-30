import { useRouter } from 'next/router';
import { useEffect } from 'react';
const Logout = ({props}) =>{

useEffect(async()=>{
const router = useRouter();
let controller = new AbortController();
    try{
        // removeSession();
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('status');
        window.localStorage.removeItem('response'); 
        // router.push('/user/login',null, {shallow:true}); 
        router.push('/user/login'); 
    }
    catch(e){
        throw e;
    }
    return () => controller.abort();
},[]);


    return null;

//router.push('/user/login')
// if (router.isFallback) {
//     return (<h1>Data is loading</h1>);
// }
    //return <div className="loader">Loading...</div> 
};

//let nothing: void = Logout();
//module.exports = Logout;
export default Logout;