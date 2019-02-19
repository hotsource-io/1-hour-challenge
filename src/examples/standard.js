import React from "react";
import {useGridState} from '../';
import styled from "styled-components";
const Table = styled('table')`
  border: 1px solid #eee;
  background: #f8f8f8;
  width:100%;
`;
const Row = styled('tr')`
  background: #fff;
`;
const SelectedRow = styled('tr')`
  background: #444;
  color:white;
`;
const SortIndicator = styled('span')`
  background: #222; 
  font-size:0.8rem;
  line-height:1.6rem;
  color:white;
  border-radius:5px;
  padding:0.2rem;
`;
const Cell = styled('td')`
  padding: 0.2rem 0.5rem;
  line-height:2.4rem;
`;
const ColumnHeader = styled('th')`
  padding: 0.2rem 0.5rem;
  line-height:2.4rem;
  cursor:pointer;
`;
const Pager = styled('div')`
  display:flex; 
  padding: 0.4rem;
  background:#f8f8f8;
  border: 1px solid #eee;
`;
const PagerItem = styled('div')`
  flex: 1 1 auto;
  &:last-child {
    text-align:right;
  }
`
const PagerLink = styled('a')`
  cursor: pointer;
  text-decoration: none;
  &:hover { text-decoration:underline;}
  line-height:2.4rem; 
  padding:0px 1rem;
`;
export const StandardTable = ({data, columns}) => {

  const gridState = useGridState({data, columns, pageSize: 10 });

  return <React.Fragment>
    <div>Header</div>
    <Table>
    <thead>
    <tr>
      {gridState.columns.map(column=><ColumnHeader onClick={column.sortBy}>{column.label} {column.isSorting && (
        <SortIndicator>{column.sortDirection}</SortIndicator>

      )}
        <div><input type="text" onChange={e=>column.filter(e.target.value)} /></div>
      </ColumnHeader>)}
    </tr>
    </thead>
    {gridState.data.map(row=>{
      const rowCellElements = gridState.columns.map(column=><Cell>{row.data[column.name]}</Cell>)
      const RowElement = (row.isSelected) ? SelectedRow : Row;

      return <RowElement onClick={row.toggleSelectRow}>{rowCellElements}</RowElement>;
    })}

  </Table>
    <Pager>
      <PagerItem>
        Showing {gridState.firstRecordIndex} - {gridState.lastRecordIndex} of {gridState.totalRecords}
      </PagerItem>
      <PagerItem>
        <PagerLink onClick={gridState.goFirstPage}> &lt;&lt; First</PagerLink>
        <PagerLink onClick={gridState.goPrevPage}>&lt; Previous</PagerLink>
        <PagerLink onClick={gridState.goNextPage}>Next &gt;</PagerLink>
        <PagerLink onClick={gridState.goLastPage}>Last &gt;&gt;</PagerLink>
      </PagerItem>
    </Pager>
  </React.Fragment>
};
