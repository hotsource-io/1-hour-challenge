import React from "react";
import * as R from "ramda";

export default ({data} = {}) => {
  const [sortColumn,setSortColumn] = React.useState({});




  const setSortedColumnByName = (fieldName) => {

    const newDirection = (sortColumn.dir === "asc" ? "desc" : "asc");
    setSortColumn({ name: fieldName, dir: newDirection});

  };


  const reduceColumns = (column) => {
    return {
      ...column,
      props: { onClick: column.sortable !== false && setSortedColumnByName(column.name) },
      isSorting: column.name === sortColumn.name,
      sortDirection: sortColumn.dir
    }
  };
  const reduceData = (data,params) => {

    const sortByFn = R.sortBy(R.compose(R.prop(sortColumn.name)));
    const doSort = (data) => {

      if (sortColumn.name) {
        data = sortByFn(data);
      }
      if (sortColumn.dir === "desc") {
        data = R.reverse(data);
      }
      return data;
    };

    return doSort(data);
  };
  const sortableInfo = {
    isSorting: (column) => sortColumn.name ==column.name,
    sortDirection: () => sortColumn.dir,
    getColumnProps: (column) => ({
      onClick: ()=> column.sortable !== false && setSortedColumnByName(column.name)
    })
  };
  return {data: data ? reduceData(data) : null, params: { sort: sortColumn.name , dir: sortColumn.dir }, apply: reduceData, ...sortableInfo, sortByColumn: setSortedColumnByName};

};
