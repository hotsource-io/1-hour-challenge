import React from "react";
import * as R from "ramda";

export default (options) => {
  const data = options.data || [];
  const pageSize = options.pageSize !== false ? (options.pageSize || 10) : false;
  const pageIndex = options.pageIndex || 0;
  const [currentPage, setCurrentPage] = React.useState(pageIndex);
  const [dataLength, setDataLength] = React.useState(0);
  const reduceData = (rows) => {

    if (pageSize === false) {
      return rows;
    }
    //if (dataLength !== rows.length) setDataLength(rows.length);
    return R.slice((pageSize * currentPage), pageSize * (currentPage + 1), rows);
  };

  const totalPages = Math.floor(dataLength / pageSize);

  if (dataLength > 0 && dataLength < (pageSize * currentPage) + 1) {
    setCurrentPage(totalPages);
  }
  const getPagerInfo = pageSize === false ? null : ({
    totalPages,
    currentPage,
    totalRecords: dataLength,
    firstRecordIndex: (pageSize * currentPage) + 1,
    lastRecordIndex: pageSize * (currentPage + 1) > dataLength ? dataLength : pageSize * (currentPage + 1),
    goFirstPage: () => setCurrentPage(0),
    goLastPage: () => setCurrentPage(totalPages),
    goPrevPage: () => setCurrentPage(currentPage => currentPage > 0 ? currentPage - 1 : currentPage),
    goToPage: (pageIndex) => setCurrentPage(Math.min(Math.max(pageIndex,0),totalPages-1)),
    goNextPage: () => setCurrentPage(currentPage => currentPage < totalPages ? currentPage + 1 : currentPage)

  });
  return {
    apply: reduceData,
    params: { pageSize, currentPage },
    ...getPagerInfo,
    setPage: setCurrentPage,
    setDataLength: setDataLength,
    data: options.data ? reduceData({data: options.data}) : null
  };


};