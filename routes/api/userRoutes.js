const router = require("express").Router();
const userController = require("../../controllers/userController");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

// /api/users/:userId
router
  .route("/:userId")
  .get(userController.getSingleUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// /api/students/:studentId/assignments
router.route("/:userId/friends").post(userController.addFriend);

// /api/users/:userId/friends/:friendId
router
  .route("/:userId/friends/:friendId")
  .post(userController.addFriend)
  .delete(userController.removeFriend);

module.exports = router;
