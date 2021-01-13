const axios = require("axios");
const createError = require("http-errors");

function http(credentials) {
  const baseURL = process.env.C8Y_BASEURL || "https://desarrollotest.bismark-iot.com";

  if (!credentials) throw createError(401, "No valid credentials");

  return axios.create({
    baseURL,
    headers: {
      Authorization: credentials
    }
  });
}

module.exports = http;
