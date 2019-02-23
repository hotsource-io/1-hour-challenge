import React from "react";

const Selectable = (data,options) => {
  const [ selectedRows, setSelectedRows ] = React.useState([]);
  const select = (rowData) => {
    return setSelectedRows([...selectedRows, rowData]);
  };
  const unselect = (rowData) => {
    return setSelectedRows(selectedRows.filter(selRow => selRow !== rowData && (rowData.id === undefined || selRow.id !== rowData.id)));
  };

  const toggle = (rowData) => {

    if (selectedRows.indexOf(rowData) >= 0|| rowData.id !== undefined && selectedRows.map(r=>r.id).indexOf(rowData.id) >= 0) {
      return unselect(rowData);
    }
    return select(rowData);
  };
  const isSelected = (row) => {
    return selectedRows.indexOf(row) >= 0 || row.id !== undefined && selectedRows.map(r=>r.id).indexOf(row.id) >= 0;
  };
  return [data,{
    isSelected,
    toggle,
    select,
    unselect,
    selectedRows
  }]

};

export default (mapping) => (data, options = {}) => {
  const process = Selectable(data,options);
  if (!mapping) return process;
  const [returnedData,updatedParams] = process;

  return [returnedData, mapping(updatedParams,returnedData)];
}
