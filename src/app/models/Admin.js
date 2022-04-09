const mongoose = require("mongoose");

const Admin = mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  dateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("admin", Admin);
