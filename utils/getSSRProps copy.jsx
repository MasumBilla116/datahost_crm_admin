

import { Decrypt } from "./EncryptDecrypt";
import FetchPermessionData from '../utils/FetchPermessionData';

export const getSSRProps = async ({ context, access_code }) => {
    // CheckAuthData(context);
    const { userId,permissions,roleId} = context.req.cookies || null;
    if (!roleId) {
        return false;
    }
    console.log("roleId",roleId);
    if (roleId === null && roleId === undefined) {
        return false;
    }
    const query = context.query;
    // const permissions = [];
    var decryptedRoleId = await Decrypt(roleId);
    console.log("decrypted Role Id",decryptedRoleId)
    const permissionData = await FetchPermessionData(decryptedRoleId);
    console.log("permissionData",permissionData)



    if (permissions !== null && permissions !== undefined) {
        var decryptedData = await Decrypt(permissions); 
        
        const decryptedUserId = await Decrypt(userId); 
        var accessPermissions = { 
            listAndDetails: false,
            createAndUpdate: false,
            delete: false,
            download: false,
        };

        if((decryptedUserId === 1) || (decryptedUserId === 2)){
            accessPermissions = { 
                listAndDetails: true,
                createAndUpdate: true,
                delete: true,
                download: true,
            };
            // decryptedData =  ['m.cstmr','m.hrm'];
        } else {            
            if (!decryptedData.includes(access_code)) {
                context.res.writeHead(302, { Location: "/access-denide" });
                context.res.end();
            }
            accessPermissions = { 
                listAndDetails: decryptedData.includes(`${access_code}.list_dtls`),
                createAndUpdate: decryptedData.includes(`${access_code}.crt_updt`),
                delete: decryptedData.includes(`${access_code}.dlt`),
                download: decryptedData.includes(`${access_code}.dnld`),
            };
        } 
        return {
            query,
            accessPermissions,
            permission: decryptedData
        };
    }
    return false;
}