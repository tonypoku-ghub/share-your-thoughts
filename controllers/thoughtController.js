const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a Thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: `No thought with ID ${eq.params.thoughtId}` })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) =>
        User.findOneAndUpdate(
          { username: thought.username },
          { $addToSet: { thoughts: thought } },
          { runValidators: true, new: true }
        )
      )
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: `No course with id ${req.params.thoughtId}` })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: `No thought with Id ${req.params.thoughtId}` })
          : User.findOneAndUpdate(
              { _id: req.params.userId },
              { $pull: { thoughts: { thoughtId: req.params.thoughtId } } },
              { runValidators: true, new: true }
            )
      )
      .then(() => res.json({ message: "Tought deleted and user updated!" }))
      .catch((err) => res.status(500).json(err));
  },
  // Add a reaction
  addReaction(req, res) {
    Thought.findOne(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: `No thought with ID ${eq.params.thoughtId}` })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // delete a reaction
  deleteReaction(req, res) {
    Thought.findOne(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _Id: req.body.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: `No thought with ID ${eq.params.thoughtId}` })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};