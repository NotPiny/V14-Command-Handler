// Load required stuff
const { Client, GatewayIntentBits, PermissionsBitField, ApplicationCommandPermissionType } = require('discord.js');
require('dotenv/config');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/');
const config = require('./config.json')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on('ready', () => {
  console.log('Load > Bot loaded');

  // Grab info from config.json
  const commands = client.application?.commands;
  const testServer = client.guilds.cache.get(config.testServer)

  commandFiles.forEach(file => {
    // Load command details from file
    const commandName = file.replace(/.js/, '').toLowerCase();
    if (commandName == 'command.template') return;
    const commandDescription = require(`./commands/${file}`).description;
    const commandOptions = require(`./commands/${file}`).options;

    // Check if the command exists already
    if (!fs.readFileSync('./commands.list').toString().includes(commandName)) {
      if (require(`./commands/${file}`).testOnly == true) {
        testServer?.commands?.create({
          name: commandName,
          description: commandDescription,
          options: commandOptions,
        })
        .then(() => {
          console.log(`Commands > Created / Updated test command "${commandName}"`);
        })
        .catch(() => { console.log(`Failed to create test command "${commandName}"`); });
      } else {
          commands?.create({
            name: commandName,
            description: commandDescription,
            options: commandOptions
          })
          .then(() => {
            console.log(`Commands > Created command "${commandName}"`);
            fs.appendFileSync('./commands.list', `\n${commandName}`);
          })
          .catch(() => { console.log(`Failed to create command "${commandName}"`); });
      }
    } else {
      if (require(`./commands/${commandName}.js`).autoUpdate == true) {
        commands?.create({
          name: commandName,
          description: commandDescription,
          options: commandOptions
        })
        .then(() => {
          console.log(`Sent request to discord to update command "${commandName}"`)
        })
        .catch(() => {
          console.log(`Something went wrong updating "${commandName}"`)
        })
      }
    }
  })
})

client.on('interactionCreate', interaction => {
  const { commandName, options } = interaction;

  if (interaction.isCommand) {
    // Check if it is a valid command
      if (fs.existsSync(`./commands/${commandName}.js`)) {
        if (require(`./commands/${commandName}.js`).ownerOnly == true) {
          if (config.botOwners.includes(interaction.user.id)) {
            console.log('Owner check passed.')
          } else {
            console.log('Owner check failed.')
            return interaction.reply('Error: You need to be a bot owner to run this command.');
          }
        }
        // Execute the command
        const response = require(`./commands/${commandName}.js`).callback(interaction);
        if (response) {
          interaction.reply(response);
        }
      } else {
        interaction.reply({
          content: 'Error:\n```\nInvalid Command!\n```',
          ephemeral: true
        });
      }
  }
})
// Log into the bot
client.login(process.env.TOKEN)