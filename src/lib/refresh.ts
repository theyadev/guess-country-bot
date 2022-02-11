import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "dotenv";
import { commands } from "../commands";

config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const commands_datas = commands.map((c) => {
  return c.command_data;
});

export async function refreshSlashCommands(GUILD_ID: string) {
  if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN) throw new Error("Erreur");

  const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands_datas,
    });
  } catch (error) {
    console.error(error);
  }
}
