import { useEffect, useState, useCallback } from 'react';
import Axios from '../utils/axios';
import { FaPhone, FaEdit, FaFilePdf } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
const OnlyLogo = () => {
    const { http, token, user } = Axios();
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState(true);
    const [logoDetails, setLogoDetails] = useState();

   
    // const fetchLogoImages = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "hotelLogo" });

    //         setLogoDetails(res.data?.data);
    //         setLoading(false);
    //     } catch (err) {
    //         setLoading(false);
    //     }
    // }, [http]);


    const fetchLogoImages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "lightLogo" });

            setLogoDetails(res.data?.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }, [http]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchLogoImages();
        };
        fetchData();
    }, []);




    return (
        <>
            {logoDetails && (
                <img
                    src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${logoDetails}`}
                    alt="Logo"
                    style={{ width: '230px', height: '100px' }}
                    // style={{ width: '230px', height: '100px', backgroundColor: 'transparent' }}

                />

            )}

        </>
    );
};

export default OnlyLogo;
