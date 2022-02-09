import { config } from "dotenv";
import { Client, Intents } from "discord.js";
import { commands } from "./commands";
import { buttons } from "./buttons";
import { refreshSlashCommands } from "./refresh";

config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  // Refresh commands on every guilds
  const guilds = await client.guilds.fetch();

  for (const [id, guild] of guilds) {
    refreshSlashCommands(id);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.find((e) => e.command_data.name == interaction.commandName);

  if (command) {
    command.execute(interaction);
  }
});

/**
 * Handle buttons
 * For this to work you need to set the button name to : `data:buttonName`
 */
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
    
  const button = buttons.find((e) => e.name == interaction.customId.split(":")[1]);

  if (button) {
    button.execute(interaction);
  }
});

client.login(DISCORD_TOKEN);
