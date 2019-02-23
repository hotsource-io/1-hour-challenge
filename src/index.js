import React from 'react';

import useFilterable from './hooks/useFilterable';
import usePageable from './hooks/usePageable';
import useSortable from './hooks/useSortable';
import useSelectable from './hooks/useSelectable';
import useAjax from './hooks/useAjax';
import * as R from "ramda";

export { useFilterable,usePageable,useSortable, useSelectable, useAjax };
export const mapProps = (mapping) => (data,options) => {
  return [data,mapping(options,data)];
};
const processHooks = (hooks, data, options) => {
  const params = {};
  Object.assign(params, options);
  hooks.forEach(hook=>{

    const hookResult = hook(data, params);

    Object.assign(params, hookResult[1]);
    data = hookResult[0];
  });

  return [data, params];
};
export const combineHooks = (...hooks) => (dataArg, options= {}) => {
  if (dataArg === undefined) {
    // Create render prop component
    return function({data, children, ...restProps }) {

      const results = processHooks(hooks, data, restProps);
      return children.apply(this,results);
    }
  }
  return processHooks(hooks,dataArg,options);
};