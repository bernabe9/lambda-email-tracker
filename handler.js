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
    if (process.env.WEBHOOK) {
      await axios({
        url: process.env.WEBHOOK,
        method: "POST",
        data: {
          attachments: [
            {
              pretext: "Email Track",
              color: "#36a64f",
              title: "Email was opened!",
              text: `Receiver ${params.to} just opened your email`,
              fields: [
                {
                  title: "Note",
                  value: "Ignore this message if you're writing the email",
                  short: false
                }
              ],
              ts: Date.now()
            }
          ]
        },
        headers: { "Content-Type": "application/json" }
      });
    }

    return generateResponse(200, data);
  } catch (e) {
    console.log(e);
  }
};
