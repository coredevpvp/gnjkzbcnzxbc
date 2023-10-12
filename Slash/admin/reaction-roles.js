const { 
    CommandInteraction, 
    MessageEmbed ,
    MessageActionRow,
    MessageSelectMenu
} = require("discord.js");

const client = require("../../index.js")
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const rrModel = require("../../Models/reactionRoles");

module.exports = {
    name: "reaction-roles",
    description: "Manage autoroles",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'add',
            description: 'Add an autorole',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The role to add',
                    type: 'ROLE',
                    required: true
                },
                {
                    name: 'description',
                    description: 'The description of the role',
                    type: 'STRING',
                    required: false
                },
                {
                    name: 'emoji',
                    description: 'The emoji to use',
                    type: 'STRING',
                    required: false
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove an autorole',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The role to remove',
                    type: 'ROLE',
                    required: true
                },
            ]
        },
        {
            name: 'panel',
            description: 'Open the autoroles panel',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send the panel',
                    type: 'CHANNEL',
                    required: false
                },
            ]
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(config.REACTION_ROLES.ENABLED == false) return;

        if(!interaction.member.permissions.has("ADMINISTRATOR")){
            return interaction.reply({ 
                content: `${messages.NO_PERMSUSER}`,
                ephemeral: true
            })
        }



        const [SubCommand] = args;
        if(SubCommand == "add") {
            const role = interaction.options.getRole('role');
            const roleDescription = interaction.options.getString('description') || null;
            const roleEmoji = interaction.options.getString('emoji') || null;

            if(role.position >= interaction.guild.me.roles.highest) {
                return interaction.reply({content: "I can't add that role, it's higher than my highest role.", ephemeral: true});
            }

            const guildData = await rrModel.findOne({guildID: interaction.guild.id});
            
            const newRole = {
                roleId: role.id,
                roleDescription,
                roleEmoji,
            }

            if(guildData) {
                const roleData = guildData.roles.find((z) => z.roleId == role.id);
                if(roleData) {
                    roleData = newRole;
                } else {
                    guildData.roles = [...guildData.roles, newRole];
                }
                await guildData.save();
            } else {
                await rrModel.create({
                    guildID: interaction.guild.id,
                    roles: newRole
                })
            }
        const embed = new MessageEmbed()
            .setTitle("Role added")
            .setDescription(`Role ${role} has been added to the autoroles.`)
            .setColor("GREEN")
            .setTimestamp();
        interaction.reply({embeds: [embed], ephemeral: true});
        } else if(SubCommand == "remove") {
            const role = interaction.options.getRole('role');
            const guildData = await rrModel.findOne({guildID: interaction.guild.id});
            if(!guildData) {
                return interaction.reply({content: "There are no autoroles set up for this server.", ephemeral: true});
            } else {
                const guildRoles = guildData.roles;
                const findRole = guildRoles.find((z) => z.roleId == role.id);
                if(!findRole) {
                    return interaction.reply({content: "That role is not in the autoroles.", ephemeral: true});
                } else {
                    const filteredRoles = guildRoles.filter((z) => z.roleId != role.id);
                    guildData.roles = filteredRoles;

                    await guildData.save();
                }
            }
            const embed = new MessageEmbed()
                .setTitle("Role removed")
                .setDescription(`Role ${role} has been removed from the autoroles.`)
                .setColor("GREEN")
                .setTimestamp();
            interaction.reply({embeds: [embed], ephemeral: true});
        } else if(SubCommand == "panel") {
            const guildData = await rrModel.findOne({guildID: interaction.guild.id});
            if(!guildData?.roles) {
                return interaction.reply({content: "There are no autoroles set up for this server.", ephemeral: true});
            } else {
                const options = guildData.roles.map(x => {
                    const role = interaction.guild.roles.cache.get(x.roleId);
                    if(!role) return;
                    return {
                        label: role.name,
                        value: role.id,
                        description: x.roleDescription,
                        emoji: x.roleEmoji
                    };
                });
                if(options.length == 0) {
                    return interaction.reply({content: "There are no autoroles set up for this server.", ephemeral: true});
                }
                const embed = new MessageEmbed()
                    .setTitle(config.REACTION_ROLES.EMBED_CONFIG.TITLE)
                    .setDescription(config.REACTION_ROLES.EMBED_CONFIG.DESCRIPTION)
                    .setColor(config.REACTION_ROLES.EMBED_CONFIG.COLOR)
                    .setFooter(config.REACTION_ROLES.EMBED_CONFIG.FOOTER)
                const components = [
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("autoroles")
                            .setMaxValues(1)
                            .addOptions(options)
                    )
                ];
                const channel = interaction.options.getChannel('channel') || interaction.channel;
                channel.send({embeds: [embed], components,});
                interaction.reply({content: `Sent the panel to ${channel}`, ephemeral: true});
            }
        };
    },
};