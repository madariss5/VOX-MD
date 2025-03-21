const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const { Catbox } = require('node-catbox');

const catbox = new Catbox();

async function uploadToCatbox(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error("File does not exist");
    }

    try {
        const response = await catbox.uploadFile({
            path: filePath // Uploading file to Catbox
        });

        if (response) {
            return response; // Returns the uploaded file URL
        } else {
            throw new Error("Error retrieving the file link");
        }
    } catch (err) {
        throw new Error(String(err));
    }
}

async function mediaToUrl(origineMessage, zk, commandeOptions) {
    const { msgRepondu, repondre } = commandeOptions;

    if (!msgRepondu) {
        repondre('Please reply to an image, video, or audio file.');
        return;
    }

    let mediaPath, mediaType;

    if (msgRepondu.videoMessage) {
        const videoSize = msgRepondu.videoMessage.fileLength;

        if (videoSize > 50 * 1024 * 1024) {
            repondre('The video is too long. Please send a smaller video.');
            return;
        }

        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        mediaType = 'video';
    } else if (msgRepondu.imageMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        mediaType = 'image';
    } else if (msgRepondu.audioMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        mediaType = 'audio';
    } else {
        repondre('Unsupported media type. Reply with an image, video, or audio file.');
        return;
    }

    try {
        const catboxUrl = await uploadToCatbox(mediaPath);
        fs.unlinkSync(mediaPath); // Remove the local file after uploading

        // Respond with the URL based on media type
        switch (mediaType) {
            case 'image':
                repondre(`Here is your image URL:\n${catboxUrl}`);
                break;
            case 'video':
                repondre(`Here is your video URL:\n${catboxUrl}`);
                break;
            case 'audio':
                repondre(`Here is your audio URL:\n${catboxUrl}`);
                break;
            default:
                repondre('An unknown error occurred.');
                break;
        }
    } catch (error) {
        console.error('Error while creating your URL:', error);
        repondre('Oops, an error occurred.');
    }
}

module.exports = { mediaToUrl };