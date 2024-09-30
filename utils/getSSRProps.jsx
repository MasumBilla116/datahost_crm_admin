

import FetchPermessionData from '../utils/FetchPermessionData';
import { Decrypt } from "./EncryptDecrypt";

export const getSSRProps = async ({ context, access_code }) => { 
    // CheckAuthData(context);
    const { userId,roleId} = context.req.cookies || null;
    if (!roleId) {
        return false;
    }
    if (roleId === null && roleId === undefined) {
        return false;
    }
    const query = context.query;
    // let permissions = [];
    var decryptedRoleId = await Decrypt(roleId);
    const permissionData = await FetchPermessionData(decryptedRoleId);
    let permissions = permissionData;
    // console.log("permissions",permissions)


    if (permissions !== null && permissions !== undefined) {
        // var permissions = await Decrypt(permissions); 
        
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
            // permissions =  ['m.cstmr','m.hrm'];
        } else {            
            if (!permissions.includes(access_code)) {
                context.res.writeHead(302, { Location: "/access-denide" });
                context.res.end();
            }
            accessPermissions = { 
                listAndDetails: permissions.includes(`${access_code}.list_dtls`),
                createAndUpdate: permissions.includes(`${access_code}.crt_updt`),
                delete: permissions.includes(`${access_code}.dlt`),
                download: permissions.includes(`${access_code}.dnld`),
            };
        } 
        return {
            query,
            accessPermissions,
            permission: permissions
        };
    }
    return false;
}