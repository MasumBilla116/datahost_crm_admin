
const Convert = (props) => {
  // console.log("props",props)
    // const conversionRate = (props.price * props.exchange_rate).toFixed(2);
    const conversionRate = (props?.price ?? 0 ).toFixed(2);
  return conversionRate == 0 ? '-': props.symbol+conversionRate;
}

export default Convert