 
  const getStatus = (status) =>{

    if(status)
        return <span className="text-success">Active</span>
    else
    <span className="text-danger">Disable</span>

}


export default getStatus;