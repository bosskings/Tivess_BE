import User from "../../models/User.js";
import WatchParty from "../../models/WatchParty.js";
import Activity from "../../models/Activity.js";
import Movies from "../../models/Movie.js"; // Make sure the path and export are correct
// Add any other models here as needed

const adminPreview = async (req, res) => {
    try {
        // Calculate previous week and current week
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday
        startOfThisWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

        const endOfLastWeek = new Date(startOfThisWeek);

        // USERS
        const totalUsers = await User.countDocuments();
        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);
        const usersThisWeek = await User.countDocuments({ createdAt: { $gte: startOfThisWeek } });
        const usersLastWeek = await User.countDocuments({ createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } });
        // Calculate the percentage change in users compared to the previous week
        const usersChange = usersLastWeek === 0
            ? (usersThisWeek > 0 ? 100 : 0)
            : (((usersThisWeek - usersLastWeek) / usersLastWeek) * 100);
        const totalMovies = await Movies.countDocuments();
        const latestMovies = await Movies.find().sort({ createdAt: -1 }).limit(5);
        const moviesThisWeek = await Movies.countDocuments({ createdAt: { $gte: startOfThisWeek } });
        const moviesLastWeek = await Movies.countDocuments({ createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } });
        const moviesChange = moviesLastWeek === 0
            ? (moviesThisWeek > 0 ? 100 : 0)
            : (((moviesThisWeek - moviesLastWeek) / (moviesLastWeek === 0 ? 1 : moviesLastWeek)) * 100);s

        // WATCH PARTIES
        const totalWatchParties = await WatchParty.countDocuments();
        const watchPartiesThisWeek = await WatchParty.countDocuments({ createdAt: { $gte: startOfThisWeek } });
        const watchPartiesLastWeek = await WatchParty.countDocuments({ createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } });
        const watchPartiesChange = watchPartiesLastWeek === 0
            ? (watchPartiesThisWeek > 0 ? 100 : 0)
            : (((watchPartiesThisWeek - watchPartiesLastWeek) / (watchPartiesLastWeek === 0 ? 1 : watchPartiesLastWeek)) * 100);

        const ongoingWatchParties = await WatchParty.find({ status: "ongoing" })
            .populate("host", "username email")
            .populate("participants", "username email")
            .sort({ startedAt: -1 })
            .limit(5);

        const watchPartyPreview = ongoingWatchParties.map(party => ({
            partyId: party._id,
            movieTitle: party.movieTitle,
            host: party.host,
            participants: party.participants,
            numberOfPeopleWatching: 1 + (party.participants ? party.participants.length : 0),
            startedAt: party.startedAt
        }));

        res.status(200).json({
            status: "SUCCESS",
            preview: {
                users: {
                    total: totalUsers,
                    latest: latestUsers,
                    change: Number(usersChange.toFixed(2)) // percentage, positive or negative
                },
                movies: {
                    total: totalMovies,
                    latest: latestMovies,
                    change: Number(moviesChange.toFixed(2))
                },
                watchParties: {
                    total: totalWatchParties,
                    ongoing: watchPartyPreview,
                    change: Number(watchPartiesChange.toFixed(2))
                }
            }
        });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: "Server error.", error: error.message });
    }
};



// Get admins recent activities (latest 20)
const adminRecentActivities = async (req, res) => {
    try {
        // Get the most recent 20 admin activities
        const recentActivities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            status: "SUCCESS",
            activities: recentActivities
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: "Server error fetching recent admin activities.",
            error: error.message
        });
    }
};


export {
    adminRecentActivities,
    adminPreview
}
