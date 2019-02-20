import React from 'react';

import useFilterable from './hooks/useFilterable';
import usePageable from './hooks/usePageable';
import useSortable from './hooks/useSortable';
import useSelectable from './hooks/useSelectable';
import useAjax from './hooks/useAjax';
import * as R from "ramda";

export { useFilterable,usePageable,useSortable, useSelectable, useAjax };
export const combineHooks = (hooks) => (args = {}) => {
  const result = {};
  const applyFns = [];
  const params = [];
  hooks.forEach(hook=>{
    const hookResult = hook({...args,data:null});
    Object.assign(result, hookResult);
    params.push(hookResult.params || {});
    applyFns.push(hookResult.apply);
  });

  const applyPipe = (data,params)=> {
    const res = applyFns.reduce((acc, cur) => {

      return cur(acc, params);
    }, data);

    return res;
  };
  const allParams = R.mergeAll(params);
  return { ...result, params: allParams , apply: applyPipe, data: args.data && applyPipe(args.data, allParams) };
};