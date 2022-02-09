import type { ButtonInteraction, CommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";

export interface Location {
  url: string;
  country: string;
}
export interface Button {
  name: string;
  execute: (interaction: ButtonInteraction) => void;
}

export interface Command {
  command_data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: CommandInteraction) => void;
}
