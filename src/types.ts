import type { ButtonInteraction, CommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";

export class Location {
  path: string;
  country_code: string;
  latitude: number;
  longitude: number;

  constructor(path: string, country_code: string, lat: number, lon: number) {
    this.path = path;
    this.country_code = country_code;
    this.latitude = lat;
    this.longitude = lon;
  }
}
export interface Button {
  name: string;
  execute: (interaction: ButtonInteraction) => void;
}

export interface Command {
  command_data: Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  >;
  execute: (interaction: CommandInteraction) => void;
}
