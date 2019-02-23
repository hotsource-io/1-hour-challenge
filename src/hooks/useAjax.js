import React from "react";
import * as R from "ramda";
import axios from 'axios';
const loadDataFromUrl = async (url,params) =>axios.post(url, params).then(res=>res.data);
const AjaxLoad = (data,parametersToInclude, responseMapping, options) => {
  const url = options.url;
  const [ajaxData, setData] = React.useState(null);
  const [currentParams, setParams] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const loadData = (data,params) => {
    if (R.equals(currentParams, params))
      return ajaxData ? (responseMapping(ajaxData) || [])  : [];

    setParams(params);

    setIsLoading(true);

    // Fetch the data and insert into state:
    loadDataFromUrl(url, params).then((data) => {
      setData(data);
      setIsLoading(false);

    });

    return ajaxData ? (responseMapping(ajaxData) || []) : [];

  };

  const ajaxParams = {};

  parametersToInclude.forEach(p=>{
    ajaxParams[p] = options[p];
  });

  return [
    loadData(data,ajaxParams),
    {
      ...options,
      isLoading,
      response: ajaxData
    }
  ];
};
export default (parametersToInclude, dataMapping,  mapping) => (data,options) => {
  const process =AjaxLoad(data,parametersToInclude,dataMapping, options);
  if (!mapping) return process;
  const [returnedData,updatedParams] = process;
  return [returnedData,mapping(updatedParams,returnedData)];
}