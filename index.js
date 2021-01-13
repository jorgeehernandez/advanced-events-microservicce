const express = require("express");
const app = express();
const http = require("./utils/http");
const morgan = require("morgan");
const PORT = 80;
const filtersProcesor = require("./modules/processFilters");
const config = require("./cumulocity.json");
const {
  notFoundError,
  errorLoger,
  errorResponse
} = require("./utils/ErrorHandlers");

app.use(morgan("combined"));

app.get("/events", async function(req, res, next) {
  try {
    const { query, headers } = req;
    const httpInstance = http(headers.authorization);
    res.header("Content-Type", "application/json");
    const streamResponse = filtersProcesor({ query, httpInstance }, function (error) {
      next(error);
    });

    streamResponse.pipe(res);
  } catch (error) {
    next(error);
  }
});

app.get("/health", (_, res) => {
  res.json({
    status: "UP!",
    version: config.version
  });
});

app.use(notFoundError);
app.use(errorLoger);
app.use(errorResponse);

app.listen(PORT, function() {
  console.log(`app running on port ${PORT}! at /events`);
});
