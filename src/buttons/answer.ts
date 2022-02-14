import games, { createStopGameRow, sendImage } from "../lib/games";
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
    if (!interaction.member?.user.id) return;

    const game = games.get(interaction.member?.user.id);

    if (!game) return;

    let style: MessageButtonStyleResolvable = "DANGER";

    const answer = interaction.customId.split(":")[0];

    if (answer == game.country) {
      style = "SUCCESS";

      game.score++;
    }

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
      components: [row, createStopGameRow(interaction.member?.user.id)],
    });

    await sendImage(interaction, true);
  },
};

export default button;
