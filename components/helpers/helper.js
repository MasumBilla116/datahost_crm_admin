import React from 'react'
import * as CryptoJS from 'crypto-js';

const encrypt=(id)=>{
  const key = '123';
  const passphrase = `${id}`;
  const encrypted = CryptoJS.AES.encrypt(passphrase, key).toString();

  const encryptedId = encrypted.replace(/\//g,'--');
  return encryptedId;
}

const decrypt=(id)=>{
  const key='123';
  const str = id.replace(/--/g,'/');
  const decryptedId = CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
  return decryptedId;
}

export {encrypt,decrypt};