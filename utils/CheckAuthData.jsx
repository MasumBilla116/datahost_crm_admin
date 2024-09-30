import { removeCookie, setCookie } from "./Cookie";
import { Decrypt } from "./EncryptDecrypt";

export const CheckAuthData = async (context) => {

    const { stayin } = context.req.cookies || null;
    const host = context.req.headers.host;
    const data = await Decrypt(stayin);
   

    if ((data !== '' && data !== undefined) && (data?.stay !== '' && data?.stay !== undefined)) {
        const currentDateTime = new Date();
        const validatedDateTime = new Date(data?.stay);

        if (validatedDateTime < currentDateTime) {
            await removeCookie('stayin', { domain: host });
            await removeCookie('permissions', { domain: host });
            window.localStorage.clear();
            return;
        }

        const nextDay = new Date(currentDateTime);
        nextDay.setDate(nextDay.getDate() + 1);
        // console.log("nextDay after increment: ", nextDay);
        const current_date = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()+1);
        // console.log("current_date: ", current_date);

        const checkInDate = new Date(data?.check_in_day); 
        if (checkInDate < current_date) {
            console.log("current_date: ",current_date);
            const _stay = {
                stay: data.stay,
                check_in_day: current_date
            }
            setCookie('stayin', _stay);
        }
        return;
    }

}