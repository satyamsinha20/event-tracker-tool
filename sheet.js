const { GoogleSpreadsheet } = require("google-spreadsheet");
const CryptoJS = require("crypto-js");
const creds = require("./credentials.json");
const { SHEET_ID } = require("./config");

async function getSheet() {
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

function generateEventId(name, date, venue, city) {
  return CryptoJS.SHA1(
    `${name || ""}${date || ""}${venue || ""}${city || ""}`
  ).toString();
}

function isExpired(date) {
  if (!date) return false;
  return new Date(date) < new Date();
}

module.exports = {
  getSheet,
  generateEventId,
  isExpired
};
