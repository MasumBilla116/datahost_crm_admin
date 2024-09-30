import { useEffect, useState, useCallback } from 'react';
import Axios from '../utils/axios';
import { FaPhone, FaEdit, FaFilePdf } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
const HotelLogo = ({ id, invoiceName }) => {
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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await fetchLogoImages();
    //     };
    //     fetchData();
    // }, [id]);


    const fetchLogoImages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/settings/general`, { action: "darklLogo" });

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
    }, [id]);



    useEffect(() => {
        setIsLoading(true);
        const controller = new AbortController();
        const sectorList = async () => {
            await http.post(`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}/app/users`,
                { action: "getUserInfo" }
            ).then((res) => {
                setUserInfo(res.data.data[0]);
                setIsLoading(false);
            }).catch((error) => {
                console.log('fetching sector list error', error);
            });
        };
        sectorList()
        return () => controller.abort();
    }, [user?.id]);

    return (
        <>


            {logoDetails && (
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <img
                        src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${logoDetails}`}
                        alt="Logo"
                        style={{ width: '138px', height: '63px' }}
                    />
                    <small className={`text-uppercase font-weight-bold fs-5`}>{userInfo?.company}</small>
                    <p className='m-0'>{userInfo?.city_name} {userInfo?.country_name} </p>
                    <p><span style={{ fontSize: "14px" }} ><FaPhone /></span>  {userInfo?.phone} <span style={{ fontSize: "14px" }} > <MdEmail /></span>{userInfo?.email}</p>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}><span >{invoiceName}</span></div>
                </div>

            )}

        </>
    );
};

export default HotelLogo;
