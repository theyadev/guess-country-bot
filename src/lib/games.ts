import type { MessageActionRow } from "discord.js";

interface Game {
  image_path: string;
  country: string;
  row: MessageActionRow;
}

const games: Map<string, Game> = new Map();

export default games;
