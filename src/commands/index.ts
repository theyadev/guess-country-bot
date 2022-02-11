import type { Command } from "../types";
import { resolve } from "path";
import { fetchFiles } from "../util";

const DIRECTORY_PATH = resolve(__dirname, "./");

export const commands = fetchFiles<Command>(DIRECTORY_PATH);
