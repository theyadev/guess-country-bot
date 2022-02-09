import type { Command } from "../type";
import type { Location } from "../type";
import { getNameFromPath } from "../util";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getCountryCode, updateLocations } from "../scrapping";

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

    const country_code = await getCountryCode(url);

    if (!country_code || country_code === null) {
      await interaction.reply({
        content: "Lien invalide (CC)",
        ephemeral: true,
      });

      return;
    }

    updateLocations({
      url,
      country: country_code,
    });

    await interaction.reply("Correctement ajouté !");
  },
};

export default command;
