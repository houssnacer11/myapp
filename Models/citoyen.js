var mongoose = require("mongoose");

var civilSchema = mongoose.Schema(
  {
    username: { type: String },
    email: { type: String },
    numTel: { type: String },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("citoyen", civilSchema);
