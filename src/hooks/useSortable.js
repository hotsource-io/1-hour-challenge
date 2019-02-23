import React from "react";
import * as R from "ramda";
const Sortable = (data,options) => {
  data = data || [];
  const [sortColumn,setSortColumn] = React.useState({});

  const setSortedColumnByName = (fieldName) => {

    const newDirection = (sortColumn.dir === "asc" ? "desc" : "asc");
    setSortColumn({ name: fieldName, dir: newDirection});

  };
  const reduceData = (data) => {

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
  return [
    reduceData(data),
    {
      sortDir: sortColumn.dir,
      sortBy: sortColumn.name,
      setSortBy: setSortedColumnByName
    }
  ];
};
export default (mapping) => (data,options) => {
  const process =Sortable(data,options);
  if (!mapping) return process;
  const [returnedData,updatedParams] = process;
  return [returnedData,mapping(updatedParams,returnedData)];
}