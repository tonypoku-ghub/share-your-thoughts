var moment = require("moment");
const mongoose = require("mongoose");
const reactionSchema = require("./Reaction");

const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      max_length: 280,
      mix_length: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: function (email) {
        return moment(email).format("MM-DD-YYYY");
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    virtuals: {
      reactionCount: {
        get() {
          return this.reactions.length();
        },
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

module.exports = mongoose.model("Thought", thoughtSchema);
