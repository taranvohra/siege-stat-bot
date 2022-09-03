const fs = require('fs');
const Discord = require('discord.js');
const { generateSummaryScreenshot } = require('./generateSummaryScreenshot');

require('dotenv').config();

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

            const { summaryScreenshot, SUMMARY_LOG_FILE } = response;

            const channel = client.channels.cache.get(process.env.STATS_CHANNEL);
            const message = await channel.send({
                files: [summaryScreenshot],
            });

            [summaryScreenshot, SUMMARY_LOG_FILE].forEach(fs.unlinkSync);
        } catch (error) {
            console.log('Error: ', error);
        }
    }, 10000);
});

process.on('unhandledRejection', (rejection) => {
    throw rejection;
});

process.on('uncaughtException', (exception) => {
    console.log('uncaughtException: ', exception);
});
