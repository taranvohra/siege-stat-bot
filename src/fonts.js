const Jimp = require('jimp');

const FONTS = (async () => {
  const redMainFNT = await Jimp.loadFont('assets/main_red.fnt');
  const blueMainFNT = await Jimp.loadFont('assets/main_blue.fnt');
  const redMainLgFNT = await Jimp.loadFont('assets/main_red-lg.fnt');
  const blueMainLgFNT = await Jimp.loadFont('assets/main_blue-lg.fnt');
  const langarNukesFNT = await Jimp.loadFont('assets/langar-nukes.fnt');
  const langarNukesFailedFNT = await Jimp.loadFont(
    'assets/langar-nukes-failed.fnt'
  );
  const langarNukesKilledFNT = await Jimp.loadFont(
    'assets/langar-nukes-killed.fnt'
  );
  const langarMineFragsFNT = await Jimp.loadFont(
    'assets/langar-mine-frags.fnt'
  );
  const langarBuildsFNT = await Jimp.loadFont('assets/langar-builds.fnt');
  const langarEffFNT = await Jimp.loadFont('assets/langar-eff.fnt');
  const langarDeathsFNT = await Jimp.loadFont('assets/langar-deaths.fnt');
  const fragsRedFNT = await Jimp.loadFont('assets/frags-red.fnt');
  const fragsBlueFNT = await Jimp.loadFont('assets/frags-blue.fnt');
  const langarOrangeFNT = await Jimp.loadFont('assets/langar-orange.fnt');

  return {
    redMainFNT,
    blueMainFNT,
    redMainLgFNT,
    blueMainLgFNT,
    langarNukesFNT,
    langarNukesFailedFNT,
    langarNukesKilledFNT,
    langarMineFragsFNT,
    langarBuildsFNT,
    langarEffFNT,
    langarDeathsFNT,
    fragsRedFNT,
    fragsBlueFNT,
    langarOrangeFNT,
  };
})();

module.exports = FONTS;
