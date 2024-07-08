const mongoose = require("mongoose");

const connectDBMS = async (url) => {
  return mongoose.connect(url);
};

module.exports = connectDBMS;
