import Movie from "../../models/Movie.js";
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"


const adminUploadVideo = async (req, res) => {
  
    try {
      // Extract details from the request body
      const { 
        uid, 
        title, 
        description,
        genre,
        tags,
        year,
        minutes,
        rating,
        poster } = req.body;

      if (!uid || !title) {
        return res.status(400).json({
          status: "FAILED",
          message: "Missing uid or title in request."
        });
      }

      // Save file metadata in the database
      const movieDoc = await Movie.create({
        uid: uid,
        status: "inprogress",
        title: title,
        description: description || "",
        genre: genre || "",
        tags: tags || "",
        releaseDate: year || "",
        duration: minutes || "",
        rating: rating || "",
        poster: poster || ""
      });

      return res.json({
        status: "SUCCESS",
        message: "Movie metadata saved successfully.",
        data: {
          movie: movieDoc
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "FAILED",
        message: "Error saving movie metadata."
      });
    }
};





const adminUploadPoster = async (req, res) => {
  try {
    // R2 client
    const r2 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY
      }
    });

    const file = req.file; // multer middleware should provide req.file
    const { uid } = req.body; // uid expected from body

    // Defensive: check that file.path is defined and not undefined/null/empty
    if (!file || !file.path || !uid) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing file, file path, or uid in request."
      });
    }

    const fileStream = fs.createReadStream(file.path);
    const ext = file.originalname.split('.').pop();
    const uploadKey = `${Date.now()}.${ext}`;

    try {
      await r2.send(new PutObjectCommand({
        Bucket: "posters", // Replace with your R2 bucket
        Key: uploadKey,
        Body: fileStream,
        ContentType: file.mimetype,
        ACL: 'public-read'
      }));

    } finally {
      
      // Always attempt to clean up the temp file
      fs.unlinkSync(file.path);
    
    }

    // Generate the public "web" URL to access the image
    // For Cloudflare R2, format: https://<account_id>.r2.cloudflarestorage.com/<bucket>/<key>
    const publicUrl = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/posters/${uploadKey}`;

    return res.json({
      status: "SUCCESS",
      message: "Poster uploaded successfully.",
      data: {
        key: uploadKey,
        url: publicUrl // Send the WEB URL of the uploaded file
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      message: "R2 upload failed."
    });
  }
};







const adminCheckUploadStatus = async (req, res) => {
  const { uid } = req.params;

  try {
    // Query Cloudflare Stream for the current video status
    const cfRes = await axios.get(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`,
      {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`
        }
      }
    );

    const result = cfRes.data.result;
    // result.status.state: "queued" | "inprogress" | "ready" | "error"
    // See: https://developers.cloudflare.com/api/operations/stream-get-video
    const state = result.status?.state;
    const isReady = state === "ready";

    // Optionally include additional info, e.g. playback
    let playbackUrl = null;
    if (isReady && result.playback) {
      playbackUrl = result.playback.hls;
    }

    res.json({
      status: "SUCCESS",
      message: isReady
        ? "Video is ready to be viewed."
        : `Video is processing (${state})`,
      data: {
        ready: isReady,
        state,
        playbackUrl: playbackUrl || null
      }
    });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({
      status: "FAILED",
      message:
        "Failed to check video status: " + (err.response?.data || err).toString()
    });
  }
};

export  {adminUploadVideo, adminUploadPoster, adminCheckUploadStatus};