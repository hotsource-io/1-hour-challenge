import React from "react";

export default ({data}) => {
  const [ selectedRows, setSelectedRows ] = React.useState([]);
  const toggleRow = (rowData) => {

    if (selectedRows.indexOf(rowData) >= 0|| rowData.id !== undefined && selectedRows.map(r=>r.id).indexOf(rowData.id) >= 0) {
        return setSelectedRows(selectedRows.filter(selRow => selRow !== rowData && (rowData.id === undefined || selRow.id !== rowData.id)));
    }
    return setSelectedRows([...selectedRows, rowData]);
  };
  const checkIfSelected = (row) => {
    return selectedRows.indexOf(row) >= 0 || row.id !== undefined && selectedRows.map(r=>r.id).indexOf(row.id) >= 0;
  };

  return {
    apply: (data)=>data,
    data: data,
    selectedRows,
    getRowProps: (row) => ({
      onClick: () => toggleRow(row),
      selected: checkIfSelected(row)
    }),
    toggleRow,
    isSelected: checkIfSelected,
  };

};