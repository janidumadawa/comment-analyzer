//D:\visual studio program\Comment-Analizer\backend\src\controllers\facebook.controller.js
const service = require("../services/facebookService");

// videos
const fetchVideos = async (req, res) => {
  try {
    const data = await service.getVideos(req.params.pageId);
    res.json(data);
  } catch (err) {
    console.error("VIDEO ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// comments
const fetchComments = async (req, res) => {
  try {
    const data = await service.getComments(req.params.videoId);
    res.json(data);
  } catch (err) {
    console.error("COMMENTS ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

module.exports = { fetchVideos, fetchComments };