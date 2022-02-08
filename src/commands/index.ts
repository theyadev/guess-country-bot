import { resolve } from "path";
import { Command } from "../type";
import { fetchFiles } from "../util";

const DIRECTORY_PATH = resolve(__dirname, "./");

export const commands = fetchFiles<Command>(DIRECTORY_PATH)

/**
 * @returns list of command formatted for refreshing guild commands
 */
export function getCommandsForRefresh() {
  const refresh_commands = commands.map((command) => {
    return {
      name: command.name,
      description: command.description,
    };
  });

  return refresh_commands;
}