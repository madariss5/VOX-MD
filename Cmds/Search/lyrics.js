module.exports = async (context) => {

const { client, m, text } = context;

const axios = require("axios"); 
    try {
        const response = await axios.get(`https://api.dreaded.site/api/lyrics?title=${encodeURIComponent(title)}`);
        if (response.data && response.data.lyrics) {
            return response.data.lyrics;
        } else {
            return "❌ Lyrics not found!";
        }
    } catch (error) {
        console.error("Error fetching lyrics:", error.message);
        return "❌ Failed to retrieve lyrics. Please try again later.";
    }
};
