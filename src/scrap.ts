import puppeteer from "puppeteer";
import { getCountryCode } from "./lib/openstreetmap";

const DIR_PATH = "./public/locations/";

async function main() {
    const browser = await puppeteer.launch({
      headless: false,
    });
  
    const URL = "https://www.mapcrunch.com/";
  
    const page = await browser.newPage();
  
    await page.goto(URL);
  
    for (let i = 0; i < 10; i++) {
      const [lat, lon] = await page.evaluate(() => {
        function getLatLonFromURL(url: string) {
          url = url.split("/data")[0];
          const url_params = url.split("@")[1];
          const split = url_params.split(",");
  
          if (split.length < 2) return;
  
          const lat = Number(split[0]);
          const lon = Number(split[1]);
  
          return { lat, lon };
        }
  
        const elements = document.querySelectorAll("#container > *") as NodeListOf<HTMLDivElement>;
        for (const element of elements) {
          if (!element.id || element.id != "pano-box" ) element.style.opacity = "0";
        }

  
        const queries = [
          "[dir='ltr']",
          ".gmnoprint",
          "svg > path",
          "#social",
          "#bottom-box",
        ];
  
        for (const query of queries) {
          const elements = document.querySelectorAll(query);
          for (const element of elements) {
            element?.remove();
          }
        }
  
        const a = document.querySelector(
          'a[href*="https://maps.google.com"]'
        ) as HTMLAnchorElement;
  
        const {lat, lon} = getLatLonFromURL(a.href) as {
            lat: number;
            lon: number
        };
  
        return [lat, lon];
      });

      const country_code = await getCountryCode({
          lat, lon
      })

      const image_path = `${DIR_PATH}${country_code}_${lat}_${lon}.png`;
      
      await page.waitForTimeout(3000);
      console.log(image_path);
      
      await page.screenshot({ path: image_path });
  
      await page.click("#go-button");
      await page.waitForTimeout(300);
    }
  
    //   for (let i = 0; i < 10; i++) {
    //     await page.goto(URL);
    //     // await page.waitForTimeout(200000)
  
    //     await page.click('button[data-qa="start-game-button"]');
  
    //     const [lat, lon] = await importLocation(page);
  
    //     console.log(lat, lon);
    //     await page.waitForTimeout(1000);
    //   }
  }
  
  main();
  