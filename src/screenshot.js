const fs = require('fs');
const Jimp = require('jimp');
const FONTS = require('./fonts');
const { getUTCDateString } = require('./utils');

const RGX = /\x00/g;
const SUMMARY_LOG_FILE = '../Pugs/siege_game_summary.log';

async function generateSummaryScreenshot() {
    const hasSummaryAvailable = fs.existsSync(SUMMARY_LOG_FILE);
    if (!hasSummaryAvailable) return;

    const rows = fs.readFileSync(SUMMARY_LOG_FILE, 'utf-8').split('\r');
    const info = rows.reduce(
        (acc, curr, i) => {
            if (i === 0) acc.mode = curr;
            else if (i === 1) acc.map = curr;
            else if (i === 2) acc.timeLeft = curr;
            else if (i === 3) acc.cores[0] = curr;
            else if (i === 4) acc.cores[1] = curr;
            else if (i === 5) acc.cores[2] = curr;
            else if (i === 6) acc.cores[3] = curr;
            else {
                const [
                    name,
                    team,
                    score,
                    kills,
                    nukes,
                    nukeFails,
                    nukeKills,
                    deaths,
                    coreDamage,
                    mineFrags,
                    builds,
                    country,
                ] = curr.split('\t');
                if (team) {
                    const teamPlayers = acc.teams[Number(team.replace(RGX, ''))];
                    teamPlayers.push({
                        name,
                        team,
                        score,
                        kills,
                        nukes,
                        nukeFails,
                        nukeKills,
                        deaths,
                        coreDamage,
                        mineFrags,
                        builds,
                        country,
                    });

                    teamPlayers.sort((a, b) => {
                        const bScore = Number(b.score.replace(RGX, '').trim());
                        const aScore = Number(a.score.replace(RGX, '').trim());
                        return bScore - aScore;
                    });
                }
            }
            return acc;
        },
        {
            mode: '',
            map: '',
            timeLeft: null,
            cores: [],
            teams: [[], [], [], []],
        }
    );

    const isRegularMode = info.mode.replace(RGX, '').trim().includes('Regular');
    const isTwoTeamPug = info.teams[2].length === 0 && info.teams[3].length === 0;

    if (isRegularMode && isTwoTeamPug) {
        const gameMode = info.teams[0].length === 5 ? '5v5' : '6v6';
        const template = await Jimp.read(`assets/${gameMode}.png`);

        let y, nextY;
        const now = new Date();
        const { cores, map, teams, timeLeft } = info;
        const timeLeftSeconds = Number(timeLeft.replace(RGX, '').trim());
        const formattedTimeLeft = new Date(timeLeftSeconds * 1000).toISOString().substring(11, 19);
        const redCoreHealth = Number(cores[0].replace(RGX, '').trim()).toFixed(0);
        const blueCoreHealth = Number(cores[1].replace(RGX, '').trim()).toFixed(0);
        const mapName = map.replace(RGX, '').trim().replace('CTF-', '');
        const [redTeam, blueTeam] = teams;
        const {
            redMainFNT,
            blueMainFNT,
            redMainLgFNT,
            blueMainLgFNT,
            langarBuildsFNT,
            langarDeathsFNT,
            langarEffFNT,
            langarMineFragsFNT,
            langarNukesFNT,
            langarNukesFailedFNT,
            langarNukesKilledFNT,
            fragsBlueFNT,
            fragsRedFNT,
            langarOrangeFNT,
        } = await FONTS;

        if (redTeam.length === 0 || blueTeam.length === 0) return;

        template.print(
            langarOrangeFNT,
            580,
            5,
            {
                text: mapName,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            },
            250,
            10
        );

        template.print(
            langarOrangeFNT,
            580,
            20,
            {
                text: 'Siege',
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            },
            250,
            10
        );

        template.print(
            langarOrangeFNT,
            580,
            36,
            {
                text: `${formattedTimeLeft}, on ${getUTCDateString(now)}`,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            },
            250,
            10
        );

        template.print(
            redMainLgFNT,
            215,
            74,
            {
                text: redCoreHealth,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            },
            250,
            50
        );

        template.print(
            blueMainLgFNT,
            875,
            74,
            {
                text: blueCoreHealth,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            },
            250,
            50
        );

        y = nextY = 120;
        for (let i = 0; i < redTeam.length; i++) {
            y = nextY;
            nextY += 50;
            const player = redTeam[i];
            const name = player.name.replace(RGX, '').trim().substring(0, 20);
            const country = player.country.replace(RGX, '').trim();
            const nukes = player.nukes.replace(RGX, '').trim();
            const nukeFails = player.nukeFails.replace(RGX, '').trim();
            const nukeKills = player.nukeKills.replace(RGX, '').trim();
            const coreDamage = player.coreDamage.replace(RGX, '').trim();
            const mineFrags = player.mineFrags.replace(RGX, '').trim();
            const builds = player.builds.replace(RGX, '').trim();
            const kills = Number(player.kills.replace(RGX, '').trim());
            const deaths = Number(player.deaths.replace(RGX, '').trim());
            const score = player.score.replace(RGX, '').trim();
            const eff =
                kills === 0 && deaths === 0 ? '0' : ((kills / (kills + deaths)) * 100).toFixed(0);

            template.print(
                redMainFNT,
                10,
                y,
                {
                    text: name,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                250,
                38
            );

            template.print(
                langarNukesFNT,
                342,
                y,
                {
                    text: nukes,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarNukesFailedFNT,
                342,
                y + 16,
                {
                    text: nukeFails,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarNukesKilledFNT,
                342,
                y + 32,
                {
                    text: nukeKills,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarNukesKilledFNT,
                462,
                y,
                {
                    text: Number(coreDamage).toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarMineFragsFNT,
                462,
                y + 16,
                {
                    text: mineFrags,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarBuildsFNT,
                462,
                y + 32,
                {
                    text: builds,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                fragsRedFNT,
                500,
                y,
                {
                    text: kills.toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                50,
                50
            );

            template.print(
                redMainFNT,
                550,
                y,
                {
                    text: Number(score).toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                50,
                50
            );

            if (country.length > 0) {
                const flag = await Jimp.read(`assets/flags/${country}.png`);
                template.composite(flag, 10, y + 36);
            }

            template.print(
                langarEffFNT,
                66,
                y + 37,
                {
                    text: `${eff}%`,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                10
            );

            template.print(
                langarDeathsFNT,
                166,
                y + 37,
                {
                    text: deaths.toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                10
            );
        }

        y = nextY = 120;
        for (let i = 0; i < blueTeam.length; i++) {
            y = nextY;
            nextY += 50;
            const player = blueTeam[i];
            const name = player.name.replace(RGX, '').trim().substring(0, 20);
            const country = player.country.replace(RGX, '').trim();
            const nukes = player.nukes.replace(RGX, '').trim();
            const nukeFails = player.nukeFails.replace(RGX, '').trim();
            const nukeKills = player.nukeKills.replace(RGX, '').trim();
            const coreDamage = player.coreDamage.replace(RGX, '').trim();
            const mineFrags = player.mineFrags.replace(RGX, '').trim();
            const builds = player.builds.replace(RGX, '').trim();
            const kills = Number(player.kills.replace(RGX, '').trim());
            const deaths = Number(player.deaths.replace(RGX, '').trim());
            const score = player.score.replace(RGX, '').trim();
            const eff =
                kills === 0 && deaths === 0 ? '0' : ((kills / (kills + deaths)) * 100).toFixed(0);

            template.print(
                blueMainFNT,
                660,
                y,
                {
                    text: name,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                250,
                38
            );

            template.print(
                langarNukesFNT,
                992,
                y,
                {
                    text: nukes,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarNukesFailedFNT,
                992,
                y + 16,
                {
                    text: nukeFails,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarNukesKilledFNT,
                992,
                y + 32,
                {
                    text: nukeKills,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarNukesKilledFNT,
                1112,
                y,
                {
                    text: Number(coreDamage).toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarMineFragsFNT,
                1112,
                y + 16,
                {
                    text: mineFrags,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                langarBuildsFNT,
                1112,
                y + 32,
                {
                    text: builds,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                20
            );

            template.print(
                fragsBlueFNT,
                1150,
                y,
                {
                    text: kills.toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                50,
                50
            );

            template.print(
                blueMainFNT,
                1200,
                y,
                {
                    text: Number(score).toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                50,
                50
            );

            if (country.length > 0) {
                const flag = await Jimp.read(`assets/flags/${country}.png`);
                template.composite(flag, 660, y + 36);
            }

            template.print(
                langarEffFNT,
                716,
                y + 37,
                {
                    text: `${eff}%`,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                10
            );

            template.print(
                langarDeathsFNT,
                816,
                y + 37,
                {
                    text: deaths.toFixed(0),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                40,
                10
            );
        }

        const summaryScreenshot = `generated/siege${gameMode}-${mapName}-${Date.now()}.png`;
        await template.writeAsync(summaryScreenshot);

        return {
            date: now,
            map: mapName,
            type: gameMode,
            cores: [redCoreHealth, blueCoreHealth].join(' - '),
            timeLeft: formattedTimeLeft,
            summaryScreenshot,
            SUMMARY_LOG_FILE,
        };
    }
}

module.exports = {
    generateSummaryScreenshot,
};
