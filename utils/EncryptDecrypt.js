import * as CryptoJS from "crypto-js";

export const Encrypt = async(data)=>{
    if(data !== ''  && data !== undefined)
    {
        const encryptData = CryptoJS.AES.encrypt(JSON.stringify(data),`${process.env.NEXT_PUBLIC_SECRETE_KEY}`).toString();
        return encryptData   
    }
}


export const Decrypt = async(data) =>{
    if(data !== ''  && data !== undefined)
    {
        const decrypt  = CryptoJS.AES.decrypt(data,`${process.env.NEXT_PUBLIC_SECRETE_KEY}`);
        const originalData = decrypt.toString(CryptoJS.enc.Utf8);
        return JSON.parse(originalData);
    }
}