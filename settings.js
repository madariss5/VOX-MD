/* Bot settings 

You don't have to set this if you deploy using heroku because you can simply set them in environment variables, also don't forget to sleep */


const session = process.env.SESSION || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMkRuWHdwT2ZnVmg3Z3ZDMFBJYUF1andjbFF2NzhCeU9YV0s1Z2J2c1Izbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRE9ZM0NBTHJEVmEyYnEwOUdZRHZSZWtjcTFpUllDVGozb041KzQvZC9FOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJRQkFCOEd2TkgvM3AzTG9vVWhVZVd0L2szZ1JoQitrZ25JY2k5U0ROQUZ3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDWDJiVHZvTHh6MGZueFhoZnRSbzZkOFhZbEdTbkg4Wk00eEVxQll5K1ZRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVDcVN1UUh5bS9VUjdoM2xnd29XYVhnays5UENuK2o1M3JEM0laWmlURU09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik5ubGZLZGdlRStDdnpUZ2RmcVJYblMxWW1aYjZlQ2hLUFBEekxJNEdaM0E9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY1BDa0dJZGdEQU1hWW8wMVVkRm04cmpVU3NWenVBemZ4YUhzR0pxbzNXbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTk1hNDlPcTFvS3laaE95Y1g5VzFOS1pkUm9ad2FhTXlaRGRLaXZnLzB4Yz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjdCMXBsT2traXN6WEhDU1E4K1RVaFNkSmR2MjJkSCsrTFNjUlJaNzhKRWlYZzhiQTZoUExWY2pZb1BmWUdhTzNZUkdyT2FNeXg0cm5RTitYYm1BWEFRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MSwiYWR2U2VjcmV0S2V5IjoiNTZ0U0pMcERkZ2R5RkorUjJBWkk1Z2NoU2lRQjZESlhycmt0N3g1RldObz0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOlt7ImtleSI6eyJyZW1vdGVKaWQiOiI5NzQ3MDg5NDUzMEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIwQjFBQkYxN0IxNjgzNEIwRDkyRkI5QTBBQkRBMjA5NiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzM5OTQ4NDMyfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5NzQ3MDg5NDUzMEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJGQ0U4QkVFRjI0MEU1NTREOUUyMkY2REVFQkY5REY5OSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzM5OTQ4NDM4fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5NzQ3MDg5NDUzMEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI0QjRDQUNBRTMyRjgxMEFFRUNGREY1NDU5RTU4NDZFQiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzM5OTQ4NDY5fV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOnRydWV9LCJkZXZpY2VJZCI6IjUzdWlKUm43UnRPWE0tOG01aTAtS2ciLCJwaG9uZUlkIjoiYzdhNTBiMTctOTdlYS00MTNkLWI4ZDgtNDBkYWU2YWM0NmZjIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InhRWWorZ2ZXZCs1OUE0clRmSTZYQVh6OXBaZz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJT0dDa2Y4cWtYcEt2NVZFYWZ2ZlZ3YWlRRFk9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiNEc0WU5aMVYiLCJtZSI6eyJpZCI6Ijk3NDcwODk0NTMwOjQ0QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IkZJUkUgTUFO8J+UpSDwn5mL8J+Pv+KAjeKZgu+4jyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTGJvbFpBQ0VQNkMxcjBHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiYmNIREk2Sk1rVkovS2l1T1k2RHJNSnpHTlV5V05qYW1GT0tmNE1xb25EUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiR2lZVTI1OWhZdTd1U3MwWEZUcU5DM2tSMW9veFVVNHdTVnZNTzFqTEk1cm1vQWV2K2U3QUpLZ2J5TmpnQ3hoNXVvOFRMUXpFSnRtS2tpaTROZGIrRFE9PSIsImRldmljZVNpZ25hdHVyZSI6IjlkUVFnWm5oM1RCTzBBcFdxNit4Q1hDcUNkYS9OeS91VHZiYVgwUE5PS0kzbkkwTEk0T2o1dXpLdE9Dc1lzeGoySE16RG5paGdoR2k1dnpEcXphakJRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTc0NzA4OTQ1MzA6NDRAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCVzNCd3lPaVRKRlNmeW9yam1PZzZ6Q2N4alZNbGpZMnBoVGluK0RLcUp3MCJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczOTk0ODQyNywibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFOcHkifQ==';

const prefix = process.env.PREFIX || '.';
const mycode = process.env.CODE || "254";
const author = process.env.STICKER_AUTHOR || 'Kanambo';
const packname = process.env.PACKNAME || 'Kanlia md2 🤖';
const dev = process.env.DEV || '254114148625';
const DevDreaded = dev.split(",");
const botname = process.env.BOTNAME || 'KANAMBO';
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
