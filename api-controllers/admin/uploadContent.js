import Movie from "../../models/Movie.js";
import axios from "axios";


const adminUploadContent = async (req, res) => {
  
    try {
      // Extract details from the request body
      const { 
        uid, 
        title, 
        description, 
        category,
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
        status: "uploading",
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



// function to check if the video is uploaded to cloudflare'
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

export  {adminUploadContent, adminCheckUploadStatus};