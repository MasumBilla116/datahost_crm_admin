import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from "react-bootstrap";
import ReactPaginate from 'react-paginate';

export function Items({ currentItems, submit }) {
    const [img, setImg] = useState([]);
    const handleInputChange=(event)=> {
         const target = event.target;
            if(target.checked){
                setImg((prev) => [...prev, target.value]); 
            }
            else{
                setImg(img.filter(element => element !== event.target.value))
            }
         
        }

    useEffect(()=>{
        submit(img);
    },[img])

  return (
    <>
   
        <Form.Group as={Row} className="mb-3">
          {
            currentItems && currentItems.map((file,index)=>(
  
              <Col md={1} key={index}>
                <div>
                  {/* if need single image, then change type to radio conditionally */}
                  <input type="checkbox" className="d-none" name='uploaded_img' 
                        value={file.id}
                        onChange={handleInputChange}
                        id={`${file.id}`}
                    />
                  <label htmlFor={`${file.id}`}>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_SAPI_ENDPOINT}${file.file_path}`}
                      className="rounded mx-auto d-block" alt="responsive"
                    />
                  </label>
                </div>
              </Col>
            ))
          }
  
        </Form.Group>
  
    </>
  );
}

 function PaginatedItems({ itemsPerPage,items,onSubmit }) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} submit={onSubmit} />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">>"
        onPageChange={handlePageClick}
        pageRangeDisplayed={4}
        pageCount={pageCount}
        previousLabel="<<"
        renderOnZeroPageCount={null}

        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        containerClassName={'pagination'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        activeClassName={'active'}
      />
    </>
  );
}


export default function MyPagination({Items,submit}){
    return(
        <PaginatedItems items={Items} onSubmit={submit} itemsPerPage={48} />
    )
    
}
