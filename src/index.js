import React from 'react';
import * as R from 'ramda';
export const useGridState = ({ data, pageSize, columns }) => {
  const [selectedRow,setSelectedRow] = React.useState([]);
  const [sortColumn,setSortColumn] = React.useState({});
  const [filters,setFilters] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const container = React.useRef({
    goFirstPage: () => setCurrentPage(0),
    goLastPage: () => setCurrentPage(totalPages),
    goPrevPage: () => setCurrentPage(currentPage => currentPage > 0 ? currentPage - 1 : currentPage),
    goNextPage: () => setCurrentPage(currentPage => currentPage < totalPages ? currentPage + 1 : currentPage),

  });
  const totalPages = Math.floor(data.length / pageSize);
  const getRowState = (rowData) => ({
    data: rowData,
    isSelected: selectedRow.indexOf(rowData) >= 0,
    toggleSelectRow: () => {
      if (selectedRow.indexOf(rowData) >= 0) {
        setSelectedRow((currentSelectedRows) => {

          return currentSelectedRows.filter(selRow=>selRow !== rowData);
        })
      }
      else {
        setSelectedRow((currentSelectedRows) => [rowData, ...currentSelectedRows])
      }
    }
  });
  const getColumnState = (column) => ({
    ...column,
    isSorting: sortColumn && sortColumn.name === column.name,
    sortDirection: sortColumn && sortColumn.name === column.name && sortColumn.dir,
    sortBy: () => {
      setSortColumn({ name: column.name, dir: sortColumn.dir === "asc" ? "desc" : "asc"})
    },
    setFilter: (value) => {
      setFilters(currentFilters=> {
        const filtersToKeep = currentFilters.filter(filter=>filter.name !== column.name);

        return [
          ...filtersToKeep,
          {name: column.name, value }
        ];

      });
    }
  });
  const getData = () => {
    const sortByFn = R.sortBy(R.prop(sortColumn.name));
    const doSort = (data)=> {
      if (sortColumn.name) {
        data = sortByFn(data);
      }
      if (sortColumn.dir === "desc") {
        data = R.reverse(data);
      }
      filters.forEach(filter=>{
        const filterFn = (row)=>row[filter.name].indexOf(filter.value) >= 0;
        data = R.filter(filterFn,data);
      });
      return data;
    };
    const sortedData = doSort(data);
    return R.slice((pageSize * currentPage), pageSize * (currentPage+1), sortedData).map(getRowState);
  };
  return {
    columns: columns.map(getColumnState),
    firstRecordIndex: (pageSize * currentPage) + 1,
    lastRecordIndex: pageSize * (currentPage+1) > data.length ? data.length : pageSize * (currentPage+1),
    totalRecords: data.length,
    data: getData(),
    ...container.current
  };
};
