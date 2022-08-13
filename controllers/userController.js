// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

/*
// TODO: Create an aggregate function to get the number of students overall
const headCount = async () =>
  Student.aggregate()
    // Your code here
    .then((numberOfStudents) => numberOfStudents);

// Execute the aggregate method on the Student model and calculate the overall grade by using the $avg operator
const grade = async (studentId) =>
  Student.aggregate([
    // TODO: Ensure we include only the student who can match the given ObjectId using the $match operator
    {
      // Your code here
    },
    {
      $unwind: '$assignments',
    },
    // TODO: Group information for the student with the given ObjectId alongside an overall grade calculated using the $avg operator
    {
      // Your code here
    },
  ]);
*/

module.exports = {
  // Get all students
  getAllUsers(req, res) {
    User.find()
      .then(async (users) => {
        return res.json({
          users,
          //headCount: await headCount(),
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .lean()
      .then(async (user) =>
        !user
          ? res.status(404).json({
              message: `No user found with with ID: ${eq.params.userId}`,
            })
          : res.json({
              user,
              //grade: await grade(req.params.studentId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and remove their thoughts
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: `User not found with ID ${req.params.userId}` })
          : Thought.deleteMany({ username: user.username })
      )
      .then((deleteRecord) =>
        !deleteRecord
          ? res.status(404).json({
              message: `${req.params.userId} deleted, but no thoughts found`,
            })
          : res.json({
              message: `UserId ${req.params.userId} successfully deleted along with ${deleteRecord.deletedCount} thoughts`,
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, returnOriginal: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: `No user found with id: ${req.params.userId}!` })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add an friend to a user
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body } },
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
      { $pull: { friends: { _Id: req.params.friendId } } },
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
