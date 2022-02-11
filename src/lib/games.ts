import { ButtonInteraction, CommandInteraction } from "discord.js";
import { MessageButton, MessageActionRow } from "discord.js";
import type { Location } from "../types";
import { random_sort } from "../util";

import { getCountries, getRandomLocation } from "./locations";

interface Game {
  image_path: string;
  country: string;
  row: MessageActionRow;
  started_at: Date;
}

const games: Map<string, Game> = new Map();

export default games;

function createButton(country_code: string) {
  return new MessageButton()
    .setCustomId(country_code + ":answer")
    .setLabel(country_code)
    .setStyle("PRIMARY");
}

function createRow(correct_country: string) {
  const random_countries = getCountries()
    .filter((c) => c != correct_country)
    .sort(random_sort)
    .splice(0, 3);

  const countries = [...random_countries, correct_country];

  const buttons: MessageButton[] = countries.map((c) => createButton(c));

  return new MessageActionRow().addComponents(...buttons.sort(random_sort));
}

function canSendImage(
  interaction: CommandInteraction | ButtonInteraction
): boolean {
  if (interaction.guildId === null) return false;

  if (games.has(interaction.guildId)) {
    // await interaction.reply("Cannot start while a game is running.");
    return false;
  }

  return true;
}

export async function sendImage(
  interaction: CommandInteraction | ButtonInteraction,
  ephemeral: boolean = false
) {
  if (interaction.guildId === null) return;

  // if (!canSendImage(interaction)) return;

  if (!interaction.replied) {
    await interaction.deferReply({
      ephemeral,
    });
  }

  const location = await getRandomLocation();

  const row = createRow(location.country_code);

  let game: Game = games.get(interaction.guildId) || {
    started_at: new Date(),
    country: "",
    image_path: "",
    row,
  };

  game.row = row;
  game.country = location.country_code;
  game.image_path = location.path;

  games.set(interaction.guildId, game);

  console.log(
    (game.started_at.getTime() - new Date().getTime()) / 1000 + "secondes"
  );

  await interaction.editReply({
    files: [location.path],
    components: [row],
  });
}
