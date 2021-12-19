const express = require("express");
const morgan = require("morgan");
const router = require('./router')

const app = express();

app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));
app.use(router)

module.exports = app
