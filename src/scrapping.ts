import puppeteer from "puppeteer";
import NodeGeocoder, { OpenStreetMapOptions } from "node-geocoder";
import { Location } from "./type";
import { writeFileSync, readdirSync } from "fs";

const DIR_PATH = "./public/locations/";

export let locations = readLocations();

function readLocations() {
  const location_files = readdirSync(DIR_PATH);

  const locations = location_files.map((l) => {
    const [country_code, lat, lon] = l.replace(".png", "").split("_");

    return new Location(DIR_PATH + l, country_code, Number(lat), Number(lon));
  });

  return locations;
}

const options: OpenStreetMapOptions = {
  provider: "openstreetmap",
};

const geocoder = NodeGeocoder(options);

function getLatLonFromURL(url: string) {
  url = url.split("/data")[0];
  const url_params = url.split("@")[1];
  const split = url_params.split(",");

  if (split.length < 2) throw new Error("URL invalid.");

  const lat = Number(split[0]);
  const lon = Number(split[1]);

  return { lat, lon };
}

interface BasicOptions {
  url: string;
}

interface LatLonOptions {
  lat: number;
  lon: number;
}

export async function getRandomImage() {
  const location = locations[Math.floor(Math.random() * locations.length)];

  return [location.path, location.country_code];
}

export async function getCountryCode(
  options: BasicOptions | LatLonOptions
): Promise<string | null> {
  try {
    if ((options as BasicOptions).url) {
      var { lat, lon } = getLatLonFromURL((options as BasicOptions).url);
    } else {
      var { lat, lon } = options as LatLonOptions;
    }

    const res = await geocoder.reverse({
      lat,
      lon,
    });

    if (res.length === 0 || !res[0].countryCode) return null;

    return res[0].countryCode;
  } catch (error) {
    return null;
  }
}

export async function importImage(
  url: string,
  force: boolean = false
): Promise<null | string> {
  try {
    var { lat, lon } = getLatLonFromURL(url);
  } catch (error) {
    return null;
  }

  const country_code = await getCountryCode({
    lat,
    lon,
  });

  if (country_code === null) return null;

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
