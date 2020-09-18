const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, require: true },
  password: { type: String, require: true },
  rateData: { type: {} },
});

module.exports = mongoose.model("Users", userSchema);
