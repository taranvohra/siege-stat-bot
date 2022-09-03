function getUTCDateString(date) {
    return date.toUTCString().split(' ').slice(1, 4).join(' ');
}

function getSummaryWorksheetTitle() {
    return new Date().getUTCFullYear().toString();
}

module.exports = {
    getUTCDateString,
    getSummaryWorksheetTitle,
};
