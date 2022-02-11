import type { Button } from "../types";
import { resolve } from "path";
import { fetchFiles } from "../util";

const DIRECTORY_PATH = resolve(__dirname, "./");

export const buttons = fetchFiles<Button>(DIRECTORY_PATH);
