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
    name: { type: String },
    label: { type: String },
    secteur: { type: String },
    description: { type: String },
    role: {
      type: String,
      enum: ["admin", "user", "representant"],
      default: "user",
    },
    active: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("citoyen", civilSchema);
