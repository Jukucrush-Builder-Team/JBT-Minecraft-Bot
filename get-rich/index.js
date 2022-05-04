const mineflayer = require('mineflayer');
const bot = mineflayer.createBot(require('./config.json').minecraft);

let boardOwner = []

bot.once('spawn', () => {
    // init boardOwner
    for (let i = 0; i < 28; i++) {
        boardOwner = [...boardOwner, {owned: false, owner: ''}]
    }

    console.log('Ready!')
})

bot.on('physicTick', () => {
    const playerFilter = (entity) => entity.type === 'player'
    const playerEntity = bot.nearestEntity(playerFilter)
    
    if (!playerEntity) return
    
    const pos = playerEntity.position.offset(0, playerEntity.height, 0)
    bot.lookAt(pos)
})

bot.on('chat', async (username, message) => {
    if (username === bot.username) return

    const messageArray = message.split(' ');
    const cmd = messageArray[0];
    const args = messageArray.slice(1);

    switch (cmd) {
        case 'playerhead':
            bot.chat(`/give ${username} minecraft:player_head{SkullOwner:${args[0]}}`);
        break;
        case 'randomteam':
            bot.chat('/setblock 241 63 -139 minecraft:redstone_block');
            bot.chat('/clear @a minecraft:tnt');
            const shuffle = (array) => {
                let currentIndex = array.length, randomIndex;

                // While there remain elements to shuffle...
                while (currentIndex != 0) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;

                    // And swap it with the current element.
                    [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
                }

                return array;
            }

            bot.chat('/gamerule sendCommandFeedback false');
            playerTeamData = {
                RED_TEAM: {
                    players: [],
                    boardPosition : 0,
                    money: 10000,
                    isJail: false,
                    howLongSinceJail: 0
                },
                GREEN_TEAM: {
                    players: [],
                    boardPosition : 0,
                    money: 10000,
                    isJail: false,
                    howLongSinceJail: 0
                },
                BLUE_TEAM: {
                    players: [],
                    boardPosition : 0,
                    money: 10000,
                    isJail: false,
                    howLongSinceJail: 0
                },
                YELLOW_TEAM: {
                    players: [],
                    boardPosition : 0,
                    money: 10000,
                    isJail: false,
                    howLongSinceJail: 0
                },
            }
            
            let player = Object.keys(bot.players);
            const index = player.indexOf("Jukkyjung");

            if (index > -1) 
                player.splice(index, 1);

            let shuffledPlayer = shuffle(player);

            for (let i in shuffledPlayer) {
                switch (i % 4) {
                    case 0:
                        bot.chat(`/team join RED_TEAM ${player[i]}`);
                        playerTeamData.RED_TEAM.players = [...playerTeamData.RED_TEAM.players, player[i]];
                        break
                    case 1:
                        bot.chat(`/team join GREEN_TEAM ${player[i]}`);
                        playerTeamData.GREEN_TEAM.players = [...playerTeamData.GREEN_TEAM.players, player[i]];
                        break		
                    case 2:
                        bot.chat(`/team join BLUE_TEAM ${player[i]}`);
                        playerTeamData.BLUE_TEAM.players = [...playerTeamData.BLUE_TEAM.players, player[i]];
                        break
                    case 3:
                        bot.chat(`/team join YELLOW_TEAM ${player[i]}`);
                        playerTeamData.YELLOW_TEAM.players = [...playerTeamData.YELLOW_TEAM.players, player[i]];
                        break
                }
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            turn = 0;

            for (let i of Object.keys(playerTeamData))
                bot.chat(`/scoreboard players set ${i} Money ${playerTeamData[i].money}`);

            bot.chat(`/give @r[team=RED_TEAM] tnt{display:{Name:'[{"text":"Dice","italic":false}]',Lore:['[{"text":"Make by JBT","italic":false}]']},Enchantments:[{}]}`);
            bot.chat('/gamerule sendCommandFeedback true');
            break;
        case 'playsong':
            bot.chat('/gamerule sendCommandFeedback false');

            let note = {
                Gb1: 2**(-12/12),
                G1: 2**(-11/12),
                Ab1: 2**(-10/12),
                A1: 2**(-9/12),
                Bb1: 2**(8/12),
                B1: 2**(-7/12),
                C1: 2**(-6/12),
                Db1: 2**(-5/12),
                D1: 2**(-4/12),
                Eb1: 2**(-3/12),
                E1: 2**(-2/12),
                F1: 2**(-1/12),
                Gb2: 2**(0/12),
                G2: 2**(1/12),
                Ab2: 2**(2/12),
                A2: 2**(3/12),
                Bb2: 2**(4/12),
                B2: 2**(5/12),
                C2: 2**(6/12),
                Db2: 2**(7/12),
                D2: 2**(8/12),
                Eb2: 2**(9/12),
                E2: 2**(10/12),
                F2: 2**(11/12),
                G3: 2**(12/12),
            }

            let songNote = [
                // We Wish You A Merry Christmas
                {
                    note: [
                        note.D1, note.G2, note.G2, note.A2, note.G2, note.Gb2, note.E1, note.E1, note.E1, note.A2, note.A2, note.B2, note.A2, note.G2, note.Gb2, note.D1,
                        note.D1, note.B2, note.B2, note.C2, note.B2, note.A2, note.G2, note.E1, note.D1, note.D1, note.E1, note.A2, note.Gb2, note.G2
                    ],
                    time_value: [
                        // 400 is Quarter Note that mean 200 is Eighth Note
                        400, 400, 200, 200, 200, 200, 400, 400, 400, 400, 200, 200, 200, 200, 400, 400,
                        400, 400, 200, 200, 200, 200, 400, 400, 200, 200, 400, 400, 400, 800
                    ]
                },
                // coffin dance
                {
                    note: [
                        note.G2, note.G2, note.G2, note.G2, note.G2, note.G2, note.G2, note.G2, 
                        note.G2, note.G2, note.G2, note.G2, note.G2, note.G2, note.G2, note.G2, 
                    ],
                    time_value: [
                        400, 400, 400, 400, 400, 400, 400, 400, 
                        400, 400, 400, 400, 400, 400, 400, 400, 
                        400, 400, 400, 400, 400, 400, 400, 400, 
                        400, 400, 400, 400, 400, 400, 400, 400, 
                        400, 400, 400, 400, 400, 400, 400, 400, 
                        400, 400, 400, 400, 400, 400, 400, 400, 
                    ]
                }
            ]

            if (songNote[0].note.length != songNote[0].time_value.length) {
                console.log(`note has ${songNote[0].note.length} but time_value has ${songNote[0].time_value.length}`)
                return;
            }

            for (let i = 0; i < songNote[0].note.length; i++) {
                bot.chat(`/execute at @a as @s run playsound minecraft:block.note_block.harp master @p ~ ~ ~ 2 ${songNote[0].note[i]}`)
                
                await new Promise(resolve => setTimeout(resolve, songNote[0].time_value[i]));
            }
            
            bot.chat('/gamerule sendCommandFeedback true')
            break;
    }
})

// discord bot
const { Client, Intents } = require('discord.js');
const client = new Client({
    partials: [
        "CHANNEL"
    ],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
});

client.on('ready', () => {
    console.log('discord: ready!');
});

client.on('messageCreate', (message) => {
    
});

client.login(require('./config.json').discord.token);

