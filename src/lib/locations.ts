import puppeteer from "puppeteer";
import { Location } from "../types";
import { readdirSync, mkdirSync } from "fs";
import { getLatLonFromURL } from "../util";
import { getCountryCode } from "./openstreetmap";

const DIR_PATH = "./public/locations/";

export let locations = readLocations(DIR_PATH);

function readLocations(path: string) {
  let location_files: string[];

  try {
    location_files = readdirSync(path);
  } catch {
    mkdirSync(path, { recursive: true })
    return [];
  }

  const locations = location_files.map((l) => {
    const [country_code, lat, lon] = l.replace(".png", "").split("_");

    return new Location(path + l, country_code, Number(lat), Number(lon));
  });

  return locations;
}

export async function getRandomLocation() {
  const location = locations[Math.floor(Math.random() * locations.length)];

  return [location.path, location.country_code];
}

export async function importLocation(
  url: string,
  force: boolean = false
): Promise<string | undefined> {
  const geoloc = getLatLonFromURL(url);

  if (!geoloc) return;

  const { lat, lon } = geoloc;

  if (locations.some((l) => l.latitude === lat && l.longitude === lon)) return;

  const country_code = await getCountryCode({
    lat,
    lon,
  });

  if (!country_code) return;

  const image_path = `./public/locations/${country_code}_${lat}_${lon}.png`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.click('button[jsname="higCR"]');
  await page.waitForNavigation();
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const queries = [
      "#minimap",
      ".app-viewcard-strip",
      "#image-header",
      "#titlecard",
      ".scene-footer-container",
    ];

    for (const query of queries) {
      const element = document.querySelector(query);
      element?.remove();
    }
  });

  await page.screenshot({ path: image_path });

  await browser.close();

  locations.push(new Location(image_path, country_code, lat, lon));

  return image_path;
}

export function getCountries() {
  const countries: string[] = [];

  for (const location of locations) {
    if (countries.includes(location.country_code)) continue;

    countries.push(location.country_code);
  }

  return countries;
}
