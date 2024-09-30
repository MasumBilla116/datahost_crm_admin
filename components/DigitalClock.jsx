import React, { useEffect, useState } from 'react';

const ClockDate = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  const startTime = () => {
    const today = time;
    let hr = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    const ap = hr < 12 ? "<span>AM</span>" : "<span>PM</span>";
    hr = hr === 0 ? 12 : hr;
    hr = hr > 12 ? hr - 12 : hr;
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = `${hr}:${min}:${sec} ${ap}`;

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const curWeekDay = days[today.getDay()];
    const curDay = today.getDate();
    const curMonth = months[today.getMonth()];
    const curYear = today.getFullYear();
    const date = `${curWeekDay}, ${curDay} ${curMonth} ${curYear}`;
    document.getElementById("date").innerHTML = date;
  };

  const checkTime = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

  useEffect(() => {
    startTime();
  }, [time]);

  return (
    <div id="clockdate" className="clockdate-wrapper">
      <div id="clock" style={styles.clock}></div>
      <div id="date" style={styles.date}></div>
    </div>
  );
};

const styles = {
  clock: {
    backgroundColor: 'rgb(231 52 52 / 55%)',
    fontFamily: 'sans-serif',
    fontSize: '30px',
    textShadow: '0px 0px 1px #fff',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '5px 5px 0 0'
  },
  date: {
     backgroundColor: 'rgb(199 46 46 / 73%)',
    fontFamily: 'sans-serif',
    fontSize: '15px',
    textShadow: '0px 0px 1px #fff',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '0 0 5px 5px',
    padding: '5px 0px',
  },
};

export default ClockDate;
