const router = require("express").Router();
const thoughtController = require("../../controllers/thoughtController.js");

// /api/thoughts
router
  .route("/")
  .get(thoughtController.getAllThoughts)
  .post(thoughtController.createThought);

// /api/thoughts/:thoughtId
router
  .route("/:thoughtId")
  .get(thoughtController.getSingleThought)
  .put(thoughtController.updateThought)
  .delete(thoughtController.deleteThought);

// /api/thoughts/:thoughtId/reactions
router
  .route("/:thoughtId/reactions")
  .post(thoughtController.addReaction)
  .delete(thoughtController.deleteReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router
  .route("/:thoughtId/reactions/:reactionId")
  .delete(thoughtController.deleteReaction);

module.exports = router;
