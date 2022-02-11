import { sendImage } from "../lib/games";
import type { Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getNameFromPath } from "../util";

const command_data = new SlashCommandBuilder()
  .setName(getNameFromPath(__filename))
  .setDescription("Start a game of guess the country !");

const command: Command = {
  command_data,
  async execute(interaction) {
    await sendImage(interaction, true);
  },
};

export default command;
