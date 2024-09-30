import Link from "next/link";
import { useRouter } from 'next/router';
import React from 'react';

const Breadcrumbs = ({ crumbs, currentPath}) => {

    const router = useRouter();
    const { pathname } = router;
    if(currentPath === null){
        currentPath = pathname;
    }
    
  return (
    <div className="mb-3 bg-cyan d-flex justify-content-center align-items-center" style={{height: '40px'}}>
        <div className="col-md-5 col-12 align-self-center font-weight-bold text-uppercase" style={{fontSize: '22px', borderLeft: '5px solid #000', paddingLeft: '5px'}}>
            {crumbs.length > 0 ? crumbs[0]['text'] : ''}
        </div>
        <div className="col-md-7 col-12 align-self-center d-none d-md-flex justify-content-end">
        <ol className="breadcrumb mb-0 p-0 bg-transparent">
            {crumbs.map((crumb, index) => (
            <li key={index} className={`breadcrumb-item ${crumb.link === currentPath ? 'active' : ''}` }>
                {crumb.link ? (
                <Link href={crumb.link}>
                    <a>{crumb.text}</a>
                </Link>
                ) : (
                <span>{crumb.text}</span>
                )}
            </li>
            ))}
        </ol>
        </div>
    </div>
  )
}

export default Breadcrumbs