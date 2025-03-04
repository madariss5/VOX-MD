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

        // API request to fetch the recipe
        const recipeApiUrl = `https://fastrestapis.fasturl.cloud/search/recipe?name=${encodeURIComponent(text)}`;
        const recipeResponse = await axios.get(recipeApiUrl);

        if (recipeResponse.data.status !== 200 || !recipeResponse.data.result.length) {
            return m.reply("❌ *No recipe found!* Try searching for another dish.");
        }

        // Get the first recipe from the result
        const recipe = recipeResponse.data.result[0];
        let { title, link, image, ingredients, time, servings, creator, steps } = recipe;

        // Convert ingredients and steps to text for translation
        const ingredientText = ingredients.join(", ");
        const stepsText = steps.map(step => step.instruction).join(". ");

        // Concatenate text for translation
        const textToTranslate = `Title: ${title}. Ingredients: ${ingredientText}. Steps: ${stepsText}.`;

        // API request to translate the recipe to English
        const translateApiUrl = `https://fastrestapis.fasturl.cloud/tool/translate?text=${encodeURIComponent(textToTranslate)}&target=en`;
        const translateResponse = await axios.get(translateApiUrl, { headers: { accept: "application/json" } });

        if (translateResponse.data.status === 200) {
            const translatedText = translateResponse.data.result.translatedText;

            // Extract translated details
            const translatedParts = translatedText.split(". ");
            title = translatedParts[0].replace("Title: ", "").trim();
            const translatedIngredients = translatedParts[1].replace("Ingredients: ", "").split(", ");
            const translatedSteps = translatedParts.slice(2).map((step, index) => ({
                instruction: step.replace("Steps: ", "").trim(),
                image: steps[index]?.image || null
            }));

            // Format ingredients list
            const ingredientList = translatedIngredients.map((ing, index) => `🔹 *${index + 1}.* ${ing}`).join("\n");

            // Format cooking steps
            const stepsList = translatedSteps.map((step, index) => {
                return `🍳 *Step ${index + 1}:* ${step.instruction}${step.image ? `\n🖼️ [Image](${step.image})` : ""}`;
            }).join("\n\n");

            // Construct translated recipe message
            const recipeMessage = `🍽️ *Recipe Found!*\n\n📌 *Title:* ${title}\n👩‍🍳 *Creator:* ${creator}\n⏳ *Time:* ${time}\n🍽️ *Servings:* ${servings}\n🔗 *Full Recipe:* [Click Here](${link})\n\n🥕 *Ingredients:*\n${ingredientList}\n\n📜 *Steps:*\n${stepsList}\n\n✨ _Powered by VOX-MD_`;

            // Send translated recipe image with details
            await client.sendMessage(
                m.chat,
                {
                    image: { url: image },
                    caption: recipeMessage
                },
                { quoted: m }
            );

        } else {
            return m.reply("❌ *Failed to translate the recipe!* Showing original language.");
        }

    } catch (error) {
        console.error("Recipe fetch error:", error.message);
        m.reply("❌ *Failed to fetch the recipe!* Please try again later.");
    }
};
