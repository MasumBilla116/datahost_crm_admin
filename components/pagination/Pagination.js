import React from "react";

const Pagination = ({
  setCurrentPage,
  setFilterValue,
  currentPage = 1,
  total = 0,
  perPage = 15,
}) => {
  // calculate pagination
  const totalPages = Math.ceil(total / perPage);

  // handler
  const generatePageNumbers = () => {
    const pages = [];
    const current = Math.min(totalPages, Math.max(1, currentPage));
    pages.push(1);
    for (
      let i = Math.max(2, current - 2);
      i <= Math.min(totalPages - 1, current + 2);
      i++
    ) {
      pages.push(i);
    }
    pages.push(totalPages);

    return pages;
  };

  const goToPage = (page) => {
    setFilterValue(prev=>({
      ...prev,
      paginate: false
    }));
    setCurrentPage(page);
  };
    
  const prevPaginationPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setFilterValue(prev=>({
        ...prev,
        paginate: false
      }));
    }
  };

  const nextPaginationPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setFilterValue(prev=>({
        ...prev,
        paginate: false
      }));
    }
  };
  
  return (
    <div className="table-responsive  pt-3">
      <div className="w-100 d-flex justify-content-center align-items-center">
        <nav aria-label="Page navigation example">
          {total > perPage && (
            <ul className="pagination">
              <li className="page-item" onClick={prevPaginationPage}>
                <a
                  className="page-link rounded-0"
                  href="#"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">|&laquo;</span>
                </a>
              </li>
              {generatePageNumbers().map((page, index) => (
                <li
                  key={index}
                  className={`page-item${
                    page === currentPage ? " active" : ""
                  }`}
                  onClick={() => goToPage(page)}
                >
                  <a className="page-link" href="#">
                    {page}
                  </a>
                </li>
              ))}
              <li className="page-item" onClick={nextPaginationPage}>
                <a className="page-link rounded-0" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;|</span>
                </a>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
