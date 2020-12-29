var mongoose = require("mongoose");

var civilSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  numTel: { type: String },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("citoyen", civilSchema);
