const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

let msg = {};
// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.route('/')
.get((req, res) => {
  fs.readFile(`${__dirname}/data.txt`, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      msg = JSON.parse(data);
    }
  });
  return res.json({
    results: msg,
  });
})
.post((req, res) => {
  const message = req.body;
  if (!message.hasOwnProperty('username')
    || !message.hasOwnProperty('text')
    || !message.hasOwnProperty('roomname')) {
    return res.sendStatus(404);
  }

fs.readFile(`${__dirname}/data.txt`, 'utf8', (err, data) => {
  if(err) {
    console.log(err);
  }
 else {
  const existingData = JSON.parse(data);
  message.objectId = (existingData.length)+1;
  existingData.push(message);
  const combinedData = JSON.stringify(existingData);
  fs.writeFile(`${__dirname}/data.txt`, combinedData, (err) => {
    if(err) {
      console.log(err);
    }
  })

}
  return res.sendStatus(200);
});
});
app.listen(process.env.PORT || 4000);
