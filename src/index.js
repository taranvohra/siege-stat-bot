const fs = require('fs');
const Jimp = require('jimp');
const FONTS = require('./fonts');

const rgx = /\x00/g;

const rows = fs.readFileSync('./siege_game_summary.log', 'utf-8').split('\r');
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
        acc.teams[Number(team.replace(rgx, ''))].push({
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

const isRegularMode = info.mode.replace(rgx, '').trim().includes('Regular');
const isTwoTeamPug = info.teams[2].length === 0 && info.teams[3].length === 0;

if (isRegularMode && isTwoTeamPug) {
  const gameMode = info.teams[0].length === 5 ? '5v5' : '6v6';
  Jimp.read(`../assets/${gameMode}.png`).then(async (template) => {
    let y, nextY;
    const { cores, map, teams, timeLeft } = info;
    const timeLeftSeconds = Number(timeLeft.replace(rgx, '').trim());
    const formattedTimeLeft = new Date(timeLeftSeconds * 1000)
      .toISOString()
      .substr(11, 8);
    const redCoreHealth = Number(cores[0].replace(rgx, '').trim()).toFixed(0);
    const blueCoreHealth = Number(cores[1].replace(rgx, '').trim()).toFixed(0);
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

    template.print(
      langarOrangeFNT,
      580,
      5,
      {
        text: map.replace(rgx, '').trim().replace('CTF-', ''),
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
        text: `${formattedTimeLeft}, on ${new Date().toDateString().slice(4)}`,
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
      const name = player.name.replace(rgx, '').trim().substring(0, 20);
      const country = player.country.replace(rgx, '').trim();
      const nukes = player.nukes.replace(rgx, '').trim();
      const nukeFails = player.nukeFails.replace(rgx, '').trim();
      const nukeKills = player.nukeKills.replace(rgx, '').trim();
      const coreDamage = player.coreDamage.replace(rgx, '').trim();
      const mineFrags = player.mineFrags.replace(rgx, '').trim();
      const builds = player.builds.replace(rgx, '').trim();
      const kills = Number(player.kills.replace(rgx, '').trim());
      const deaths = Number(player.deaths.replace(rgx, '').trim());
      const score = player.score.replace(rgx, '').trim();
      const eff =
        kills === 0 && deaths === 0
          ? '0'
          : ((kills / (kills + deaths)) * 100).toFixed(0);

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
        const flag = await Jimp.read(`../assets/flags/${country}.png`);
        template.composite(flag, 10, y + 36);
      }

      template.print(
        langarEffFNT,
        86,
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
        186,
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
      const name = player.name.replace(rgx, '').trim().substring(0, 20);
      const country = player.country.replace(rgx, '').trim();
      const nukes = player.nukes.replace(rgx, '').trim();
      const nukeFails = player.nukeFails.replace(rgx, '').trim();
      const nukeKills = player.nukeKills.replace(rgx, '').trim();
      const coreDamage = player.coreDamage.replace(rgx, '').trim();
      const mineFrags = player.mineFrags.replace(rgx, '').trim();
      const builds = player.builds.replace(rgx, '').trim();
      const kills = Number(player.kills.replace(rgx, '').trim());
      const deaths = Number(player.deaths.replace(rgx, '').trim());
      const score = player.score.replace(rgx, '').trim();
      const eff =
        kills === 0 && deaths === 0
          ? '0'
          : ((kills / (kills + deaths)) * 100).toFixed(0);

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
        const flag = await Jimp.read(`../assets/flags/${country}.png`);
        template.composite(flag, 660, y + 36);
      }

      template.print(
        langarEffFNT,
        736,
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
        836,
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

    // x = 660;
    // y = 120;

    // for (let i = 0; i < blueTeam.length; i++) {
    //   const name = blueTeam[i].name.replace(rgx, '').trim().substring(0, 20);
    //   template.print(
    //     blueMainFNT,
    //     x,
    //     y,
    //     {
    //       text: name,
    //       alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
    //       alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    //     },
    //     250,
    //     38
    //   );
    //   y += 50;
    // }

    template.write(`../generated/${Date.now()}.png`);
  });
}

// for (let i = 0; i < stats.length; i++) {
//   if (i === 6) {
//     const [name, ...rowValues] = stats[i].split('\t');
//     JIMP.read('../assets/5v5.png').then((template) => {
//       JIMP.loadFont('../assets/red_kenyan_coffee.fnt')
//         .then((fnt) => {
//           const names = [
//             'banny`',
//             'Dangerboy',
//             'Berserker',
//             '[Z]-Cardenas',
//             'sb-Skarn',
//           ];
//           let x = 10;
//           let y = 120;
//           for (let i = 0; i < 5; i++) {
//             template.print(
//               fnt,
//               x,
//               y,
//               {
//                 text: names[i],
//                 alignmentX: JIMP.HORIZONTAL_ALIGN_LEFT,
//                 alignmentY: JIMP.VERTICAL_ALIGN_MIDDLE,
//               },
//               250,
//               38
//             );
//             y = y + 50;
//           }

//           template.write(`generated/${Date.now()}.png`);
//         })
//         .catch((err) => {
//           console.log('FONT ERROR:', err);
//         });
//     });
//   }
// }
