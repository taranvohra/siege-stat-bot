const Jimp = require('jimp');

const FONTS = (async () => {
  const redMainFNT = await Jimp.loadFont('../assets/main_red.fnt');
  const blueMainFNT = await Jimp.loadFont('../assets/main_blue.fnt');
  const langarFNT = await Jimp.loadFont('../assets/langar.fnt');
  const langarNukesFNT = await Jimp.loadFont('../assets/langar-nukes.fnt');
  const langarNukesFailedFNT = await Jimp.loadFont(
    '../assets/langar-nukes-failed.fnt'
  );
  const langarNukesKilledFNT = await Jimp.loadFont(
    '../assets/langar-nukes-killed.fnt'
  );
  const langarMineFragsFNT = await Jimp.loadFont(
    '../assets/langar-mine-frags.fnt'
  );
  const langarBuildsFNT = await Jimp.loadFont('../assets/langar-builds.fnt');
  const langarEffFNT = await Jimp.loadFont('../assets/langar-eff.fnt');
  const langarDeathsFNT = await Jimp.loadFont('../assets/langar-deaths.fnt');
  const fragsRedFNT = await Jimp.loadFont('../assets/frags-red.fnt');
  const fragsBlueFNT = await Jimp.loadFont('../assets/frags-blue.fnt');
  const langarWhiteFNT = await Jimp.loadFont('../assets/langar-white.fnt');

  return {
    redMainFNT,
    blueMainFNT,
    langarFNT,
    langarNukesFNT,
    langarNukesFailedFNT,
    langarNukesKilledFNT,
    langarMineFragsFNT,
    langarBuildsFNT,
    langarEffFNT,
    langarDeathsFNT,
    fragsRedFNT,
    fragsBlueFNT,
    langarWhiteFNT,
  };
})();

module.exports = FONTS;
