const express = require('express');
const moragn = require('morgan');
const cors = require('cors');
const port = 3000;
const app = express();
const { mongoose } = require('./config/db');
const { router } = require('./config/routers');

app.use(moragn('short'));


// app.use('*', cors())
const corsOptions = {
  exposedHeaders: 'x-auth',
};

app.use(cors(corsOptions));

app.use(express.json())
app.use('/', router)

app.listen(port,() => {
  console.log('listing to port number '+port)
})

