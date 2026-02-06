import express from "express";
import axios from "axios";

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const adminUploadContent = async (req, res) => {
  try {
    const cf = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/direct_upload`,
      {
        maxDurationSeconds: 7200,
        requireSignedURLs: false
      },
      {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const { uploadURL, uid } = cf.data.result;

    // Save uid in DB as "uploading"
    // userId, videoId, status = uploading

    res.json({ 
        status: "SUCCESS", 
        message: "Content uploaded successfully", 
        data: { uploadURL, videoUID: uid } 
    });
    
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ 
        status: "FAILED", 
        message: "Cloudflare error"+ (err.response?.data || err) 
    });
  }
};

export default adminUploadContent;