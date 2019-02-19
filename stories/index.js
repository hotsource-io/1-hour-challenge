import React from 'react';
import { storiesOf } from '@storybook/react';
import { StandardTable } from "../src/examples/standard";
import * as R from 'ramda';
import faker from 'faker';
const generateFakeData = () => ({
  id: faker.random.number(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  department: faker.commerce.department(),
  status: faker.random.boolean()
});
const data = R.range(1, 25).map(()=>{
  return generateFakeData();
});
const columns = [{ name: "id", label: "ID"},{name:"name", label: "Name"},{name:"department", label: "Department"},{status:"status", label:"Status"}];
storiesOf('One Hour Challenge', module)
  .add('basic example', () => (
    <StandardTable data={data} columns={columns}></StandardTable>
  ));