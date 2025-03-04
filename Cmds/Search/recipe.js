const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🍽️ *Enter the name of the dish you want a recipe for!*\n\nExample:\n`.recipe Pasta`");
    }

    try {
        // Notify user that the search is in progress
        await client.sendMessage(m.chat, {
            text: "🔍 *Searching for the recipe... Please wait!* ⏳"
        });

        // API request
        const apiUrl = `https://fastrestapis.fasturl.cloud/search/recipe?name=${encodeURIComponent(text)&lang=eng}`;
        const response = await axios.get(apiUrl);

        if (response.data.status !== 200 || !response.data.result.length) {
            return m.reply("❌ *No recipe found!* Try searching for another dish.");
        }

        // Get the first recipe from the result
        const recipe = response.data.result[0];
        const { title, link, image, ingredients, time, servings, creator, steps } = recipe;

        // Format ingredients list
        const ingredientList = ingredients.map((ing, index) => `🔹 *${index + 1}.* ${ing}`).join("\n");

        // Format cooking steps
        const stepsList = steps.map((step, index) => {
            return `🍳 *Step ${index + 1}:* ${step.instruction}${step.image ? `\n🖼️ [Image](${step.image})` : ""}`;
        }).join("\n\n");

        // Construct recipe message
        const recipeMessage = `🍽️ *Recipe Found!*\n\n📌 *Title:* ${title}\n👩‍🍳 *Creator:* ${creator}\n⏳ *Time:* ${time}\n🍽️ *Servings:* ${servings}\n🔗 *Full Recipe:* [Click Here](${link})\n\n🥕 *Ingredients:*\n${ingredientList}\n\n📜 *Steps:*\n${stepsList}\n\n✨ _Powered by VOX-MD_`;

        // Send recipe image with details
        await client.sendMessage(
            m.chat,
            {
                image: { url: image },
                caption: recipeMessage
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("Recipe fetch error:", error.message);
        m.reply("❌ *Failed to fetch the recipe!* Please try again later.");
    }
};
