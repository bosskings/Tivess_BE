import Movie from "../../models/Movie.js";
import sharp from "sharp";
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
        status: "ready",
        title: title,
        description: description,
        genre: genre,
        tags: tags,
        releaseDate: year,
        duration: minutes,
        rating: rating,
        posterUrl: poster
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

    // Convert the image to webp buffer using sharp
    let webpBuffer;
    try {
      webpBuffer = await sharp(file.path)
        .webp({ quality: 90 })
        .toBuffer();
    } catch (sharpErr) {
      console.error("Sharp conversion error:", sharpErr);
      return res.status(500).json({
        status: "FAILED",
        message: "Failed to convert image to webp."
      });
    }

    const uploadKey = `${uid}.webp`;

    console.log('Uploading poster as', uploadKey);
    try {
      await r2.send(new PutObjectCommand({
        Bucket: "posters", // Replace with your R2 bucket
        Key: uploadKey,
        Body: webpBuffer,
        ContentType: 'image/webp',
        ACL: 'public-read'
      }));
    } finally {
      // Always attempt to clean up the temp file
      fs.unlinkSync(file.path);
    }

    // Construct posterUrl (assuming a fixed public URL pattern)
    const posterUrl = `https://assets.tivees.com/${uploadKey}`;

    return res.json({
      status: "SUCCESS",
      message: "Poster uploaded successfully.",
      data: {
        key: uploadKey,
        url: posterUrl // Send the WEB URL of the uploaded file
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







/**
 * Controller to get the top 20 most viewed movies.
 * "Views" is determined by the length of the watchedBy array.
 */
const adminMostViewedMovies = async (req, res) => {
  try {
    // Find movies, sort by number of viewers (watchedBy array size), then limit to 20
    const movies = await Movie.aggregate([
      {
        $addFields: {
          views: { $size: "$watchedBy" }
        }
      },
      { $sort: { views: -1, createdAt: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      status: "SUCCESS",
      message: "Top 20 most viewed movies fetched successfully.",
      data: movies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "FAILED",
      message: "Failed to fetch most viewed movies."
    });
  }
};


/**
 * Controller to edit/update content (Movie document) by _id.
 * Accepts any updatable field from the Movies model and applies to the document.
 * Call with:
 *   PATCH /api/v1/admin/editContent/:id
 *   Body: { field1: value, field2: value, ... }
 */
// import Movie from "../../models/Movie.js"; // If not already imported at the top

// const editContent = async (req, res) => {
//   const { id } = req.params; // Movie _id in URL path
//   const updateFields = req.body; // JSON body with fields to update

//   try {
//     const updatedMovie = await Movie.findByIdAndUpdate(
//       id,
//       { $set: updateFields },
//       {
//         new: true, // return the updated document
//         runValidators: true, // validate before updating
//       }
//     );

//     if (!updatedMovie) {
//       return res.status(404).json({
//         status: "FAILED",
//         message: "Movie not found.",
//       });
//     }

//     return res.status(200).json({
//       status: "SUCCESS",
//       message: "Movie updated successfully.",
//       data: updatedMovie,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       status: "FAILED",
//       message: "Failed to update movie.",
//       error: err.message,
//     });
//   }
// };

export  {adminUploadVideo, adminUploadPoster, adminMostViewedMovies};