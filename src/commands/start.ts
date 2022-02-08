import { Command } from "../type";
import { getCountries, getRandomImage } from "../scrapping";
import { getNameFromPath } from "../util";
import games from "../games";

import { MessageActionRow, MessageButton } from "discord.js";

const command: Command = {
  name: getNameFromPath(__filename),
  description: "Start a game of guess the country !",
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

    // TODO: Random buttons order
    const countries = getCountries()
    const random_country = countries[Math.floor(Math.random() * countries.length)]
    const buttons = [
      new MessageButton()
      .setCustomId(country + ":answer")
      .setLabel(country)
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(random_country + ":answer")
      .setLabel(random_country)
      .setStyle("PRIMARY")
    ].sort(() => {
      return Math.random() - 0.5
    })

    const row = new MessageActionRow().addComponents(
      ...buttons
    );

    games.set(interaction.guildId, {
      image_buffer,
      country: country,
      row
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
