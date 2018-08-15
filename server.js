const express = require('express');
const path = require('path');

const port = process.env.PORT || 8000;
const publicPath = '/';

const app = express();

app.use(express.static(path.join(__dirname, '/'), { index: 'index.html' }));
app.listen(port, function () {
  console.log(`App listening on: http://localhost:${port}`);
});
