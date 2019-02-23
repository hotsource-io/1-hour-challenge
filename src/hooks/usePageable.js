import React from "react";
import * as R from "ramda";

// Input: 2 parameters: data and params
// Output: 2 parameters: data and params

const Pageable = (data,options) => {
    data = data || [];
    const pageSize = (options.pageSize || 10);

    const [currentPage, setCurrentPage] = React.useState(options.pageIndex || 0);
    const [dataLength, setDataLength] = React.useState(data.length);

    const setTotalRecords = (d)=>{

      if (dataLength !== d) setDataLength(d);
    };

    const totalPages = Math.ceil(dataLength / pageSize);
    const setPage = (pageIndex)=>setCurrentPage(Math.min(Math.max(pageIndex,0),totalPages-1));

    if (dataLength > 0 && dataLength < (pageSize * currentPage) + 1) {
      setPage(totalPages);
    }
    return [
      R.slice((pageSize * currentPage), pageSize * (currentPage + 1), data),
      {
        ...options,
        totalPages,
        currentPage,
        setPage,
        totalRecords: dataLength,
        setDataLength: setTotalRecords,
      }
    ];



};

export default (mapping) => (data, options = {}) => {
  const process = Pageable(data,options);
  if (!mapping) return process;
  const [returnedData,updatedParams] = process;

  return [returnedData, mapping(updatedParams,returnedData)];
}
