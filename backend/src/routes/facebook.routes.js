//D:\visual studio program\Comment-Analizer\backend\src\routes\facebook.routes.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/facebook.controller");

router.get("/videos/:pageId", controller.fetchVideos);
router.get("/comments/:videoId", controller.fetchComments);

module.exports = router;