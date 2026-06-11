import axios from "axios";

const BASE_URL = "http://localhost:5000/api/facebook";

export const getVideos = (pageId) =>
  axios.get(`${BASE_URL}/videos/${pageId}`);

export const getComments = (videoId) =>
  axios.get(`${BASE_URL}/comments/${videoId}`);