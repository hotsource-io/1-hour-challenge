import React from "react";
import * as R from "ramda";
import axios from 'axios';
export default ({data, onLoad} = {}) => {
  const [ajaxData, setData] = React.useState({});
  const [currentParams, setParams] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const getData = async (params) => {

      const result = axios.post(
        'http://localhost:3060/',
        params
      ).then(res=>res.data);
      return result;


  };
  const loadData = (data,params) => {
      if (R.equals(currentParams,params))
        return ajaxData.rows || [];
    setParams(params);
    setIsLoading(true);
      getData(params).then((data) => {
        setData(data);
        setIsLoading(false);
        if (onLoad) onLoad(data);
      });
      return ajaxData.rows || [];

  };
  return {
    apply: loadData,
    data: ajaxData.rows || [],
    isAjaxLoading: isLoading
  };

};
