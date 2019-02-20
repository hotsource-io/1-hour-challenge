import React from "react";
export const Actions = {
  TOGGLE_ROW: 'TOGGLE_ROW'
};

export const TOGGLE_ROW = (dispatch) => (row) => {
  dispatch({type: Actions.TOGGLE_ROW, row})
};
const useDecorate = () => {

  const toggleRow = (currentSelectedRows, rowData) => {

    if (currentSelectedRows.indexOf(rowData) >= 0) {
        return currentSelectedRows.filter(selRow => selRow !== rowData);
    }
    return [...currentSelectedRows, rowData];
  };
  const checkIfSelected = (selectedRows) => (row) => {
    var rowisSelected = selectedRows.indexOf(row.data) >= 0;
    if (rowisSelected !== row.isSelected)
      return {...row,isSelected:rowisSelected};
    return row;
  };
  return {
    reducer: (state, action) => {

      switch (action.type) {
        case Actions.TOGGLE_ROW:
          const newRows = toggleRow(state.selection.selectedRows, action.row);
          return {
            ...state,
            selection: {
              ...state.selection, selectedRows: newRows
            },
            rows: state.rows.map(checkIfSelected(newRows))
          }

      }
      return state;
    },
    init: ({ gridState, dispatch }) => {

      return ({
        ...gridState,
        selection: {
          selectedRows: [],
          toggleSelectedRow: TOGGLE_ROW(dispatch)
        },
        rows: gridState.rows.map(row => ({
          ...row,
          props: {onClick: () => TOGGLE_ROW(dispatch)(row.data)},
          isSelected: false
        }))
      });
    }
  };




};

export default useDecorate;
export const selectedCheckbox = (renderSelected, renderUnselected) => () =>{

  return {
    init: ({gridState}) => ({
      ...gridState,
      columns: [{
        name: '__checkbox', width: 50, render: (row) =>
          row.isSelected ? renderSelected() : renderUnselected(),
        sortable: false, filterable: false
      }, ...gridState.columns]
    })
  };

};