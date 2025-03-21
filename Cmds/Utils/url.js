module.exports = async (context) => {
    const { client, m, text, botname, downloadMediaMessage } = context;
    const fs = require("fs-extra");
    const { Catbox } = require("node-catbox");

    const catbox = new Catbox();

    async function uploadToCatbox(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error("File does not exist");
        }

        try {
            const response = await catbox.uploadFile({ path: filePath });

            if (response) {
                return response; // Returns the uploaded file URL
            } else {
                throw new Error("Error retrieving the file link");
            }
        } catch (err) {
            throw new Error(String(err));
        }
    }

    if (!m.quoted) return m.reply("Please reply to an image, video, or audio file to generate a URL.");

    let mediaPath, mediaType;
    const msg = m.quoted;

    try {
        if (msg.videoMessage) {
            const videoSize = msg.videoMessage.fileLength;
            if (videoSize > 50 * 1024 * 1024) {
                return m.reply("The video is too long. Please send a smaller video.");
            }
            mediaPath = await downloadMediaMessage(msg, "buffer");
            mediaType = "video";
        } else if (msg.imageMessage) {
            mediaPath = await downloadMediaMessage(msg, "buffer");
            mediaType = "image";
        } else if (msg.audioMessage) {
            mediaPath = await downloadMediaMessage(msg, "buffer");
            mediaType = "audio";
        } else {
            return m.reply("Unsupported media type. Reply with an image, video, or audio file.");
        }

        const tempFilePath = `./temp_media.${mediaType}`;
        await fs.writeFile(tempFilePath, mediaPath);

        const catboxUrl = await uploadToCatbox(tempFilePath);
        fs.unlinkSync(tempFilePath); // Remove the local file after uploading

        const message = `Here is your ${mediaType} URL:\n${catboxUrl}`;
        m.reply(message);
    } catch (error) {
        console.error("Error while uploading media:", error);
        m.reply("Oops, an error occurred while generating the URL.");
    }
};