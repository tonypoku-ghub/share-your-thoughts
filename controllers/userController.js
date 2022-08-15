// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find()
        .populate(["friends", "thoughts"])
        .select("-__v");
      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .lean();

      return !user
        ? res.status(404).json({
            message: `No user found with with ID: ${eq.params.userId}`,
          })
        : res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      user.save;
      return res.json(user);
    } catch (err) {
      const user = await User.findOne({
        username: req.body.username,
      });

      res.status(500).json({
        errorCode: err.code,
        message:
          err.code === 11000
            ? `${req.body.username} already exists with ID: ${user._id}`
            : `Failed to create new user with username: ${req.body.username}`,
      });
    }
  },

  // Delete a user and remove their thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOne({
        _id: req.params.userId,
      });
      if (!user) {
        res
          .status(404)
          .json({ message: `User not found with ID ${req.params.userId}` });
      } else {
        const deletedUserRecord = await user.deleteOne({
          _id: req.params.userId,
        });

        if (deletedUserRecord) {
          const deletedThoughtRecord = await Thought.deleteMany({
            username: user.username,
          });

          return !deletedThoughtRecord
            ? res.status(404).json({
                message: `${req.params.userId} deleted, but no thoughts found`,
              })
            : res.json({
                message: `UserId ${req.params.userId} successfully deleted along with ${deletedThoughtRecord.deletedCount} thought(s)`,
              });
        } else {
          res.status(404).json({
            message: `Delete failed for user ID ${req.params.userId}`,
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      user.username = req.body.username;
      user.email = req.body.email;

      const updatedUser = await user.save();

      return !updatedUser
        ? res
            .status(404)
            .json({ message: `No user found with id: ${req.params.userId}!` })
        : res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add an friend to a user
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: `No user found with that ID ${req.params.userId} :(`,
            })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove friend from a user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: `No user found with ID ${req.params.friendId}` })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
