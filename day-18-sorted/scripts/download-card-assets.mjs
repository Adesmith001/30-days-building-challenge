import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createServer } from "vite";

const outDir = join(process.cwd(), "public", "puzzles", "cards");
const attributionPath = join(outDir, "attribution.json");

const unsplash = {
  "tech-social-launch/whatsapp": ["yQTmiYLYkNs", "Eyestetix Studio"],
  "tech-social-launch/instagram": ["_tF3vug2FhQ", "Alexander Shatov"],
  "tech-social-launch/tiktok": ["gVQLAbGVB6Q", "Igor Omilaev"],
};

const generated = new Set([
  "science-body-size/moon",
  "science-body-size/mercury",
  "science-body-size/mars",
  "science-body-size/earth",
]);

const exactCommons = {
  "ng-afrobeats-albums/superstar": "Wizkid at Iyanya's album launch concert, 2013.jpg",
  "ng-afrobeats-albums/african-giant": "Afrobeats star Burna Boy performing with at Nativeland Concert, Lagos, Nigeria 2016.jpg",
  "ng-afrobeats-albums/broken-ears": "Tems Afro Plus Fest (55514652102).jpg",
  "ng-afrobeats-albums/rave": "Rema at 2019 LFW.png",
  "ng-afrobeats-songs/fall": "Davido9.jpg",
  "ng-afrobeats-songs/ye": "Burna Boy.jpg",
  "ng-afrobeats-songs/essence": "Wizkid in Canex - Algiers 2025 (cropped).jpg",
  "ng-afrobeats-songs/calm": "Rema at 2019 LFW (cropped)2.png",
};

