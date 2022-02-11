import { sep } from "path";
import { readdirSync } from "fs";

export function getNameFromPath(filename: string) {
  return filename.slice(filename.lastIndexOf(sep) + 1, -3);
}

export function fetchFiles<T>(DIRECTORY_PATH: string) {
  let file_names = readdirSync(DIRECTORY_PATH);

  // Remove index.*
  file_names = file_names.filter(
    (file_name) => file_name.split(".")[0] != "index"
  );

  // Add every files default to a list
  const files: T[] = [];

  for (const file_name of file_names) {
    const file_path = DIRECTORY_PATH + "/" + file_name;
    const file: T = require(file_path).default;

    files.push(file);
  }

  return files
}

export function getLatLonFromURL(url: string) {
  url = url.split("/data")[0];
  const url_params = url.split("@")[1];
  const split = url_params.split(",");

  if (split.length < 2) return;

  const lat = Number(split[0]);
  const lon = Number(split[1]);

  return { lat, lon };
}

