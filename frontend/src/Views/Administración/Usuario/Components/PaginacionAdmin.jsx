import React, { useState, useEffect } from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageRange = 1; // Ajusta la cantidad de páginas que deseas mostrar a la vez

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const showAllNumbers = totalPages <= 7; // Ajusta este límite según tus necesidades

    if (showAllNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <span
            key={i}
            className={`mx-2 cursor-pointer ${
              i === currentPage ? "text-[#1058d0] font-bold" : "text-gray-400"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </span>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - pageRange);
      let endPage = Math.min(totalPages, currentPage + pageRange);

      if (startPage > 1) {
        pageNumbers.push(
          <span
            key={1}
            className="mx-2 cursor-pointer"
            onClick={() => handlePageChange(1)}
          >
            1
          </span>
        );
        if (startPage > 2) {
          pageNumbers.push(<span key="ellipsis-start">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <span
            key={i}
            className={`mx-2 cursor-pointer ${
              i === currentPage ? "text-[#1058d0] font-bold" : "text-gray-400"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </span>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(<span key="ellipsis-end">...</span>);
        }
        pageNumbers.push(
          <span
            key={totalPages}
            className="mx-2 cursor-pointer"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </span>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="sticky  flex justify-start font-mono font-medium text pt-5 py-6 pr-6 text-gray-400 bg-[#fff] rounded-b-xl">
      <div
        className="px-3 ml-4 cursor-pointer text-base hover:text-[#1058d0] "
        onClick={() => handlePageChange(currentPage - 1)}
      >
        ◄ Anterior
      </div>
      <div className="px-3 text-base hover:text-[#1058d0] ">
        {renderPageNumbers()}
      </div>
      <div
        className="px-3 cursor-pointer text-base hover:text-[#1058d0] "
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Siguiente ►
      </div>
    </div>
  );
};

export default Pagination;