const queryOverrides = {
  "science-sun-distance/mercury": "planet Mercury NASA",
  "science-sun-distance/venus": "planet Venus NASA",
  "science-sun-distance/earth": "planet Earth NASA",
  "science-sun-distance/mars": "planet Mars NASA",
  "science-day-length/jupiter": "planet Jupiter NASA",
  "science-day-length/saturn": "planet Saturn NASA",
  "science-day-length/earth": "Earth from space NASA",
  "science-day-length/mars": "planet Mars NASA",
  "science-orbit/mercury": "Mercury planet orbit NASA",
  "science-orbit/venus": "Venus planet orbit NASA",
  "science-orbit/earth": "Earth orbit NASA",
  "science-orbit/mars": "Mars orbit NASA",
  "science-temperature/freezer": "home freezer interior photo",
  "science-temperature/room": "living room interior photo",
  "science-temperature/body": "human body temperature thermometer photo",
  "science-temperature/boil": "boiling water pot photo",
  "world-rivers/thames": "River Thames London photo",
  "world-rivers/rhine": "Rhine river landscape photo",
  "world-rivers/danube": "Danube river landscape photo",
  "world-rivers/nile": "Nile river landscape photo",
  "world-towers/empire": "Empire State Building New York photo",
  "world-towers/cn": "CN Tower Toronto photo",
  "world-islands/singapore": "Singapore island skyline photo",
  "world-oceans/arctic": "Arctic Ocean ice photo",
  "world-oceans/southern": "Southern Ocean Antarctica photo",
  "world-oceans/indian": "Indian Ocean aerial photo",
  "world-oceans/atlantic": "Atlantic Ocean aerial photo",
  "ent-pixar/toy-story": "Toy Story characters display photo",
  "ent-pixar/nemo": "Finding Nemo character display photo",
  "ent-pixar/wall-e": "WALL-E robot display photo",
  "ent-pixar/inside-out": "Inside Out film characters display photo",
  "ent-gta/gta3": "Grand Theft Auto III game display photo",
  "ent-gta/sa": "Grand Theft Auto San Andreas game display photo",
  "ent-gta/gta4": "Grand Theft Auto IV game display photo",
  "ent-gta/gta5": "Grand Theft Auto V game display photo",
  "ent-marvel/iron-man": "Iron Man costume display photo",
  "ent-marvel/avengers": "Avengers characters display photo",
  "ent-marvel/panther": "Black Panther costume display photo",
  "ent-marvel/endgame": "Avengers Endgame characters display photo",
  "ent-harry-potter/stone": "Harry Potter Philosopher Stone display photo",
  "ent-harry-potter/azkaban": "Harry Potter Azkaban display photo",
  "ent-harry-potter/half-blood": "Harry Potter Half Blood Prince display photo",
  "ent-harry-potter/hallows2": "Harry Potter Deathly Hallows display photo",
  "ng-states-created/lagos": "Lagos Nigeria city photo",
  "ng-states-created/ogun": "Ogun State Nigeria landscape photo",
  "ng-states-created/akwa-ibom": "Akwa Ibom Nigeria photo",
  "ng-states-created/ekiti": "Ekiti State Nigeria landscape photo",
  "ng-nollywood/living": "Living in Bondage Nigerian film photo",
  "ng-nollywood/osuofia": "Osuofia in London Nigerian film photo",
  "ng-nollywood/wedding": "Wedding Party Nigerian film photo",
  "ng-nollywood/kob": "King of Boys Nigerian film photo",
  "ng-afrobeats-albums/superstar": "Wizkid musician concert photo",
  "ng-afrobeats-albums/african-giant": "Burna Boy musician concert photo",
  "ng-afrobeats-albums/broken-ears": "Tems musician concert photo",
  "ng-afrobeats-albums/rave": "Rema musician concert photo",
  "ng-afrobeats-songs/fall": "Davido musician concert photo",
  "ng-afrobeats-songs/ye": "Burna Boy live performance photo",
  "ng-afrobeats-songs/essence": "female singer concert stage photo",
  "ng-afrobeats-songs/calm": "Rema live performance photo",
  "ng-city-air-distance/ibadan": "Ibadan Nigeria city photo",
  "ng-city-air-distance/benin": "Benin City Nigeria photo",
  "ng-city-air-distance/abuja": "Abuja Nigeria skyline photo",
  "ng-city-air-distance/kano": "Kano Nigeria city photo",
  "history-inventions/telephone": "antique telephone photo",
  "history-inventions/bulb": "early incandescent light bulb photo",
  "history-inventions/airplane": "Wright Flyer airplane photo",
  "history-inventions/television": "early television set photo",
  "history-space/sputnik": "Sputnik 1 satellite photo",
  "history-space/gagarin": "Yuri Gagarin astronaut photo",
  "history-space/apollo": "Apollo 11 Moon landing photo",
  "history-space/iss": "International Space Station assembly photo",
  "sports-world-cup-first/uruguay": "Uruguay football national team photo",
  "sports-world-cup-first/italy": "Italy football national team photo",
  "sports-world-cup-first/germany": "Germany football national team photo",
  "sports-world-cup-first/brazil": "Brazil football national team photo",
  "random-sound/whisper": "person whispering photo",
  "random-sound/talk": "people conversation photo",
  "random-sound/vacuum": "vacuum cleaner photo",
  "random-sound/concert": "live music concert crowd photo",
  "random-heights/card": "credit card close up photo",
  "random-heights/phone": "smartphone close up photo",
  "random-heights/door": "full height doorway photo",
  "random-heights/hoop": "basketball hoop photo",
};

const fallbackByPuzzle = {
  "ent-pixar": "animated film cinema display",
  "ent-gta": "video game controller city",
  "ent-marvel": "superhero costume convention",
  "ent-harry-potter": "fantasy wizard film props",
  "ng-nollywood": "Nigerian cinema actor",
  "ng-afrobeats-albums": "Nigerian music concert",
  "ng-afrobeats-songs": "Afrobeats concert Nigeria",
};

const rejectTitle = /\b(logo|icon|symbol|flag|map|diagram|poster|cover|screenshot|wordmark|coat of arms|svg)\b/i;
const stripHtml = (value = "") => value.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const tokens = (value) => value.toLowerCase().split(/[^a-z0-9]+/).filter((part) => part.length > 2);

