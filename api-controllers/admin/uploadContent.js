const adminUploadContent = async (req, res) => {
    /*
      Expects multipart/form-data with fields:
      - title
      - description
      - genre
      - year
      - file (video file)
    */
    try {
        // Ensure Multer or similar is used for req.file
        const { title, description, genre, year } = req.body;
        const file = req.file;

        if (!title || !description || !genre || !year || !file) {
            return res.status(400).json({ status: "FAILED", message: "Please provide all required fields and a file." });
        }

        // --- Upload file to S3 ---
        // Initializing AWS S3 client and config handled elsewhere (imported in your project)

        // Required: import S3 from 'aws-sdk/clients/s3' and configure elsewhere
        // S3 instance should be available as s3

        // Generate unique filename
        const fileExtension = file.originalname.split('.').pop();
        const s3Key = `movies/${Date.now()}_${file.originalname}`;

        // Upload to S3
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        // Assume 's3' is accessible here
        const s3Data = await s3.upload(params).promise();
        const fileUrl = s3Data.Location;

        // --- Save movie details to DB ---
        // Assume Movies model is already imported
        const movie = await Movies.create({
            title,
            description,
            genre,
            year,
            fileUrl
        });

        return res.status(201).json({
            status: "SUCCESS",
            message: "Movie uploaded and saved successfully.",
            movie
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "FAILED", message: "Upload failed: " + err.message });
    }
};

export default adminUploadContent;