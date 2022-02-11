import type { Command } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getNameFromPath } from "../util";
import { importLocation } from "../lib/locations";

const command_data = new SlashCommandBuilder()
  .setName(getNameFromPath(__filename))
  .setDescription("Ajoute un endroit a la base de données")
  .addStringOption((option) =>
    option
      .setName("url")
      .setDescription("Ajoute un endroit a la base de données")
      .setRequired(true)
  );

const command: Command = {
  command_data,
  async execute(interaction) {
    const url = interaction.options.getString("url")?.toLowerCase();

    if (!url || !url.startsWith("https://www.google.com/maps/")) {
      await interaction.reply({
        content: "Lien invalide (LI)",
        ephemeral: true,
      });

      return;
    }

    interaction.deferReply();

    const imported = await importLocation(url);

    if (!imported) {
      await interaction.reply({
        content: "Error while adding the location !",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: "Location added !",
      ephemeral: true,
    });
  },
};

export default command;
