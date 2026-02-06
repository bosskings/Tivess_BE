import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date
    },
    genre: {
        type: [String],
        default: []
    },
    duration: {
        type: Number // duration in minutes
    },
    posterUrl: {
        type: String
    },
    trailerUrl: {
        type: String
    },
    movieFileUrl: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
