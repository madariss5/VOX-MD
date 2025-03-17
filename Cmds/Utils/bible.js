const fetch = require('node-fetch');
const { translate } = require('@vitalets/google-translate-api');

const BASE_URL = 'https://bible-api.com';

async function bibleChapterHandler(m, conn) {
  try {
    // Extract the chapter number or name from the command text.
    let chapterInput = m.text.split(' ').slice(1).join('').trim();

    if (!chapterInput) {
      throw new Error(`Please specify the chapter number or name. Example: -bible john 3:16`);
    }

    // Encode the chapterInput to handle special characters
    chapterInput = encodeURIComponent(chapterInput);

    // Make an API request to fetch the chapter information.
    let chapterRes = await fetch(`${BASE_URL}/${chapterInput}`);

    if (!chapterRes.ok) {
      throw new Error(`Please specify the chapter number or name. Example: -bible john 3:16`);
    }

    let chapterData = await chapterRes.json();

    // Translate into English, Kiswahili, and Hindi
    let translatedEnglish = await translate(chapterData.text, { to: 'en', autoCorrect: true });
    let translatedSwahili = await translate(chapterData.text, { to: 'sw', autoCorrect: true });
    let translatedHindi = await translate(chapterData.text, { to: 'hi', autoCorrect: true });

    let bibleChapter = `
📖 *The Holy Bible*\n
📜 *Chapter ${chapterData.reference}*\n
Type: ${chapterData.translation_name}\n
Number of verses: ${chapterData.verses.length}\n
🔮 *Chapter Content (English):*\n
${translatedEnglish.text}\n
🌍 *Chapter Content (Kiswahili):*\n
${translatedSwahili.text}\n
🔮 *Chapter Content (Hindi):*\n
${translatedHindi.text}`;

    m.reply(bibleChapter);
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
}
