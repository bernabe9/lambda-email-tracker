"use strict";

const fs = require("fs");
const axios = require("axios");

const generateResponse = (code, payload) => ({
  statusCode: code,
  headers: {
    "Content-Type": "image/png",
    "Cache-Control": "max-age=0, private"
  },
  body: payload,
  isBase64Encoded: true
});

const getFileBase64 = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "base64" }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

const isFromGoogleProxy = ({ headers }) => {
  const userAgent = headers["User-Agent"];
  return userAgent.includes("GoogleImageProxy");
};

module.exports.handler = async event => {
  const params = event.queryStringParameters;
  try {
    const data = await getFileBase64("image.png");

    if (!isFromGoogleProxy(event)) {
      return generateResponse(200, data);
    }

    // notify
    await axios({
      url: process.env.WEBHOOK,
      method: "POST",
      data: {
        text: `${params.to} opened the email (ignore if you're writing the email)`
      },
      headers: { "Content-Type": "application/json" }
    });

    return generateResponse(200, data);
  } catch (e) {
    console.log(e);
  }
};
