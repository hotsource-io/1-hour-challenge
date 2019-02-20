import React from "react";
import * as R from 'ramda';
import 'elegant-icons/style.css';
import { combineHooks, useAjax, usePageable, useSelectable,useSortable} from '../';
import styled from "styled-components";
const Wrapper = styled('div')`
position:relative;font-family:montserrat; font-size:12px;`;
const Table = styled('table')`
  border: 1px solid #eee;
  background: #f8f8f8;
  width:100%;
`;
const Row = styled('tr')`
  background: #fff;
  color:#444;
  ${({selected})=>selected && `
    background: #f8f8f8;
    color:#111;
  `}
`;
const HeaderIcon = styled('span')`
  float:right;
  margin:0px 0.5rem;
`;
const Cell = styled('td')`
  padding: 0.2rem 0.5rem;
  line-height:2.4rem;
`;
const ColumnHeader = styled('th')`
  padding: 0.2rem 0.5rem;
  line-height:2.4rem;
  background: #366dbf;
  color:white;
  cursor:pointer;
`;

const LoadingOverlay = styled('div')`
  &>span {
  color:white;
  font-weight:700;
  font-size:20px;
  position:absolute;
  
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  cursor:pointer;
  }
  &:before { 
  display:block;
  content: " ";
  position: absolute;
  top:0px;left:0px;right:0px;bottom:0px;
  background:rgba(0,0,0,0.5);
  }
`;
const Pager = styled('div')`
  display:flex; 
  padding: 0.4rem;
  background:#f8f8f8;
  
  border: 1px solid #eee;
  border-top:1px solid #366dbf; 
`;
const PagerItem = styled('div')`
  flex: 1 1 auto;
  line-height:2.2rem;
  &:last-child {
    text-align:right;
  }
`;
const PagerInput = styled('input')`
  line-height:1.9rem;
  border-radius:3px;
  padding:0px 0.7rem;
  border:1px solid #eee;
  max-width:50px;
`;
const CheckboxIcon = styled('span')`
display:block;
text-align:center;
font-size:1.2rem;
font-weight:bold;
color: #366dbf;
`;
const PagerLink = styled('a')`
  cursor: pointer;
  border-radius:3px;
  text-decoration: none;
  &:hover { text-decoration:underline;}
  line-height:2.2rem; 
  padding:0px 0.7rem;
  border:1px solid #eee;
  background:white;
  display:inline-block;
  margin:0px 0.2rem;
  ${({selected})=>selected && "color:red;"}
`;


const Tag = styled('span')`
  cursor:pointer;
  border-radius:3px;
  line-height:2rem; 
  padding:0px 0.7rem;
  border:1px solid #eee;
  background:white;
  display:inline-block;
  margin:0.5rem 0.2rem;
  &:hover { 
    background:#f8f8f8;
  }
`;

