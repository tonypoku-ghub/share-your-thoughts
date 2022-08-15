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
      default: () => Date.now(),
      immutable: true,
      get: function (createdAt) {
        //needs getters: true in toJSON section for this to work
        return moment(createdAt).format("MM-DD-YYYY HH:mm:ss");
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

module.exports = mongoose.model("Thought", thoughtSchema);
