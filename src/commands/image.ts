import { Command } from "../type";
import { getNameFromPath } from "../util";
import games from "../games";

const command: Command = {
  name: getNameFromPath(__filename),
  description: "Show the image of the current game !",
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
