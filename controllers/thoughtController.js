const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select("-__v");

      return res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  // Get a Thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      return !thought
        ? res
            .status(404)
            .json({ message: `No thought with ID ${req.params.thoughtId}` })
        : res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      if (thought) {
        const user = await User.findOneAndUpdate(
          { username: thought.username },
          { $addToSet: { thoughts: thought } },
          { runValidators: true, new: true }
        )
          .populate(["friends", "thoughts"])
          .select("-__v");

        if (!user) {
          await Thought.findOneAndDelete({
            _id: req.params.thoughtId,
          });
          throw `Thought creation failed. ${req.body.username} does not exist`;
        } else {
          res.json(user);
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      ).select("-__v");

      !thought
        ? res
            .status(404)
            .json({ message: `No thought with id ${req.params.thoughtId}` })
        : res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        res
          .status(404)
          .json({ message: `No thought with Id ${req.params.thoughtId}` });
      } else {
        const user = await User.findOneAndUpdate(
          { username: thought.username },
          { $pull: { thoughts: req.params.thoughtId } },
          { runValidators: true, new: true }
        );
        res.json({ message: "Thought deleted and user updated!" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Add a reaction
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      !thought
        ? res
            .status(404)
            .json({ message: `No thought with ID ${req.params.thoughtId}` })
        : res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // delete a reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      //await thought.reactions.pull({ reactionId: req.params.reactionId });
      thought.update(
        {},
        { $pull: { reactions: { reactionId: req.param.reactionId } } }
      );

      thought.save();

      !thought
        ? res
            .status(404)
            .json({ message: `No thought with ID ${req.params.thoughtId}` })
        : res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};
