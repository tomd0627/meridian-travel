'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const IMAGES = [
  // Hero (1920×1080)
  { id: 'photo-1609186796344-b9222f036f84', w: 1920, h: 1080, out: 'images/hero/hero' },

  // Destinations
  { id: 'photo-1522882018154-6055815a4515', w:  800, h:  600, out: 'images/destinations/amalfi-coast' },
  { id: 'photo-1764418365982-742441557a6c', w:  600, h:  800, out: 'images/destinations/kyoto' },
  { id: 'photo-1715356758153-6d58ae44e8fe', w:  600, h:  400, out: 'images/destinations/patagonia' },
  { id: 'photo-1539020140153-e479b8c22e70', w:  600, h:  400, out: 'images/destinations/marrakech' },
  { id: 'photo-1743664039044-34898c6bed3f', w:  600, h:  400, out: 'images/destinations/santorini' },
  { id: 'photo-1753939223042-872934ffda15', w: 1200, h:  500, out: 'images/destinations/maldives' },

  // Journey (all 800×500)
  { id: 'photo-1755308482593-f733b46e15ff', w: 800, h: 500, out: 'images/journey/day-01' },
  { id: 'photo-1759491125973-6c46d3f86c13', w: 800, h: 500, out: 'images/journey/day-02' },
  { id: 'photo-1490052048947-f6d652c8512a', w: 800, h: 500, out: 'images/journey/day-03' },
  { id: 'photo-1755151019893-de457865bd2e', w: 800, h: 500, out: 'images/journey/day-04' },
  { id: 'photo-1741851373528-4cafe13b22ac', w: 800, h: 500, out: 'images/journey/day-05' },
  { id: 'photo-1511364033374-07ffa0c99c4c', w: 800, h: 500, out: 'images/journey/day-06' },
  { id: 'photo-1753517457294-2bf4694e3760', w: 800, h: 500, out: 'images/journey/day-07' },
  { id: 'photo-1765692089840-97414f5b74fe', w: 800, h: 500, out: 'images/journey/day-08' },
  { id: 'photo-1550303435-1703d8811aaa',    w: 800, h: 500, out: 'images/journey/day-09' },
  { id: 'photo-1756227811805-51c01ee361c1', w: 800, h: 500, out: 'images/journey/day-10' },
];

function download(url, destPath, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) { reject(new Error('Too many redirects')); return; }

    const file = fs.createWriteStream(destPath);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        download(res.headers.location, destPath, redirects + 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    req.on('error', (err) => {
      file.close();
      try { fs.unlinkSync(destPath); } catch (_) {}
      reject(err);
    });
  });
}

async function run() {
  const tasks = [];

  for (const img of IMAGES) {
    for (const [fmt, q] of [['webp', 85], ['avif', 75]]) {
      const url = `https://images.unsplash.com/${img.id}?w=${img.w}&h=${img.h}&fit=crop&auto=format&q=${q}&fm=${fmt}`;
      const dest = path.join(ROOT, `${img.out}.${fmt}`);
      tasks.push({ url, dest, label: `${img.out}.${fmt}` });
    }
  }

  let done = 0;
  for (const { url, dest, label } of tasks) {
    process.stdout.write(`[${++done}/${tasks.length}] ${label} ... `);
    try {
      await download(url, dest);
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`✓ ${kb} KB`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
  }

  console.log('\nAll done.');
}

run();
