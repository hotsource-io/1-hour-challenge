import React from "react";
import * as R from "ramda";

export default (data) => {
  const [filters,setFilters] = React.useState([]);

  // Create Set Filter function
  const setFilterValueByName = (fieldName) => (value) => {
    setFilters(currentFilters => {
      const filtersToKeep = currentFilters.filter(filter => filter.name !== fieldName);

      return [
        ...filtersToKeep,
        {name: fieldName, value}
      ];

    });
  };

  const filterRows = (data) => {
    return R.reduce((currentData, filter) => {

      const filterFn = (row) => row.data[filter.name].indexOf(filter.value) >= 0;
      return R.filter(filterFn, currentData);
    },data,filters);
  };

  const reduceGridState = ({gridState}) => {

      return {
        ...gridState,
        columns: gridState.columns.map((column) => ({
          ...column,
          filter: setFilterValueByName(column.name)
        })),
        rows: filterRows(gridState.rows)
      }
  };

  return filterRows(data);


};