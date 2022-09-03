const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSummaryWorksheetTitle, getUTCDateString } = require('./utils');

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

async function saveSummary({ date, map, type, cores, timeLeft, screenshot }) {
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();

    const title = getSummaryWorksheetTitle();

    let worksheet = doc.sheetsByTitle[title];
    if (!worksheet) {
        worksheet = await doc.addWorksheet({ title });
    }

    await worksheet.setHeaderRow(['Date', 'Map', 'Type', 'Cores', 'Time Left', 'Screenshot']);
    await worksheet.addRow([getUTCDateString(date), map, type, cores, timeLeft, screenshot]);
}

module.exports = { saveSummary };
