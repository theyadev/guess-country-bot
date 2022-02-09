import { Command } from "../type";
import { getNameFromPath } from "../util";
import games from "../games";
import { SlashCommandBuilder } from "@discordjs/builders";

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
      files: [
        {
          attachment: game.image_buffer,
        },
      ],
      ephemeral: true,
    });
  },
};

export default command;
