// year data 
export const fullYear = [
    { year: 2023 },
    { year: 2022 }, 
    { year: 2021 }, 
    { year: 2020 }, 
    { year: 2019 }, 
  ];


//   month data 
export const allMonthName =  [
    {month:"January"},
    {month:"February"},
    {month:"March"},
    {month:"April"},
    {month:"May"},
    {month:"June"},
    {month:"July"},
    {month:"August"},
    {month:"September"},
    {month:"October"},
    {month:"November"},
    {month:"December"}, 
] ;



// calculate working  hours

export const calculateWorkHours = (inTime,outTime)=>{ 
  if(inTime !== null && outTime !== null)
  {
      // Split the times into hours, minutes, and seconds
      var [hours1, minutes1, seconds1] = inTime.split(":").map(Number);
      var [hours2, minutes2, seconds2] = outTime.split(":").map(Number); 
      
      if(hours2 < hours1)
      {
        hours2 += 12;
      }

      // Calculate the time difference in seconds
      const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
      const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;
      const timeDifferenceInSeconds = totalSeconds2 - totalSeconds1;

      // Convert seconds to hours, minutes, and seconds
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      const remainingSeconds = timeDifferenceInSeconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

    return hours+":"+minutes+":"+seconds;
  } 
  else{
    return "---";
  }
    
}


export const GetYearForFilter = (position=null) =>{ 
  const date = new Date();
  if(position!== null)
  {
    const y =  date.getFullYear();
    return y-position;
  }
  return date.getFullYear();
}



// get booking status
export const getBookingStatus = (status,html=false)=>{
  var color = "";
  /* 
    0 = Rejected, 1 = Checked-In, 2 = Booked, 3 = Pending, 4 = Cancel by user, 5 = Checked-Out  
  */
    if(status === 0){
      status = "Rejected";
      color ="text-dark-danger";
    }else if(status === 1){
      status = "Checked-In";
      color ="text-dark-success";
    }
    else if(status === 2){
      status = "Booked";
      color ="text-dark-info";
    }
    else if(status === 3){
      status = "Pending";
      color ="text-dark-warning";
    }
    else if(status === 4){
      status = "Cancel by user";
      color ="text-dark-danger";
    }
    else if(status === 5){
      status = "Checked-Out";
      color ="text-dark-danger";
    } 

    if(html){
      return <span className={` ${color} font-weight-bold`}>{status}</span>
    }
    return status;

  }