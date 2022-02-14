import end from "../buttons/end";
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
  already_played: Location[];
  current: number;
  score: number;
}

const games: Map<string, Game> = new Map();

export default games;

function createButton(country_code: string) {
  return new MessageButton()
    .setCustomId(country_code + ":answer")
    .setLabel(country_code)
    .setStyle("PRIMARY");
}

function createCountriesRow(correct_country: string) {
  const random_countries = getCountries()
    .filter((c) => c != correct_country)
    .sort(random_sort)
    .splice(0, 3);

  const countries = [...random_countries, correct_country];

  const buttons: MessageButton[] = countries.map((c) => createButton(c));

  return new MessageActionRow().addComponents(...buttons.sort(random_sort));
}

export function createStopGameRow(game_id: string) {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(game_id + ":end")
      .setLabel("End Game")
      .setStyle("SECONDARY")
  );
}

export async function sendImage(
  interaction: CommandInteraction | ButtonInteraction,
  ephemeral: boolean = false
) {
  if (!interaction.member?.user.id) return;

  if (!interaction.replied) {
    await interaction.deferReply({
      ephemeral,
    });
  }

  const game_id = interaction.member?.user.id;

  let game: Game = games.get(game_id) || {
    started_at: new Date(),
    country: "",
    image_path: "",
    row: new MessageActionRow(),
    already_played: [],
    current: 0,
    score: 0,
  };

  const location = await getRandomLocation(game.already_played);

  if (!location) {
    await interaction.editReply(
      "There's no more maps left, you can now end the game !"
    );

    return;
  }

  const row = createCountriesRow(location.country_code);

  game.row = row;
  game.country = location.country_code;
  game.image_path = location.path;
  game.already_played.push(location);
  game.current++;

  games.set(game_id, game);

  const time_elapsed_in_ms = game.started_at.getTime() - new Date().getTime();
  const time_elapsed_in_s = Math.abs(time_elapsed_in_ms / 1000);
  const time_elapsed_in_mins = Math.floor(time_elapsed_in_s / 60);

  await interaction.editReply({
    content: `You can still play on this game for ${
      15 - time_elapsed_in_mins
    } minutes !`,
    files: [location.path],
    components: [row, createStopGameRow(game_id)],
  });
}
