import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "dotenv";
import { getCommandsForRefresh } from "./commands";

config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const commands = getCommandsForRefresh();

export async function refreshSlashCommands(GUILD_ID: string) {
  if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN) throw new Error("Erreur");

  const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
