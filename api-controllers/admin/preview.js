import User from "../../models/User.js";
import WatchParty from "../../models/WatchParty.js";
import Movies from "../../models/Movie.js"; // Make sure the path and export are correct
// Add any other models here as needed

const adminPreview = async (req, res) => {
    try {
        // Get total number of users
        const totalUsers = await User.countDocuments();
        // Get all users (limited to a preview, e.g. 5 latest users)
        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        // Get total number of movies/content
        const totalMovies = await Movies.countDocuments();
        // Get latest uploaded movies preview
        const latestMovies = await Movies.find().sort({ createdAt: -1 }).limit(5);

        // Get total and ongoing watch parties
        const totalWatchParties = await WatchParty.countDocuments();
        const ongoingWatchParties = await WatchParty.find({ status: "ongoing" })
            .populate("host", "username email")
            .populate("participants", "username email")
            .sort({ startedAt: -1 })
            .limit(5);

        // Format ongoing watch parties for preview
        const watchPartyPreview = ongoingWatchParties.map(party => ({
            partyId: party._id,
            movieTitle: party.movieTitle,
            host: party.host,
            participants: party.participants,
            numberOfPeopleWatching: 1 + (party.participants ? party.participants.length : 0),
            startedAt: party.startedAt
        }));

        // You can add more summary data from other models here

        res.status(200).json({
            status: "SUCCESS",
            preview: {
                users: {
                    total: totalUsers,
                    latest: latestUsers
                },
                movies: {
                    total: totalMovies,
                    latest: latestMovies
                },
                watchParties: {
                    total: totalWatchParties,
                    ongoing: watchPartyPreview
                }
                // Add more preview objects from other models here as needed
            }
        });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: "Server error.", error: error.message });
    }
};

export default adminPreview;
