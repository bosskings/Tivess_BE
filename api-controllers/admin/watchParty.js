import WatchParty from "../../models/WatchParty.js";

/**
 * Controller to get all active (ongoing) watch parties,
 * showing party info, the number of current viewers (host + participants), and the movie link.
 */
const getActiveWatchParties = async (req, res) => {
    try {
        // Get watch parties with "ongoing" status
        const activeParties = await WatchParty.find()
            .populate("host", "username email")
            .populate("participants", "username email");

        // Format the results
        const result = activeParties.map(party => ({
            partyId: party._id,
            movieTitle: party.movieTitle,
            movieLink: party.movieLink,
            host: party.host,
            status:party.status,
            participants: party.participants,
            numberOfPeopleWatching: 1 + (party.participants ? party.participants.length : 0), // host + participants
            startedAt: party.startedAt
        }));

        res.status(200).json({ status: "SUCCESS", count: result.length, data: result });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: "Server error.", error: error.message });
    }
};

export { getActiveWatchParties };
