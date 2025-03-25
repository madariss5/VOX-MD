module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("Provide some text to humanize.");
    }

    try {
        const data = await fetchJson(`https://fastrestapis.fasturl.cloud/aiexperience/humanizer?text=${encodeURIComponent(text)}`);

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