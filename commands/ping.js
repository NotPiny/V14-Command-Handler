module.exports = {
    name: 'ping',
    description: 'Pong!',
    testOnly: false,
    autoUpdate: false,

    callback: async (interaction) => {
        return 'Pong!';
    }
}