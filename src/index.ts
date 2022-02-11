import locations_json from "../public/locations.json";
import { Client, Intents } from "discord.js";
import { config } from "dotenv";
import { commands } from "./commands";
import { buttons } from "./buttons";
import { refreshSlashCommands } from "./lib/refresh";
import { importLocation } from "./lib/locations";

config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  // Refresh commands on every guilds
  const guilds = await client.guilds.fetch();

  const refresh_promises: Promise<void>[] = [];

  for (const [id, guild] of guilds) {
    refresh_promises.push(refreshSlashCommands(id));
  }

  await Promise.all(refresh_promises);

  console.log("Slash commands refreshed !");

  const locations_promises: Promise<string | undefined>[] = [];
  // Import base images
  for (const location of locations_json) {
    locations_promises.push(importLocation(location));
  }

  await Promise.all(locations_promises);

  console.log("Default locations downloaded");
});

// Handle command interations
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.find(
    (e) => e.command_data.name == interaction.commandName
  );

  if (command) {
    command.execute(interaction);
  }
});

// Handle buttons interactions
client.on("interactionCreate", (interaction) => {
  if (!interaction.isButton()) return;

  const button = buttons.find(
    (e) => e.name == interaction.customId.split(":")[1]
  );

  if (button) {
    button.execute(interaction);
  }
});

client.login(DISCORD_TOKEN);
