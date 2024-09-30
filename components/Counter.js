import React, { Component, useState } from 'react'

export default function Counter ({children}) {

    const [count, setCount] = useState(0);

    const incrementCount=()=>{
        setCount((prevState)=>(prevState+1))
    }


    return children(count, incrementCount);

}
