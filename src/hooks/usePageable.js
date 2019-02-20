import React from "react";
import * as R from "ramda";

export default ({pageSize}) => () => {
  const [currentPage, setCurrentPage] = [0,()=>{}];
  const reduceData = (rows) => {
    return R.slice((pageSize * currentPage), pageSize * (currentPage+1), rows);
  };
  const reduceGridState =({gridState}) => {
      const totalPages = Math.floor(gridState.rows.length / pageSize);

      if (gridState.rows.length > 0 && gridState.rows.length < (pageSize * currentPage) + 1) {
        setCurrentPage(totalPages);
      }
      return {
        ...gridState,
        pager: {
          totalPages,
          currentPage,
          totalRecords: gridState.rows.length,
          firstRecordIndex: (pageSize * currentPage) + 1,
          lastRecordIndex: pageSize * (currentPage + 1) > gridState.rows.length ? gridState.rows.length : pageSize * (currentPage + 1),
          goFirstPage: () => setCurrentPage(0),
          goLastPage: () => setCurrentPage(totalPages),
          goPrevPage: () => setCurrentPage(currentPage => currentPage > 0 ? currentPage - 1 : currentPage),
          goToPage: (pageIndex) => setCurrentPage(pageIndex),
          goNextPage: () => setCurrentPage(currentPage => currentPage < totalPages ? currentPage + 1 : currentPage)
        }
      };
    };
  reduceGridState.priority = 10;
return {
    init: reduceGridState,
  reducer: (s)=>{
      console.log(s);
      return s;
  },
    mapFunctions: (gridState) =>({
      getRows: () => reduceData(gridState.rows)
    }),
    priority:10
};


};