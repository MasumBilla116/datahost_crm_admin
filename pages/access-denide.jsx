import React from "react";


const authenticationError = () => {


    return (<div className="container-fluid">
        <div className="row">
            <div className="col-lg-12">
                <div className="card  justify-content-center align-items-center  flex-column" style={{ height: '50vh' }}>
                   
                        <h4 className="text-danger" style={{ fontFamily: 'Arial, sans-serif',fontSize: '3rem', fontWeight: 'bold' }}>Apologies</h4>
                        <h4 className="text-danger">It appears you do not have authorization to access this page.</h4>
                        <h1 className="text-light-secondary" style={{ fontSize: "6rem" }}>401</h1>
                    

                </div>
            </div>
        </div>
    </div>)
}




export default authenticationError
// style={{ fontFamily: 'Arial, sans-serif', color: '#dc3545', fontSize: '1.25rem', fontWeight: 'bold' }}