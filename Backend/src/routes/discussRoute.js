const express = require("express")
const router = express.Router()

const discussionController = require("../controllers/dicussionController")
const auth = require("../middleware/authMiddleware")


router.post("/",auth,discussionController.createPost);
router.get("/",auth,discussionController.getPosts);
router.get("/:postId/comments",discussionController.getComments);
router.post("/:postId/comments",auth,discussionController.addComment);
router.post("/vote",auth,discussionController.vote);
router.post("/:postId/bookmark",auth,discussionController.bookmark);
router.delete("/comments/:commentId",auth,discussionController.deleteComment);
router.delete("/:postId",auth,discussionController.deletePost);

module.exports = router

