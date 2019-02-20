import React from "react";
import * as R from "ramda";

export default () => {
  const [sortColumn,setSortColumn] = React.useState({});


  const setSortedColumnByName = (fieldName) => () => {

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
  const reduceData = (data) => {

    const sortByFn = R.sortBy(R.compose(R.prop(sortColumn.name), R.prop("data")));
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
  return {
    init: ({gridState, dispatch}) => {

      return ({
        ...gridState,
        columns: gridState.columns.map(reduceColumns),
        rows: reduceData(gridState.rows)
      });
    }
  };

};
