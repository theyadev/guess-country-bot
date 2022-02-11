import games from "../lib/games";
import type { Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getNameFromPath } from "../util";

const command_data = new SlashCommandBuilder()
  .setName(getNameFromPath(__filename))
  .setDescription("Show the image of the current game !");

const command: Command = {
  command_data,
  async execute(interaction) {
    if (interaction.guildId === null) return;

    const game = games.get(interaction.guildId);

    if (!game) return;

    await interaction.reply({
      files: [game.image_path],
      ephemeral: true,
    });
  },
};

export default command;
