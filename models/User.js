const mongoose = require("mongoose");
const Thought = require("./Thought");

// Schema to create User model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    thoughts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thought" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    toJSON: {
      getters: true,
    },
  },
  {
    virtuals: {
      friendCount: {
        get() {
          return this.friends.length();
        },
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
60407001;
