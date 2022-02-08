import { Command } from "../type";
import { getNameFromPath } from "../util";

const command: Command = {
  name: getNameFromPath(__filename),
  description: "Replies with Pong!",
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default command;
