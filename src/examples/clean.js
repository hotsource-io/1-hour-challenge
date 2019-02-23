import React from "react";
import * as R from 'ramda';
import 'elegant-icons/style.css';
import {useGridState, useFilterable, useAjax, usePageable, useSelectable,useSortable, selectedCheckbox} from '../';
import styled from "styled-components";

const Card = styled('div')`
display:inline-block;
width:300px;
margin:20px;
padding:20px;
line-height:1.8rem;
border:1px solid #eee;
box-shadow:1px 1px 3px rgba(0,0,0,0.3);
`;
const CardHeader = styled('div')`
background: #366dbf;
color:white;
font-weight:bold;
text-align:center;
padding:5px;
margin:-20px -20px 10px -20px;
`;
const useBasicPager = usePageable(({currentPage, setPage})=> {
  return {
    goNextPage: () => setPage(currentPage + 1),
    goPrevPage: () => setPage(currentPage - 1),
    currentPage
  };
});

export const StandardTableClean = ({ data  }) => {

  const [results,{currentPage, goNextPage, goPrevPage}] = useBasicPager(data, {pageSize: 6 });


    return <div style={{textAlign:'center'}}>

    {results.map(row=>{
      return <Card>
        <CardHeader>{row.name}</CardHeader>
        <div><strong>Department:</strong> {row.department}</div>
        <div>{row.status ? "Active":"Inactive"}</div>
      </Card>;
    })}
    <div >
      <button onClick={goPrevPage}>Prev</button>
      <strong> {currentPage+1} </strong>
      <button onClick={goNextPage}>Next</button>
    </div>



  </div>
};
