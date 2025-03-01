require("dotenv").config();

const config = {
    bot: {
        name: "VOX-MD",
        owner: "Kanambo",
        logLevel: "silent", // Change to 'debug' for detailed logs
    },
    session: {
        data: process.env.SESSION_DATA, // Base64 encoded session
    },
    settings: {
        autoRemoveLinks: true, // Set to false if you want to disable link removal
    },
};

module.exports = config;
