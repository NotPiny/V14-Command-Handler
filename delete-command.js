const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
})

function deleteCommand(id) {
    return client.application?.commands?.delete(id)
}
const ids = [
    '1023598919101468793',
    '1023594898521341983'
]
ids.forEach(id => {
    try {
    deleteCommand(id)
    } catch(err) {
        console.log(err)
    }
})