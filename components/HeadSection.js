import React, { useContext } from 'react'
import Head from 'next/head'
import themeContext from './context/themeContext';

export default function HeadSection({title}) {
  const context = useContext(themeContext);
  const {hotelName} = context;
  return (
    <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {/* <title>{`${hotelName ?? hotelName}`} |  {title}</title> */}
    <title>{hotelName ? `${hotelName} | ` : ''}{title}</title>

    </Head>
  )
}
