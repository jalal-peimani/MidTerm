var express = require("express");

const paginate = require("express-paginate");

var app = express();

require("./middlewares")(app);

require("./routes")(app);

require("./services/errorHandler")(app);

module.exports = app;