async function fetchJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "SortedGameAssetBuilder/1.0" } });
      if (response.ok) return await response.json();
      lastError = new Error(`${response.status} ${response.statusText}: ${url}`);
      if (response.status !== 429) throw lastError;
      const retryAfter = Number(response.headers.get("retry-after"));
      await new Promise((resolve) => setTimeout(
        resolve,
        Number.isFinite(retryAfter) ? retryAfter * 1_000 : 10_000 * (attempt + 1),
      ));
    } catch (error) {
      lastError = error;
    }
    if (attempt === 4) break;
    await new Promise((resolve) => setTimeout(resolve, 2_000 * (attempt + 1)));
  }
  throw lastError;
}

async function commonsCandidates(search) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: search,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: "900",
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  return Object.values(data.query?.pages ?? {})
    .map((page) => ({ page, info: page.imageinfo?.[0] }))
    .filter(({ info }) => info?.mime === "image/jpeg" && (info.thumburl || info.url));
}

async function selectCommonsPhoto(card, usedUrls) {
  const key = `${card.puzzleId}/${card.id}`;
  const mainQuery = queryOverrides[key] ?? `${card.label} photo`;
  const attempts = [mainQuery, `${card.label} photography`, fallbackByPuzzle[card.puzzleId] ?? card.description ?? card.label];

  for (const search of attempts) {
    const wanted = new Set(tokens(`${card.label} ${mainQuery}`));
    const candidates = (await commonsCandidates(search))
      .filter(({ page, info }) => !usedUrls.has(info.url) && !rejectTitle.test(page.title))
      .map((candidate) => ({
        ...candidate,
        score: tokens(candidate.page.title).filter((part) => wanted.has(part)).length,
      }))
      .sort((a, b) => b.score - a.score);
    if (candidates[0]) return { ...candidates[0], search };
  }

  throw new Error(`No usable Wikimedia Commons photo for ${key}`);
}

async function download(url, path, force = false) {
  if (!force) {
    try {
      await access(path);
      return;
    } catch {
      // Download missing files only so interrupted batches can resume cheaply.
    }
  }

  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(90_000),
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
      await writeFile(path, new Uint8Array(await response.arrayBuffer()));
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function exactCommonsPhoto(title) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    titles: `File:${title}`,
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: "900",
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url) throw new Error(`Missing exact Commons file: ${title}`);
  return { page, info };
}

async function downloadUnsplash(photoId, path) {
  try {
    await access(path);
    return;
  } catch {
    // Continue to the official download redirect for missing files.
  }

  const source = `https://unsplash.com/photos/${photoId}/download?force=true`;
  const response = await fetch(source, {
    method: "HEAD",
    redirect: "manual",
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(30_000),
  });
  const location = response.headers.get("location");
  if (!location) throw new Error(`No Unsplash download redirect for ${photoId}`);

  const imageUrl = new URL(location);
  imageUrl.searchParams.set("w", "900");
  imageUrl.searchParams.set("h", "900");
  imageUrl.searchParams.set("fit", "crop");
  imageUrl.searchParams.set("q", "82");
  imageUrl.searchParams.set("fm", "jpg");
  await download(imageUrl, path);
}

await mkdir(outDir, { recursive: true });

const server = await createServer({ server: { middlewareMode: true } });
let puzzles;
try {
  ({ puzzles } = await server.ssrLoadModule("/src/data/puzzles.ts"));
} finally {
  await server.close();
}

const cards = puzzles.flatMap((puzzle) => puzzle.items.map((item) => ({
  ...item,
  puzzleId: puzzle.id,
  description: puzzle.description,
})));
const usedUrls = new Set();
let attribution = [];
try {
  attribution = JSON.parse(await readFile(attributionPath, "utf8"));
} catch {
  // The first run starts without a checkpoint.
}
const completedKeys = new Set(attribution.map(({ key }) => key));
for (const record of attribution) {
  if (record.source?.startsWith("http")) usedUrls.add(record.source);
}

