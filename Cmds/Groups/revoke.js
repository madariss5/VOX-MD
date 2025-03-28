const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, groupMetadata } = context;

await client.groupRevokeInvite(m.chat); 
   await client.sendMessage(m.chat, 'Group link revoked!', m); 
   let response = await client.groupInviteCode(m.chat); 
 client.sendMessage(m.sender, `https://chat.whatsapp.com/${response}\n\nHere is the new group link for ${groupMetadata.subject}`, m, { detectLink: true }); 
 client.sendMessage(m.chat, `Sent you the new group link in private!`, m); 

})

}

