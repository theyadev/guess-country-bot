import puppeteer from "puppeteer";

const locations = [
  {
    country: "Japon",
    url: "https://www.google.com/maps/@35.7202866,139.8264018,3a,90y,352.16h,81.68t/data=!3m8!1e1!3m6!1sAF1QipOO7HAaxXeVdmWPCFzSbpqQVNAOFlMM9i5imd2k!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOO7HAaxXeVdmWPCFzSbpqQVNAOFlMM9i5imd2k%3Dw203-h100-k-no-pi-11.25402-ya13.090196-ro-0-fo100!7i10240!8i5120",
  },
  {
    country: "France",
    url: "https://www.google.com/maps/@48.4383729,0.1065265,3a,73.7y,234.85h,86.32t/data=!3m6!1e1!3m4!1saN074evHpR0PV0QDM47bRg!2e0!7i13312!8i6656",
  },
  {
    country: "Pologne",
    url: "https://www.google.com/maps/@52.2320358,21.0073481,3a,75y,249.31h,115.93t/data=!3m8!1e1!3m6!1sAF1QipM_92xK5q6vVrTLSW8Dfmd7lFFNC4JsJt-Zues!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipM_92xK5q6vVrTLSW8Dfmd7lFFNC4JsJt-Zues%3Dw203-h100-k-no-pi-30.000002-ya191.45778-ro0-fo100!7i10000!8i5000",
  },
  {
    country: "Roumanie",
    url: "https://www.google.com/maps/@45.582272,24.5726002,3a,75y,130.66h,89.68t/data=!3m8!1e1!3m6!1sAF1QipPHts2kspITEm7t3pi9YzUGyn2a3wFvr-Ln9Zig!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPHts2kspITEm7t3pi9YzUGyn2a3wFvr-Ln9Zig%3Dw203-h100-k-no-pi0.370118-ya177.0911-ro0.10320199-fo100!7i9600!8i4800",
  },
  {
    country: "Norvège",
    url: "https://www.google.com/maps/@63.1079337,18.5010521,3a,75y,27.45h,109.46t/data=!3m8!1e1!3m6!1sAF1QipMJR4eqUx0aVLUwRdMqwE3YRs5NNaqtsvyBvFe_!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMJR4eqUx0aVLUwRdMqwE3YRs5NNaqtsvyBvFe_%3Dw203-h100-k-no-pi-10-ya324.24454-ro-0-fo100!7i6000!8i3000"
  }
];

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
  return locations.map(l => {
    return l.country
  })
}
