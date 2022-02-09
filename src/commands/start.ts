import { Command } from "../type";
import { getCountries, getRandomImage } from "../scrapping";
import { getNameFromPath } from "../util";
import games from "../games";

import { MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const random_sort = () => Math.random() - 0.5;

const command_data = new SlashCommandBuilder()
  .setName(getNameFromPath(__filename))
  .setDescription("Start a game of guess the country !");

const command: Command = {
  command_data,
  async execute(interaction) {
    if (interaction.guildId === null) return;

    if (games.has(interaction.guildId)) {
      await interaction.reply("Cannot start while a game is running.");
      return;
    }

    await interaction.deferReply();

    try {
      var [image_path, image_buffer, country] = await getRandomImage(
        interaction.guildId
      );
    } catch {
      await interaction.deleteReply();
    }

    const buttons = [
      new MessageButton()
        .setCustomId(country + ":answer")
        .setLabel(country)
        .setStyle("PRIMARY"),
    ];

    const countries = getCountries().filter((c) => c != country);

    const random_sorted_countries = countries.sort(random_sort);

    for (let i = 0; i < 3; i++) {
      buttons.push(
        new MessageButton()
          .setCustomId(random_sorted_countries[i] + ":answer")
          .setLabel(random_sorted_countries[i])
          .setStyle("PRIMARY")
      );
    }

    const row = new MessageActionRow().addComponents(
      ...buttons.sort(random_sort)
    );

    games.set(interaction.guildId, {
      image_buffer,
      country: country,
      row,
    });

    await interaction.editReply({
      files: [
        {
          attachment: image_buffer,
        },
      ],
      components: [row],
    });
  },
};

export default command;
