import React, { useState, useEffect } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes / 2;
  const minuteDeg = minutes * 6 + seconds / 10;
  const secondDeg = seconds * 6;

  const styles = {
    clock: {
      width: '200px',
      height: '200px',
      border: '2px solid #000',
      borderRadius: '50%',
      position: 'relative',
    },
    hand: {
      position: 'absolute',
      transformOrigin: '50% 100%',
      background: '#000',
    },
    hourHand: {
      height: '50px',
      width: '4px',
      top: '50px',
      left: '98px',
      transform: `rotate(${hourDeg}deg)`,
    },
    minuteHand: {
      height: '90px',
      width: '2px',
      top: '10px',
      left: '99px',
      transform: `rotate(${minuteDeg}deg)`,
    },
    secondHand: {
      height: '100px',
      width: '1px',
      top: '0px',
      left: '99.5px',
      transform: `rotate(${secondDeg}deg)`,
      backgroundColor: 'red',
    },
    clockCenter: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#000',
      position: 'absolute',
      top: '96px',
      left: '96px',
    },
    hourDigit: {
      position: 'absolute',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#000',
    },
  };

  // Generate hour digits
  const hourDigits = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i - 3) * 30;
    const left = 100 + Math.cos((angle * Math.PI) / 180) * 70;
    const top = 100 + Math.sin((angle * Math.PI) / 180) * 70;

    hourDigits.push(
      <div key={i} style={{ ...styles.hourDigit, top: `${top}px`, left: `${left}px` }}>
        {i}
      </div>
    );
  }

  return (
    <div style={styles.clock}>
      {hourDigits}
      <div style={{ ...styles.hand, ...styles.hourHand }}></div>
      <div style={{ ...styles.hand, ...styles.minuteHand }}></div>
      <div style={{ ...styles.hand, ...styles.secondHand }}></div>
      <div style={styles.clockCenter}></div>
    </div>
  );
};

export default AnalogClock;
