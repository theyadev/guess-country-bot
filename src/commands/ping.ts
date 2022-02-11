import type { Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getNameFromPath } from "../util";

const command_data = new SlashCommandBuilder()
  .setName(getNameFromPath(__filename))
  .setDescription("Replies with Pong!");

const command: Command = {
  command_data,
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default command;
