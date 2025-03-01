/*
 * Bot Configuration Module
 *
 * Developer Info:
 * Author: KANAMBO
 * Date: 27/02/2025
 * Version: 1.0.1
 * Description: This module configures and exports environment variables
 *              for VOXNET-BOT. Ensure the `config.env` file exists for proper setup.
 *
 * ⭐ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆: © 𝗩𝗢𝗫𝗡𝗘𝗧.𝗜𝗡𝗖.
 */

const fs = require("fs");
require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "enter-your-session",
    AUTO_READ_STATUS: convertToBool(process.env.AUTO_READ_STATUS),
    MODE: process.env.MODE || "private",
    AUTO_VOICE: convertToBool(process.env.AUTO_VOICE),
    AUTO_STICKER: convertToBool(process.env.AUTO_STICKER),
    AUTO_REPLY: convertToBool(process.env.AUTO_REPLY),
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/1xb3ax.jpg",
    ALIVE_MSG: process.env.ALIVE_MSG || "🚀 *Hello, I’m VOXNET🥷!* I’m online and ready to assist! ♻️",
    ANTI_LINK: convertToBool(process.env.ANTI_LINK),
    ANTI_BAD: convertToBool(process.env.ANTI_BAD),
    PREFIX: process.env.PREFIX || ".",
    FAKE_RECORDING: convertToBool(process.env.FAKE_RECORDING),
    AUTO_REACT: convertToBool(process.env.AUTO_REACT),
    HEART_REACT: convertToBool(process.env.HEART_REACT),
    OWNER_REACT: convertToBool(process.env.OWNER_REACT),
    BOT_NAME: process.env.BOT_NAME || "VOXNET🥷",
    OWNER_NAME: process.env.OWNER_NAME || "KANAMBO",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254114148625",
    FOOTER: process.env.FOOTER || "⭐ Powered by: @VOXNET.INC",
};
module.exports = config;
