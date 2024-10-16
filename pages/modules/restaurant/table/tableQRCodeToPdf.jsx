import React, { useEffect } from "react";
import QRCode from "react-qr-code";
import { usePDF } from "react-to-pdf";

export const getServerSideProps = async(context)=>{
    const {table,id} = context.query;
    
    return {
        props:{
            table,
            id
        }
    }

}

const TableQRCodeToPdf =({table,id})=>{
    const {toPDF,targetRef} = usePDF({filename:`table-qrcode-${id}.pdf`});
    

    useEffect(()=>{
        toPDF();  
    },[])

    return <>
        <div ref={targetRef} className="container d-flex justify-content-center align-items-center ">
            <div className="text-center pt-4 pb-4">                
                <h3><b>Table No: {table}</b></h3>
                <QRCode value={`${process.env.NEXT_PUBLIC_MANAGEBEDS_WEB}/table/booking?table=${id}`}/>
            </div>
        </div>
    </>
}


export default TableQRCodeToPdf;