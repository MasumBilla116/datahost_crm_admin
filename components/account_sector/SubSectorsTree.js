import Link from 'next/link';
import EditIcon from '../elements/EditIcon';
import React, { useCallback, useEffect, useState } from "react";

export default function SubSectorsTree({item, subActionBtn, subEditBtn, actionBtn}) {

    // const [action2Btn, setAction2Btn] = useState(null)
    // onChange={(e) => setAction2Btn(e.target.value)}
    return (
        <>

            <ul>
                {item?.children_recursive?.map((subItem, i) => (
                <>
                {subItem?.children_recursive?.length == 0 ?
                <li style={(subItem.status == 0) ? {borderLeft : "2px solid red"} : {}}>
                    <input onChange={(e) => subActionBtn(
                      e.target.value
                    )} type="radio" name="navbar_style" value={subItem.id} id={`cbc${subItem.id}`} />
                    <label className='selectableLable' style={(subItem.status == 1) ? {background: "wheat", color: "green"} : {background: "#B2BEB5", color: "red"}} for={`cbc${subItem.id}`}>{subItem.title.toUpperCase()}</label>
                    <button style={{marginLeft: "10px", padding: "2px", background: "yellow"}} className={`border-0 ${(actionBtn == subItem.id) ? '' : 'd-none'}`}><Link href="#"><a onClick={() => subEditBtn(subItem.id)}><EditIcon /></a></Link></button>
                </li>
                :
                <li style={(subItem.status == 0) ? {borderLeft : "2px solid red"} : {}}> 
                    <details open>
                       <input onChange={(e) => subActionBtn(
                      e.target.value
                    )} type="radio" name="navbar_style" value={subItem.id} id={`cbd${subItem.id}`} />
                        <summary>
                          <label className='selectableLable2' style={(subItem.status == 1) ? {background: "wheat", color: "green"} : {background: "#B2BEB5", color: "red"}} for={`cbd${subItem.id}`}>{subItem.title.toUpperCase()}</label>
                          <button style={{marginLeft: "10px", padding: "2px", background: "yellow"}} className={`border-0 ${(actionBtn == subItem.id) ? '' : 'd-none'}`}><Link href="#"><a onClick={() => subEditBtn(subItem.id)}><EditIcon /></a></Link></button>
                        </summary>
                       {subItem?.children_recursive?.length != 0 && (
                          <SubSectorsTree item={subItem} subActionBtn={subActionBtn} subEditBtn={subEditBtn} actionBtn={actionBtn}/>
                        )} 
                    </details>
                </li>
                }
                </>
                ))}
            </ul>
        
        </>
    );
    }