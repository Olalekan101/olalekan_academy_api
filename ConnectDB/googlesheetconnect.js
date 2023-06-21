const { google } = require("googleapis");
require("dotenv").config();

const SHEET_ID = process.env.SHEET_ID;

const client = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth: client });

module.exports = { SHEET_ID, client, sheets };
