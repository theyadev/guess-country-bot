import axios from "axios";
import { getLatLonFromURL } from "../util";

interface BasicOptions {
  url: string;
}

interface LatLonOptions {
  lat: number;
  lon: number;
}

export async function getCountryCode(
  options: BasicOptions | LatLonOptions
): Promise<string | undefined> {
  let lat: number = 0;
  let lon: number = 0;

  if ((options as BasicOptions).url) {
    const geoloc = getLatLonFromURL((options as BasicOptions).url);

    if (!geoloc) return;

    ({ lat, lon } = geoloc);
  } else {
    ({ lat, lon } = options as LatLonOptions);
  }

  const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
    params: {
      lat,
      lon,
      format: "json",
      addressdetails: 1,
    },
  });

  if (!res.data?.address) return;

  const country_code = res.data.address.country_code;

  if (!country_code) return;

  return country_code;
}
