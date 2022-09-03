const fs = require('fs');
const Discord = require('discord.js');
const { generateSummaryScreenshot } = require('./screenshot');
const { saveSummary } = require('./database');

const client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds],
});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    console.log(`Siege Stat Bot started running at ${new Date().toUTCString()}`);

    setInterval(async () => {
        try {
            const response = await generateSummaryScreenshot();
            if (!response) return;

            const { SUMMARY_LOG_FILE, summaryScreenshot, ...summary } = response;

            const channel = client.channels.cache.get(process.env.SCREENSHOT_CHANNEL);
            const message = await channel.send({
                files: [summaryScreenshot],
            });

            [summaryScreenshot, SUMMARY_LOG_FILE].forEach(fs.unlinkSync);

            await saveSummary({ ...summary, screenshot: message.attachments.first().url });
        } catch (error) {
            console.log('Error: ', error);
        }
    }, 10_000);
});

process.on('unhandledRejection', (rejection) => {
    throw rejection;
});

process.on('uncaughtException', (exception) => {
    console.log('uncaughtException: ', exception);
});
