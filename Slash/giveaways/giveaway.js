const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messagess = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const messages = require("../../settings/messages.js")
const ms = require('ms');

module.exports = {
    name: "giveaway",
    description: "Giveaway Commands.",
    permissions: "MANAGE_MESSAGES",
    options: [
        {
            name: "start",
            description: "Start a giveaway.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'channel',
                    description: 'Giveaway Channel',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                    required: true
                },
                {
                    name: 'duration',
                    type: 'STRING',
                    description: 'Giveaway Duration',
                    required: true
                },
                {
                    name: 'winners',
                    type: 'INTEGER',
                    description: 'Giveaway Winners',
                    required: true
                },
                {
                    name: 'prize',
                    type: 'STRING',
                    description: 'Giveaway Prize',
                    required: true
                },
        
            ],
        },
        {
            name: "reroll",
            description: "Giveaway reroll.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'giveaway',
                    description: 'Giveaway ID OR PRIZE',
                    type: 'STRING',
                    required: true
                }
            ],
        },
        {
            name: "end",
            description: "Giveaway End.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'giveaway',
                    description: 'Giveaway ID OR PRIZE',
                    type: 'STRING',
                    required: true
                }
         
        
            ],
        },
        {
            name: "pause",
            description: "Giveaway pause.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'giveaway',
                    description: 'Giveaway ID OR PRIZE',
                    type: 'STRING',
                    required: true
                }
            ],
        },
        {
            name: "continue",
            description: "Giveaway continue.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'giveaway',
                    description: 'Giveaway ID OR PRIZE',
                    type: 'STRING',
                    required: true
                }
            ],
        },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${messagess.NO_PERMSUSER}`, ephemeral: true})
        }
        

        const { options } = interaction;

        const Sub = options.getSubcommand(["start", "reroll", "end", "pause", "continue"]);


        if (Sub === 'start') {
    
            if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
                return interaction.reply({
                    content: ':x: Necesitas el rol Giveaways para poder crear sorteos.',
                    ephemeral: true
                });
            }
        
            const giveawayChannel = interaction.options.getChannel('channel');
            const giveawayDuration = interaction.options.getString('duration');
            const giveawayWinnerCount = interaction.options.getInteger('winners');
            const giveawayPrize = interaction.options.getString('prize');
            
            if(!giveawayChannel.isText()) {
                return interaction.reply({
                    content: ':x: The selected channel is not a text channel.',
                    ephemeral: true
                });
            }
        
            client.giveawaysManager.start(giveawayChannel, {
                duration: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: giveawayWinnerCount,
                hostedBy: `${interaction.user.tag}`,
                embedFooter: `${giveawayWinnerCount} winner(s)`,
                messages
            });
    
            const embed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Giveaway started in ${giveawayChannel}`)
            interaction.reply({ embeds: [embed], ephemeral: true});
    

            
        } else if (Sub === 'reroll') {   
      
            if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
                return interaction.reply({
                    content: ':x: You need to have the manage messages permissions to reroll giveaways.',
                    ephemeral: true
                });
            }
    
            const query = interaction.options.getString('giveaway');
    
            // try to found the giveaway with prize then with ID
            const giveaway = 
                // Search with giveaway prize
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // Search with giveaway ID
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);
    
            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: 'Unable to find a giveaway for `'+ query +'`.',
                    ephemeral: true
                });
            }
    
            if (!giveaway.ended) {
                return interaction.reply({
                    content: 'The giveaway is not ended yet.',
                    ephemeral: true
                });
            }
    
            // Reroll the giveaway
            client.giveawaysManager.reroll(giveaway.messageId)
            .then(() => {
                // Success message
                interaction.reply('Giveaway rerolled!');
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
    
        

        } else if (Sub === 'end') {
    
       // If the member doesn't have enough permissions
       if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
        return interaction.reply({
            content: ':x: You need to have the manage messages permissions to end giveaways.',
            ephemeral: true
        });
    }

    const query = interaction.options.getString('giveaway');

    // try to found the giveaway with prize then with ID
    const giveaway = 
        // Search with giveaway prize
        client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
        // Search with giveaway ID
        client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

    // If no giveaway was found
    if (!giveaway) {
        return interaction.reply({
            content: 'Unable to find a giveaway for `'+ query + '`.',
            ephemeral: true
        });
    }

    if (giveaway.ended) {
        return interaction.reply({
            content: 'This giveaway is already ended.',
            ephemeral: true
        });
    }

    // Edit the giveaway
    client.giveawaysManager.end(giveaway.messageId)
    // Success message
    .then(() => {
        // Success message
        interaction.reply('Giveaway ended!');
    })
    .catch((e) => {
        interaction.reply({
            content: e,
            ephemeral: true
        });
    });


        } else if (Sub === 'pause') {

            if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
                return interaction.reply({
                    content: ':x: You need to have the manage messages permissions to pause giveaways.',
                    ephemeral: true
                });
            }
    
            const query = interaction.options.getString('giveaway');
    
            // try to found the giveaway with prize then with ID
            const giveaway = 
                // Search with giveaway prize
                client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                // Search with giveaway ID
                client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);
    
            // If no giveaway was found
            if (!giveaway) {
                return interaction.reply({
                    content: 'Unable to find a giveaway for `'+ query + '`.',
                    ephemeral: true
                });
            }
    
            if (giveaway.pauseOptions.isPaused) {
                return interaction.reply({
                    content: 'This giveaway is already paused.',
                    ephemeral: true
                });
            }
    
            // Edit the giveaway
            client.giveawaysManager.pause(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply('Giveaway paused!');
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
        

        } else if (Sub === 'continue') {

                // If the member doesn't have enough permissions
                if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
                    return interaction.reply({
                        content: ':x: You need to have the manage messages permissions to unpause giveaways.',
                        ephemeral: true
                    });
                }
        
                const query = interaction.options.getString('giveaway');
        
                // try to found the giveaway with prize then with ID
                const giveaway = 
                    // Search with giveaway prize
                    client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
                    // Search with giveaway ID
                    client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);
        
                // If no giveaway was found
                if (!giveaway) {
                    return interaction.reply({
                        content: 'Unable to find a giveaway for `'+ query + '`.',
                        ephemeral: true
                    });
                }
        
                if (!giveaway.pauseOptions.isPaused) {
                    return interaction.reply({
                        content: 'This giveaway is not paused.',
                        ephemeral: true
                    });
                }
        
                // Edit the giveaway
                client.giveawaysManager.unpause(giveaway.messageId)
                // Success message
                .then(() => {
                    // Success message
                    interaction.reply('Giveaway unpaused!');
                })
                .catch((e) => {
                    interaction.reply({
                        content: e,
                        ephemeral: true
                    });
                });
              

        }

    }
}