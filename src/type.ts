import type { ButtonInteraction, CommandInteraction } from "discord.js";

export interface Button {
  name: string;
  execute: (interaction: ButtonInteraction) => void;
}

export interface Command extends Omit<Button, 'execute'> {
  description: string | null;
  execute: (interaction: CommandInteraction) => void;
}
