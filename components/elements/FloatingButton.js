import Link from 'next/link';
import { useState } from 'react';
import {
    FloatingMenu,
    MainButton,
    ChildButton,
  } from 'react-floating-button-menu';
  import { FaMinus, FaPlus } from 'react-icons/fa';

export default function FloatingButton({isOpen,fontSize,subIcon,supplier_Id, selectedRowId,...rest}) {


  return (
    <FloatingMenu
    // className="bg-primary top-50 right-50"
    // style={{ position: 'fixed', zIndex: '1', top:"10px", right:"120px", height:"10px" }}
    slideSpeed={500}
    direction="right"
    // spacing={8}
    // style={{ position: "fixed",zIndex:1, margin:"-10px"}}
    isOpen={isOpen}
    {...rest}
  >
    <MainButton
      iconActive={<FaMinus style={{ fontSize: 12}} nativeColor="white" />}
      iconResting={<FaPlus style={{ fontSize: 12 }} nativeColor="white" />}
      backgroundColor="black"
      size={fontSize}
    />

    {subIcon?.map((sub)=>{
      return(
        <ChildButton
        icon={sub?.icon}
        backgroundColor="white"
        size={fontSize}
        onClick={()=>(sub?.click && sub?.click(supplier_Id))}
      />
      )
    })}
  </FloatingMenu>
  )
}
