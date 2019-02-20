import React from "react";
import * as R from "ramda";
import axios from 'axios';
const loadDataFromUrl = async (url,params) =>axios.post(url, params).then(res=>res.data);
export default ({data, onLoad, url} = {}) => {

  const [ajaxData, setData] = React.useState({});
  const [currentParams, setParams] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const loadData = (data,params) => {
    if (R.equals(currentParams, params))
      return ajaxData.rows || [];

    setParams(params);

    setIsLoading(true);

    // Fetch the data and insert into state:
    loadDataFromUrl(url, params).then((data) => {
      setData(data);
      setIsLoading(false);
      // If onLoad option is provided, call it (for updating external state)
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
