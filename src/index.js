import React from 'react';
import * as R from 'ramda';

import useFilterable from './hooks/useFilterable';
import usePageable from './hooks/usePageable';
import useSortable from './hooks/useSortable';
import useSelectable from './hooks/useSelectable';
import useAjax from './hooks/useAjax';

export { useFilterable,usePageable,useSortable, useSelectable, useAjax };



let a = 1;
const noop = (state)=>state;

export const useGridState = (options) => {

  const { data, columnDefinitions, plugins } = options;


  const middleware = R.sortBy(R.prop('priority'),plugins.filter(p=>p));

  const middlewareReducers = (gridState, action) => {
    middleware.forEach(instance=>{
      if (instance.reducer)
        gridState = instance.reducer(gridState,action);
    });
    return gridState;
  };
  const middlewareInit = ({gridState, dispatch})=> {
    middleware.forEach(instance=>{

      gridState = instance.init({gridState,dispatch});
    });
    return gridState;
  };

  const rowData = React.useMemo(()=>data.map(row=>({data: row})),[data]);

  const gridState = {
    columns: React.useMemo(()=>columnDefinitions.map(col=>({...col, render: col.render || ((row)=>row.data[col.name]) })),[columnDefinitions]),
    totalRecords: data.length,
    rows: rowData,

  };
  const [currentA] = React.useReducer(()=>{},a);
  const [currentGridState, dispatch] = React.useReducer(middlewareReducers,middlewareInit({
    gridState,
    dispatch: (action)=>dispatch(action)
  }));


const fns = Object.assign({getRows: ()=>gridState.rows},...middleware.map(r=>r.mapFunctions && r.mapFunctions(gridState)).filter(r=>r));
console.log(fns);
  return [currentGridState, fns];
};
