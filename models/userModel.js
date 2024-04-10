const mongoose = require("mongoose");

const userSchema = new mongoose.SchemaTypeOptions(
  {
    username: {
      type: String,
      required: [true, "please add username"],
    },
    email: {
      type: String,
      required: [true, "please add email address"],
      unique: [true, "email address already taken"],
    },
    password: {
      type: String,
      required: [true, "please add user password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
