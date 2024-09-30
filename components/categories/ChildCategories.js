import React, { Fragment } from 'react'
import { useState } from 'react';
//import SubCat from './SubCat'


export default function ChildCategories({subcategory,index2}) {
  let value='';
  for(let i=0; i<subcategory.level; i++){
    value = value + '--';
  }
  return (
    <Fragment key={index2}>
    <option value={subcategory.id} >{value} {subcategory.name}</option>
    {
        subcategory?.room_types && subcategory?.room_types.map((categories,index3)=>(
          <Fragment key={index3}>
            <ChildCategories subcategory={categories} index2={index3}/>
          </Fragment>
        ))
    }
    </Fragment>
  )
}
