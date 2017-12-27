'use strict';

const express = require('express');
const morganLogger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./lib/config');
const logger = require('./lib/logger');
const errors = require('./lib/errors');
const AgentApi = require('./lib/agent').AgentApi;
const NotFound = errors.NotFound;

const app = express();

app.use(morganLogger('combined', {
  stream: logger.agent.stream
}));
app.use(bodyParser.json());

// allowed routes
app.use(`/v${config.agent.version}`, require('./lib/routes/agent_router'));
app.get('/info', AgentApi.getInfo);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFound()));

// use JSON for displaying errors
app.use((err, req, res, next) => {
  /* jshint unused: false */
  logger.agent.error(err);
  err.status = err.status || 500;
  res.status(err.status).json({
    description: err.message || err.reason
  });
});

module.exports = app;