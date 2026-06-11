const { facebookGet } = require("../utils/facebookClient");

const getAllData = async (endpoint, fields, accessToken) => {
  let allData = [];
  let url = endpoint;

  while (url) {
    const res = await facebookGet(url, {
      fields: fields,
      access_token: accessToken,
      limit: 100, // Max allowed by Facebook
    });

    if (res.data?.data) {
      allData = allData.concat(res.data.data);
    }

    // Get next page URL
    url = res.data?.paging?.next || null;

    // Remove base URL since facebookGet prepends it
    if (url) {
      url = url.replace("https://graph.facebook.com/v19.0/", "");
    }
  }

  return { data: allData };
};

const getVideos = async (pageId) => {
  const token = process.env.PAGE_ACCESS_TOKEN;
  return getAllData(`${pageId}/videos`, "id,description,created_time", token);
};

const getComments = async (videoId) => {
  const token = process.env.PAGE_ACCESS_TOKEN;
  return getAllData(`${videoId}/comments`, "id,message,created_time,from", token);
};

module.exports = { getVideos, getComments };