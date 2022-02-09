import { Command } from "../type";
import { getNameFromPath } from "../util";
import { SlashCommandBuilder } from "@discordjs/builders";

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
