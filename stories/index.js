import React from 'react';
import { storiesOf } from '@storybook/react';
import { StandardTable } from "../src/examples/standard";
import { StandardTableClean } from "../src/examples/clean";
import * as R from 'ramda';
import faker from 'faker';
const generateFakeData = () => ({
  id: faker.random.number(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  department: faker.commerce.department(),
  status: faker.random.boolean()
});
const data = R.range(1, 260).map(()=>{
  return generateFakeData();
});
const columns = [
  { width: 150, name: "id", label: "ID"},
  {name:"name", label: "Name"},
  { width: 200, name:"department", label: "Department"},
  { width: 100, name:"status", label:"Status", render: (row) => row.status ? <span data-icon="&#xe052;" style={{color: '#649c52', fontSize: '1rem', textAlign:'center',display:'block'}} /> : null }];
storiesOf('One Hour Challenge', module)
  .add('basic example', () => (
    <StandardTable data={data} columns={columns}></StandardTable>
  ))
  .add('clean example', () => (
    <StandardTableClean data={data}></StandardTableClean>
  ));