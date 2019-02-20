import React from "react";
import * as R from "ramda";

export default (options) => {

  const data = options.data || [];
  const pageSize = (options.pageSize || 10);

  const [currentPage, setCurrentPage] = React.useState(options.pageIndex || 0);
  const [dataLength, setDataLength] = React.useState(data.length);

  const pageData = (rows) => {
    return R.slice((pageSize * currentPage), pageSize * (currentPage + 1), rows);
  };

  const totalPages = Math.floor(dataLength / pageSize);

  if (dataLength > 0 && dataLength < (pageSize * currentPage) + 1) {
    setCurrentPage(totalPages);
  }
  const getPagerInfo = ({
    totalPages,
    currentPage,
    totalRecords: dataLength,
    firstRecordIndex: (pageSize * currentPage) + 1,
    lastRecordIndex: pageSize * (currentPage + 1) > dataLength ? dataLength : pageSize * (currentPage + 1),
    goPrevPage: () => setCurrentPage(currentPage => currentPage > 0 ? currentPage - 1 : currentPage),
    goToPage: (pageIndex) => setCurrentPage(Math.min(Math.max(pageIndex,0),totalPages-1)),
    goNextPage: () => setCurrentPage(currentPage => currentPage < totalPages ? currentPage + 1 : currentPage)

  });
  return {
    apply: pageData,
    params: { pageSize, currentPage },
    setPage: setCurrentPage,
    setDataLength: setDataLength,
    data: options.data ? pageData(options.data) : null,
    ...getPagerInfo
  };


};