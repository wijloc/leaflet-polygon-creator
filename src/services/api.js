const axios = require('axios');

const api = axios.create({
  baseURL: 'https://polygon-creator-backend.herokuapp.com/',
});

exports.api = api;
