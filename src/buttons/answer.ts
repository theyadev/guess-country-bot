import games, { sendImage } from "../lib/games";
import type { Button } from "../types";
import {
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
} from "discord.js";
import { getNameFromPath } from "../util";

const button: Button = {
  name: getNameFromPath(__filename),
  async execute(interaction) {
    if (interaction.guildId === null) return;

    const game = games.get(interaction.guildId);

    if (!game) {
      console.log("Pourquoi ?");

      return;
    }

    let style: MessageButtonStyleResolvable = "DANGER";

    const answer = interaction.customId.split(":")[0];

    if (answer == game.country) style = "SUCCESS";

    const row = new MessageActionRow();
    const components = [];

    for (const component of game.row.components) {
      if (!component.customId) continue;
      components.push(
        new MessageButton()
          .setCustomId(component.customId)
          .setLabel(component.customId.split(":")[0])
          .setStyle(
            component.customId === interaction.customId ? style : "PRIMARY"
          )
      );
    }

    row.addComponents(...components);

    await interaction.update({
      components: [row],
    });

    await sendImage(interaction, true)
  },
};

export default button;
