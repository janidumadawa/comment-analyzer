const axios = require("axios");
const config = require("../config/facebook.config");

const facebookGet = (endpoint, params) => {
  return axios.get(`${config.BASE_URL}/${endpoint}`, { params });
};

module.exports = { facebookGet };