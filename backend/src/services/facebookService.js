const { facebookGet } = require("../utils/facebookClient");

const getVideos = async (pageId) => {
  const token = process.env.PAGE_ACCESS_TOKEN;
  const res = await facebookGet(`${pageId}/videos`, {
    fields: "id,title,description,created_time",
    access_token: token,
  });
  return res.data;
};

const getComments = async (videoId) => {
  const token = process.env.PAGE_ACCESS_TOKEN;
  const res = await facebookGet(`${videoId}/comments`, {
    fields: "id,message,created_time,from{name,id}",
    access_token: token,
  });
  return res.data;
};

module.exports = { getVideos, getComments };