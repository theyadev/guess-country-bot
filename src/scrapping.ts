import type { Location } from "./type";

import puppeteer from "puppeteer";
import NodeGeocoder, { OpenStreetMapOptions } from "node-geocoder";

import { writeFileSync, readFileSync } from "fs";

export let locations = readLocations();

function readLocations() {
  const locations = JSON.parse(
    readFileSync("./src/locations.json", { encoding: "utf-8" })
  ) as Location[];

  return locations;
}

const options: OpenStreetMapOptions = {
  provider: "openstreetmap",
};

const geocoder = NodeGeocoder(options);

export async function getCountryCode(
  url: string
): Promise<string | null | undefined> {
  url = url.split("/data")[0];
  const url_params = url.split("@")[1];
  const split = url_params.split(",");

  if (split.length < 2) return null;

  const lat = Number(split[0]);
  const lon = Number(split[1]);

  const res = await geocoder.reverse({
    lat,
    lon,
  });
  if (res.length === 0) return null;

  return res[0].countryCode;
}

export async function getRandomImage(
  guild_id: string
): Promise<[string, string | Buffer, string]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const location = locations[Math.floor(Math.random() * locations.length)];

  await page.goto(location.url);
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

  const image_path = `game_${guild_id}.png`;
  const image_buffer = await page.screenshot({ path: image_path });

  await browser.close();

  return [image_path, image_buffer, location.country];
}

export function getCountries() {
  return locations.map((l) => {
    return l.country;
  });
}

export function updateLocations(location: Location) {
  locations.push(location);

  writeFileSync("./src/locations.json", JSON.stringify(locations), {
    encoding: "utf-8",
  });
}
