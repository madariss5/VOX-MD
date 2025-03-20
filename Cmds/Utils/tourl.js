const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async (context) => {
    const { client, m } = context; // Extracting message object
    const clientId = "30dd7af05a328f6"; // Imgur Client ID

    // Check if the message contains an image
    if (!m.message || !m.message.imageMessage) {
        return "❌ Please send a valid image.";
    }

    try {
        // Download the image
        const buffer = await downloadMediaMessage(m, "buffer");

        if (!buffer) {
            return "⚠️ Failed to download image.";
        }

        // Save the image temporarily
        const filePath = path.join(__dirname, "image.jpg");
        fs.writeFileSync(filePath, buffer);

        // Upload to Imgur
        async function uploadToImgur(imagePath) {
            try {
                const data = new FormData();
                data.append("image", fs.createReadStream(imagePath));

                const response = await axios.post("https://api.imgur.com/3/image", data, {
                    headers: {
                        Authorization: `Client-ID ${clientId}`,
                        ...data.getHeaders(),
                    },
                });

                return response.data.data.link; // Returns the uploaded image URL
            } catch (error) {
                console.error("Upload failed:", error.message || error);
                return null;
            }
        }

        // Upload and get the image URL
        const imageUrl = await uploadToImgur(filePath);

        // Delete the temporary file
        fs.unlinkSync(filePath);

        if (!imageUrl) {
            return "⚠️ Failed to upload image.";
        }

        // Sending the Imgur URL as a response
        return { text: `📸 *Uploaded Image:* ${imageUrl}`, image: imageUrl };
    } catch (error) {
        console.error("Error processing image:", error);
        return "⚠️ Error processing image.";
    }
};