const PagerComponent = ({pagerData})=> {
  if (!pagerData) return false;
  const [showInput, setShowInput] =  React.useState(false);
  const [selectedPage, setSelectedPage] =  React.useState(null);
  const startPageNum = Math.max(3,pagerData.currentPage) - 2;
  const parsePageNum = (value) => {
    if (value === "")
      return "";
    const pageNum = parseInt(value);
    if (isNaN(pageNum) || pageNum <= 0)
      return 1;
    if (pageNum > pagerData.totalPages) {
      return pagerData.totalPages;
    }
    return pageNum;
  };
  const handleKeyPress = (e) => {
    if (e.keyCode == 36) {
      setSelectedPage(1);
    }
    if (e.keyCode == 35) {
      setSelectedPage(pagerData.totalPages);
    }
    if (e.keyCode == 38) {
      setSelectedPage(Math.min(selectedPage+1,pagerData.totalPages));
    }
    if (e.keyCode == 40) {
      setSelectedPage(Math.max(selectedPage-1,1));
    }

  };
  return (
    <Pager>
      <PagerItem>
        Showing {pagerData.firstRecordIndex} - {pagerData.lastRecordIndex} of {pagerData.totalRecords}
      </PagerItem>
      {showInput ? (
        <PagerItem>
          Go to page: <PagerInput type={"text"} value={selectedPage} onKeyDown={e=>handleKeyPress(e)} onChange={e=>setSelectedPage(parsePageNum(e.target.value))} /><PagerLink onClick={()=>{pagerData.goToPage(selectedPage-1); setShowInput(false); }}>Go</PagerLink>
        </PagerItem>
        ): (
        <PagerItem>

        <PagerLink onClick={pagerData.goPrevPage}>&lt; Previous</PagerLink>
          {startPageNum > 5 && <PagerLink onClick={()=>pagerData.goToPage(0)}>1</PagerLink>}
          {pagerData.totalPages <= (startPageNum + 5) && <PagerLink onClick={()=>setShowInput(true)}>...</PagerLink>}
          {R.range(startPageNum - 1 ,Math.min(pagerData.totalPages-1,startPageNum + 4)).map(i=>(
          <PagerLink selected={pagerData.currentPage === i} onClick={()=>pagerData.goToPage(i)}>{i+1}</PagerLink>
        ))}
        {pagerData.totalPages > (startPageNum + 5) && <PagerLink onClick={()=>setShowInput(true)}>...</PagerLink>}
        <PagerLink onClick={()=>pagerData.goToPage(pagerData.totalPages)}>{pagerData.totalPages}</PagerLink>
        <PagerLink onClick={pagerData.goNextPage}>Next &gt;</PagerLink>

      </PagerItem>
        )}
    </Pager>
  );
};
export const TableHeader = ({ columns, getColumnProps, pager }) =>  <thead>
<tr>
  {columns.map(column=>(
    <ColumnHeader {...getColumnProps(column)} style={{width: column.width}}>
      {column.label}
      {column.sortable !== false && pager.isSorting(column) && (
        pager.sortDirection() === "desc" ? <HeaderIcon className="icon" data-icon="C"></HeaderIcon> : <HeaderIcon className="icon" data-icon="B"></HeaderIcon>
      )}


    </ColumnHeader>
  ))}
</tr>
</thead>;

const columnRenderer = (data, column) => {

  if (column.render)
    return column.render(data);
  return data[column.name]
};

export const TableBody = ({pagedData, getRowProps, columns}) => <tbody>

{pagedData.map(row=>{
  const rowCellElements = columns.map(column=><Cell>{columnRenderer(row,column)}</Cell>)
  return <Row {...getRowProps(row)}>{rowCellElements}</Row>;
})}
</tbody>;

export const StandardTable = ({data, columns }) => {
  const pageAndSort = combineHooks([useSortable,usePageable, useSelectable, useAjax]);


  const pager = pageAndSort({
    data,
    url: 'http://localhost:3060/',
    pageSize:  6,
    onLoad: (response)=>setDataLength(response.total) });

  const { isAjaxLoading, setDataLength, selectedRows, getColumnProps, getRowProps, toggleRow, isSelected } = pager;


  const checkboxColumn = ({
    name: '__checkbox', width: 50,
    render: (row) => isSelected(row) ? <CheckboxIcon data-icon="&#x5a;" /> : <CheckboxIcon data-icon="&#x56;" />,
    sortable: false,
    filterable: false
  });

  columns = [ checkboxColumn, ...columns ];
  return <Wrapper>
    {isAjaxLoading && <LoadingOverlay><span>Loading...</span></LoadingOverlay>}
    <div>Selected Rows: {selectedRows.map(r=><Tag onClick={()=>toggleRow(r)}>{r.name} <span data-icon="&#x4d;" /></Tag>)}</div>

    <Table>
      <TableHeader pager={pager} getColumnProps={getColumnProps} columns={columns} />
      <TableBody columns={columns} getRowProps={getRowProps} pagedData={pager.data}/>
    </Table>
    <PagerComponent pagerData={pager} />

  </Wrapper>
};
