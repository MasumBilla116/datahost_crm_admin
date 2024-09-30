import * as CryptoJS from "crypto-js";
import Cookies from "js-cookie";

export const setCookie = (key,data)=>{
    if(data !== '' && data !== undefined)
    {
        const encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), `${process.env.NEXT_PUBLIC_SECRETE_KEY}`).toString();
        const _domain = window.location.hostname; 
        Cookies.set(key,encryptData,{expires:7,domain:_domain });
    }
}

export const getCookie = (key) => {
    const hasData = Cookies.get(key);
    if (hasData !== undefined && hasData !== '') { 
        const decryptedData = CryptoJS.AES.decrypt(hasData, `${process.env.NEXT_PUBLIC_SECRETE_KEY}`);
        const originalData = decryptedData.toString(CryptoJS.enc.Utf8);        
        return JSON.parse(originalData);
    }
    return null;  
}


export const removeCookie = (key) =>{
    if(key !== '' && key !== undefined)
    { const _domain = window.location.hostname; 
        Cookies.remove(key,{domain:_domain});
    }
}
 
