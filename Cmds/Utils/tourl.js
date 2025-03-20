const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

module.exports = async (context) => {
    const { client, m, text } = context; // Bot context
    const clientId = "30dd7af05a328f6"; // Imgur Client ID

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

    // Define the image path (change as needed)
    const imagePath = "path/to/your/image.jpg"; 

    // Upload image and send response
    const imageUrl = await uploadToImgur(imagePath);
    
    if (!imageUrl) {
        return "⚠️ Failed to upload image.";
    }

    // Sending the image URL as a response
    return { text: `📸 *Uploaded Image:* ${imageUrl}`, image: imageUrl };
};