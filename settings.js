/* Bot settings 

You don't have to set this if you deploy using heroku because you can simply set them in environment variables, also don't forget to sleep */


const session = process.env.SESSION || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0JvUXBTQWFCVDduL3lTaDNsODlMSXp4dkd3dmg4RlkyMXdCRmJBQXMyOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYU1pMG12c3JwQU1xTVh5dXh2ZVlRVW1BUGcvMC9mOEtKSzNtM0t0QlZ3az0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzRmNVRGsxYm1VemZyM1pyTjNqdW1ZZDRYem81REtxRFREWHVnMnk2c2xRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJac1Ira2YrUkdoVWw1SmJobXZxYlR0VWg2RDJXTUZZN3VPRDVrT2lzZXc0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFFMjErQU1JVzFldG9Kek5iSks3eW5veTBzNHpYTmV1aDZQWkprTm11Rmc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9zUkNSTTRFbmZaeFIzMkdzSGtoYXZITVZscWNqNEU2VEdmWkwvQ2Q5MkU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0FtTVM2amtkVm1leVk3L2pvUVR3ODI3dHlrK2NNTVhsdVUzV2tNN0xrST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQWhPT2dHblJsOGdKNkR3RzZwT0cvcEw4UUg2V1gxb1FRdjUyZUNVWEZtMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjdhRkRBL0JvL3ppcFYydlR5djZZVWZSbG5ReGd6MWFtU2sxbzdJZTZyemhEeDR5Nno4VVgwc05pV2V5cXNab2FRMVNMYW5TaCtCeTBVNk9mV1lIbERRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTYzLCJhZHZTZWNyZXRLZXkiOiJScnprYSt6TElMOEtWMGxKSDQvRENKeDh5a0tkSjFwZnF3RU5ZSlgzTmFnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NDc2MjQ4NjQzNkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIwREYyRjFENzI3NUM0QzgxNjc1OTA5NEZBRUZCMkYyMSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzQyODM5OTg3fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTQ3NjI0ODY0MzZAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiRDBDQTU4NEMyOTZERkYyOUY5NzQwMTIwQTdDNTUzQzMifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0MjgzOTk4OH1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoiV0RwQnhGakhTVWl2NkplaWU4MXhpUSIsInBob25lSWQiOiJkNDIxMGQwZi05MWNjLTRkZTktYjkxNS0zZDc3MmVjZTI4MTciLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTm16SGNUdmsxQ0pzVUtHdHdBeGlDR1doNk13PSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkE4TE53dS9FR2dpZVZ2cWl0NFVPRGNUdmJ0WT0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiJHRlJIWldOVCIsIm1lIjp7ImlkIjoiMjU0NzYyNDg2NDM2OjlAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiVk9YTkVUIPCfpbcifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ01EU25Od0hFS0xCaHI4R0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkkrOE44bkFiaFhVU293ZE53a2IwR1BVbURKVGhUM3dPa29sSXRNZEhVRkk9IiwiYWNjb3VudFNpZ25hdHVyZSI6IldkeWZsUlpDcTFBQis4dnBIbFhPRUZWL2JsV21NOVBJMTRqa1d0aytyM3FiMmphS1MzcnJ0eU5LbEhteVdpd2FHSWhVa2NxN0x1dHNhUm5SWFBlakJ3PT0iLCJkZXZpY2VTaWduYXR1cmUiOiIzQlFDUGJJZzlPa21ETUNRcTFvUHZGRHd6Q0tTaCtRRUN3anl2YnY2cVRmRmhOSXRldE1Hc3dxVXE3RkMwcHdzZThTMlVjQlVVeFJlU0tvMDl5NU5EZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc2MjQ4NjQzNjo5QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlNQdkRmSndHNFYxRXFNSFRjSkc5QmoxSmd5VTRVOThEcEtKU0xUSFIxQlMifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDI4Mzk5ODMsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSDB1In0=';

const prefix = process.env.PREFIX || '.';
const mycode = process.env.CODE || "254";
const author = process.env.STICKER_AUTHOR || 'Kanambo';
const packname = process.env.PACKNAME || 'Kanlia md2 🤖';
const dev = process.env.DEV || '254114148625';
const DevDreaded = dev.split(",");
const botname = process.env.BOTNAME || 'VOX-MD';
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
