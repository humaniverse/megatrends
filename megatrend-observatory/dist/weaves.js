/* Each yarn has a fixed colour. The motif and the order of its colours
   identify a publication; their area carries no numerical meaning. */
(() => {
  const colours = Object.fromEntries(
    window.OBS_THREADS.map((t) => [t.id, t.color]),
  );
  colours.other = '#887f88';
  const ground = '#e9e2d6';
  const ink = '#30203c';
  const cache = new Map();
  const shades = new Map();

  function seedFor(value) {
    let seed = 7;
    for (const char of value) seed = (31 * seed + char.charCodeAt(0)) >>> 0;
    return seed;
  }

  function colourAt(x, y, mode, palette, offset) {
    const fold = (n) => Math.abs((n % 28) - 14);
    let band;
    switch (mode) {
      case 0:
        band = Math.floor((x + Math.floor(y / 9) * 7) / 11);
        break;
      case 1:
        band = Math.floor((fold(x) + y) / 6);
        break;
      case 2:
        band = Math.floor((fold(x) + fold(y)) / 5);
        break;
      case 3:
        band = Math.floor(x / 7) + 2 * Math.floor(y / 12);
        break;
      case 4:
        band = Math.floor((x + (Math.floor(y / 20) % 2 ? y : -y) + 400) / 8);
        break;
      default:
        band = Math.floor((x + Math.floor(y / 13) * 9) / 5);
        break;
    }
    return palette[(band + offset + palette.length * 60) % palette.length];
  }

  function tone(hex, k) {
    const key = hex + Math.round(k * 1000);
    if (shades.has(key)) return shades.get(key);
    const n = parseInt(hex.slice(1), 16);
    const value =
      'rgb(' +
      [n >> 16, (n >> 8) & 255, n & 255]
        .map((v) => Math.max(0, Math.min(255, Math.round(v * k))))
        .join(',') +
      ')';
    shades.set(key, value);
    return value;
  }

  function swatch(seedText, keys, face, highlight) {
    const key = [seedText, keys, face, highlight].join('|');
    if (cache.has(key)) return cache.get(key);
    const seed = seedFor(seedText);
    const cols = 114,
      rows = 48,
      cell = 3,
      margin = 6;
    const tile = document.createElement('canvas');
    tile.width = cols * cell + margin * 2;
    tile.height = rows * cell + margin * 2;
    const ctx = tile.getContext('2d');
    if (!ctx) return 'assets/jacquard.webp';
    const yarns = keys
      .filter((k) => colours[k])
      .map((k) => (highlight && k !== highlight ? '#b5aab9' : colours[k]));
    const palette = [
      yarns[0] || ink,
      ground,
      ...yarns.slice(1),
      yarns[0] || ink,
      ink,
    ];
    for (let y = 0; y < rows; y++) {
      const shift = (seed + y * 13) % 4;
      for (let x = 0; x < cols; x++) {
        const xo = face === 'back' ? cols - x - 1 : x;
        const lifted = (xo + y + (seed % 3)) % 4 < (face === 'back' ? 1 : 3);
        const colour = colourAt(xo, y, seed % 6, palette, seed % 7);
        const yarn = lifted ? colour : xo % 4 === 1 ? ground : colour;
        const left = margin + x * cell,
          top = margin + y * cell;
        const shade = 0.95 + ((x * 73 + y * 19 + seed) % 13) / 100;
        ctx.fillStyle = tone(yarn, shade);
        ctx.fillRect(left, top, cell, cell);
        ctx.fillStyle = tone(yarn, shade * 0.72);
        ctx.fillRect(left, top, lifted ? 1 : cell, lifted ? cell : 1);
        ctx.fillStyle = tone(yarn, shade * 1.1);
        ctx.fillRect(left + 1, top + 1, lifted ? 1 : 2, lifted ? 2 : 1);
        if (x === cols - 1 || x === 0) {
          ctx.fillStyle = yarn;
          ctx.fillRect(x ? left + cell : left - shift, top + 1, shift + 1, 1);
        }
        if (y === 0 || y === rows - 1) {
          ctx.fillStyle = tone(yarn, 0.91);
          const fringe = 1 + ((x * 7 + seed) % 4);
          ctx.fillRect(left + 1, y ? top + cell : top - fringe, 1, fringe);
        }
      }
    }
    const url = tile.toDataURL();
    cache.set(key, url);
    return url;
  }
  window.drawWeaves = (root) =>
    root.querySelectorAll('[data-weave]').forEach((img) => {
      img.src = swatch(
        img.dataset.weave,
        (img.dataset.yarns || '').split(','),
        img.dataset.face,
        img.dataset.highlight,
      );
    });
})();
