const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();


// Parse JSON to req.body
app.use(express.json());

// Log all incoming requests for sanity during dev
app.use(function (req, rsp, next) {
  // console.log(req.method, req.originalUrl, req.params);
  next();
})

// Set up routes
app.use(userRouter);
app.use(taskRouter);

module.exports = app;