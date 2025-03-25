module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("Provide some text or query for ChatGPT.");
    }

    try {
        const data = await fetchJson(`https://fastrestapis.fasturl.cloud/aillm/gpt-4o-turbo?ask=${encodeURIComponent(text)}`);

        if (data && data.result) {
            const res = data.result;
            await m.reply(res);
        } else {
            m.reply("Invalid response from API.");
        }
    } catch (error) {
        m.reply("Something went wrong...\n\n" + error);
    }
};