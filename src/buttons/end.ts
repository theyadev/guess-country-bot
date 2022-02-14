import games from "../lib/games";
import type { Button } from "../types";
import { getNameFromPath } from "../util";

const button: Button = {
  name: getNameFromPath(__filename),
  async execute(interaction) {
    const game_id = interaction.customId.split(":")[0];
    const game = games.get(game_id);

    if (!game) return;

    await interaction.reply({
      content: `${interaction.member?.user.username} a terminé une partie avec ${game.score} points sur ${game.current} !!`,
    });

    games.delete(game_id);
  },
};

export default button;
