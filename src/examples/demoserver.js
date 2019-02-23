const express = require('express');
const faker =require('faker');
const cors = require('cors');
const R = require('ramda');
const bodyParser = require('body-parser');
const app = express();

const port = 3060;
app.use(cors());
app.use(bodyParser.json());

const doPage = (pageSize, currentPage,data) => {
  let rows = data.rows;
  rows = R.slice((pageSize * (currentPage+1)), pageSize * (currentPage + 2), rows);
  return { ...data, rows, total: data.rows.length, from:  (pageSize * (currentPage+1)), to:pageSize * (currentPage + 2) };
};

const doSort = (sortColumn, data) => {
  let rows = data.rows;
  if (sortColumn.name) {

    const sortByFn = R.sortBy(R.compose(R.prop(sortColumn.name)));

    rows = sortByFn(rows);
  }
  if (sortColumn.dir === "desc") {
    rows = R.reverse(rows);
  }
  return {...data, rows }
};
faker.seed(1);
const generateFakeData = () => ({
  id: faker.random.number(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  department: faker.commerce.department(),
  status: faker.random.boolean()
});
const fakedata = R.range(1,300).map(generateFakeData);
app.post('/', (req, res) => {

  let data = {rows: fakedata};
  data = doSort({name:req.body.sortBy, dir: req.body.sortDir},data);
  data = doPage(parseInt(req.body.pageSize || 10),parseInt(req.body.currentPage||0),data);

  // Simulate delay
  setTimeout(()=>{
    res.send(JSON.stringify(data));
  },1000);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))