const unsplashEntries = Object.entries(unsplash);
for (let offset = 0; offset < unsplashEntries.length; offset += 4) {
  const batch = unsplashEntries.slice(offset, offset + 4);
  await Promise.all(batch.map(async ([key, [photoId]]) => {
    const filename = `${key.replace("/", "-")}.jpg`;
    const source = `https://unsplash.com/photos/${photoId}`;
    await downloadUnsplash(photoId, join(outDir, filename));
  }));

  for (const [key, [photoId, photographer]] of batch) {
    const filename = `${key.replace("/", "-")}.jpg`;
    const source = `https://unsplash.com/photos/${photoId}`;
    usedUrls.add(source);
    if (!completedKeys.has(key)) {
      attribution.push({ key, file: filename, source, photographer, provider: "Unsplash" });
      completedKeys.add(key);
    }
    console.log(`saved ${filename}`);
  }
}

for (const key of generated) {
  if (!completedKeys.has(key)) {
    attribution.push({
      key,
      file: `${key.replace("/", "-")}.png`,
      source: "Generated for this project with OpenAI ImageGen",
      provider: "OpenAI ImageGen",
    });
    completedKeys.add(key);
  }
}

for (const [key, title] of Object.entries(exactCommons)) {
  const extension = title.toLowerCase().endsWith(".png") ? "png" : "jpg";
  const file = `${key.replace("/", "-")}.${extension}`;
  const current = attribution.find((record) => record.key === key);
  if (current?.title === `File:${title}`) {
    completedKeys.add(key);
    usedUrls.add(current.source);
    continue;
  }

  const { page, info } = await exactCommonsPhoto(title);
  await download(info.thumburl || info.url, join(outDir, file), true);
  attribution = attribution.filter((record) => record.key !== key);
  attribution.push({
    key,
    file,
    source: info.descriptionurl,
    photographer: stripHtml(info.extmetadata?.Artist?.value) || "Unknown",
    license: stripHtml(info.extmetadata?.LicenseShortName?.value),
    provider: "Wikimedia Commons",
    title: page.title,
  });
  completedKeys.add(key);
  usedUrls.add(info.url);
  console.log(`refined ${file}`);
  await writeFile(attributionPath, `${JSON.stringify(attribution, null, 2)}\n`);
}
await writeFile(attributionPath, `${JSON.stringify(attribution, null, 2)}\n`);

const pending = cards.filter((card) => {
  const key = `${card.puzzleId}/${card.id}`;
  return !completedKeys.has(key);
});

for (let offset = 0; offset < pending.length; offset += 12) {
  const batch = pending.slice(offset, offset + 12);
  const selections = [];
  for (const card of batch) {
    selections.push(await selectCommonsPhoto(card, usedUrls));
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  const records = [];

  for (let index = 0; index < batch.length; index += 1) {
    const card = batch[index];
    let { page, info, search } = selections[index];
    const key = `${card.puzzleId}/${card.id}`;
    const filename = `${slug(card.puzzleId)}-${slug(card.id)}.jpg`;
    if (usedUrls.has(info.url)) {
      ({ page, info, search } = await selectCommonsPhoto(card, usedUrls));
    }
    usedUrls.add(info.url);
    records.push({
      key,
      file: filename,
      downloadUrl: info.thumburl || info.url,
      source: info.descriptionurl,
      photographer: stripHtml(info.extmetadata?.Artist?.value) || "Unknown",
      license: stripHtml(info.extmetadata?.LicenseShortName?.value),
      provider: "Wikimedia Commons",
      query: search,
      title: page.title,
    });
  }

  await Promise.all(records.map((record) =>
    download(record.downloadUrl, join(outDir, record.file)),
  ));
  for (const { downloadUrl: _downloadUrl, ...record } of records) {
    attribution.push(record);
    completedKeys.add(record.key);
    console.log(`saved ${record.file}`);
  }
  await writeFile(attributionPath, `${JSON.stringify(attribution, null, 2)}\n`);
}

await writeFile(attributionPath, `${JSON.stringify(attribution, null, 2)}\n`);
console.log(`saved ${attribution.length} source records`);
