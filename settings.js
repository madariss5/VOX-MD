/* Bot settings 

You don't have to set this if you deploy using heroku because you can simply set them in environment variables, also don't forget to sleep */


const session = process.env.SESSION || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0Z3OTFURjM3R3ljL05jc1pJdW40Q1pxT3llV1NDM3pPZWJ5Y1gxMkJXST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMlNuQlg3U3hxakdpK0ZBd3VPc0xiWlZ2Y3hFMUVUWnhzR2VZREJFSkFDZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ3TGl5L2FxYXQ4dmhscUFOejg1YzdtdENnSUlqTG1lNlAvQi8vOVBMbVg0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIzU3FsdjJVN3J2ZHlFSjcxTWl1WHlKcE1lNWVLYzBwejFIRkk4UkNEZnpnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVJK2Q1Sk1EdmVVOU1OdmRvUW1PQ05aTUVZKzZkajQ2RFhVc3htMzJTM2c9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRDL2wwRDU1Zk5Kc3F6Q3EyWkdsejV1eUNFWURrZEdNQmtaSHJndyt0QVk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0NFM2FnK3BwWTh4MFlNOWdHWWpaMldwbGdXQVRsNE1EUitYdlN1azcwbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUXh5V25qekVMOCtyRWExZXJ5NmxwNmdoRXIxZ0dPMG1EVmVxVDdtVTNHWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVUdFJJVkFjS3BGTGVrM21uSTBqMXloNEk0YkdvSTBmOW9QTkR3RFVQN2tVZXI0VFlqWkJ4REJ3SDBXNVdIUnl1SWZEempXOVI5UDZmN1pLa0QvRkFBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjcsImFkdlNlY3JldEtleSI6Ii9zUzNFZEpBeWVub2VwcEZseWNuaGpoMFFPSEduc1NMYnpjSTdMbDJwZWc9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiNDkxNTU2MjM3ODM0M0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI5QkVDRDJENTVDNjVDNDY4NTYwN0RBRDU2NUJFNjBCRSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzQzMTkzMTc0fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI0OTE1NTYyMzc4MzQzQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjM1REFCMjAxOEUyNkUyNEIxQzYwMTFGODVEQzVDNEJCIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NDMxOTMxNzR9LHsia2V5Ijp7InJlbW90ZUppZCI6IjQ5MTU1NjIzNzgzNDNAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQkYyRjJCN0Q4NTc4MTlEMTY3OEZBMkMyMkIxNUM3MzEifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0MzE5MzE3N31dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoiaUczRS1taFFSMUNGWmY2X1pzU2oydyIsInBob25lSWQiOiJjMDYyYTAwOS03NzFhLTQ3NmItODcyYy1hMGZiYThkZDk4ZmQiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNC9WVm0ybzdxRUNmbHBidzRzSkJwODg1bFFzPSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InJRQWEyVFJOanBPN3FZTkxKdUl0ODZ0RGV3WT0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiJNOThNQ0ZOMyIsIm1lIjp7ImlkIjoiNDkxNTU2MjM3ODM0MzozMUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJCTEFDS1NLWS1NRCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUFhQeVMwUXlJaWN2d1lZQWlBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiNzJWMTFsSVp2YWxKdkYyNjJiTVh3MzRuS2dSTjlLbzNDT2d3KzRINGVScz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiNzZORmt6UWxqeGdiRExNbmN3VzRmclJqUytXTCsrUDhJcExBS09VSnY4bUJrTXpvM1ZQRjR4RjFrV05UWkhGWFZINWpSZjJERnRSNlk4cHVYUWVqQ2c9PSIsImRldmljZVNpZ25hdHVyZSI6Im5YaW0vTVhlZ01UaW5RbU5oWmVRUGpORVkvNFptV1hZdG5wcFNWMEN4d3JHdWlKRzk0WHM2T0pwUDZuMEorT1pMTEEwc21WUGdUV1p0aThRbEhRd0RRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiNDkxNTU2MjM3ODM0MzozMUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJlOWxkZFpTR2IycFNieGR1dG16RjhOK0p5b0VUZlNxTndqb01QdUIrSGtiIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQzMTkzMTczLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUlqdyJ9';

const prefix = process.env.PREFIX || '.';
const mycode = process.env.CODE || "49";
const author = process.env.STICKER_AUTHOR || 'BLACKSKY-MD;
const packname = process.env.PACKNAME || 'BLACKSKY-MD 🤖';
const dev = process.env.DEV || '4915563151347';
const DevDreaded = dev.split(",");
const botname = process.env.BOTNAME || 'BLACKSKY-MD;
const mode = process.env.MODE || 'public';
const gcpresence = process.env.GC_PRESENCE || 'false';
const antionce = process.env.ANTIVIEWONCE || 'true';
const sessionName = "session";
const cookies = JSON.parse(process.env.COOKIE || '[{"domain":".youtube.com","expirationDate":1764463277.409877,"hostOnly":false,"httpOnly":false,"name":"__Secure-1PAPISID","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"UoBcKfo0_FSAxQ5D/A5ZClpB2xVLQJQGUx","id":1},{"domain":".youtube.com","expirationDate":1764463277.412158,"hostOnly":false,"httpOnly":true,"name":"__Secure-1PSID","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"g.a000pghxevPjwTr5Un_D-PS1UxiaEdymANhc_5NWNQgaApthzLU0MOFGGamQ5yqi2vrAqKldbgACgYKASoSARUSFQHGX2MiB0PtUQYJy2_oQLkmMPXgfRoVAUF8yKpuqWya_M2xRHe_6e9o_6TK0076","id":2},{"domain":".youtube.com","expirationDate":1762941611.655441,"hostOnly":false,"httpOnly":true,"name":"__Secure-1PSIDCC","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"AKEyXzWtrmvqerXnEweUSkGiFKAn57TBnvoAEBDi6B33Sg4gpMOANgVFwDBU_JtKQXLpisy_","id":3}]');
const presence = process.env.WA_PRESENCE || 'online';

const antitag = process.env.ANTITAG || 'true';
const antidelete = process.env.ANTIDELETE || 'true';
const autoview = process.env.AUTOVIEW_STATUS || 'true';
const autolike = process.env.AUTOLIKE_STATUS || 'true';
const autoread = process.env.AUTOREAD || 'false';
const autobio = process.env.AUTOBIO || 'false';

module.exports = {
  sessionName,
  presence,
  autoview,
  autoread,
  botname,
  cookies,
  autobio,
  mode,
autolike,
  prefix,
  mycode,
  author,
  packname,
  dev,
  DevDreaded,
  gcpresence,
  antionce,
session,
antitag,
antidelete
};
