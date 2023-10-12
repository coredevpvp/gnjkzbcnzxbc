const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js")
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const ticketDB = require('../../Models/ticketDB');

module.exports = {
    name: "ticket",
    description: "Setup ticket panel.",
    permissions: "ADMINISTRATOR",
    options: [
        {
            name: "setup-panel",
            description: "Setup ticket panel.",
            type: "SUB_COMMAND",
    
            options: [
                {
                  name: 'type',
                description: 'Type of the panel',
                type: 'STRING',
                required: true,
            choices: [
                {
                    name: 'buttons',
                    value: 'buttons'
                },
                {
                    name: 'dropdown',
                    value: 'dropdown'
                },

                
            ],
        },
        

                {
                    name: "channel",
                    description: "Channel to send ticket-panel.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                    
                },

            ]
        },
        {
            name: "setup-channels",
            description: "Setup ticket channels (Logs & Transcripts).",
            type: "SUB_COMMAND",
        },
        {
            name: "create-category",
            description: "Create category.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "category-name",
                    description: "Name of the category",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-id",
                    description: "ID of the category",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-description",
                    description: "Category Description (Ticket Panel Description)",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-button-emoji",
                    description: "Category Button Emoji.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-category",
                    description: "Category to open tickets.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_CATEGORY"],
                    required: true
                },
                {
                    name: "category-support-role-1",
                    description: "Support role 1.",
                    type: "ROLE",
                    required: true
                },
                {
                    name: "category-support-role-2",
                    description: "Support role 2. (OPTIONAL)",
                    type: "ROLE",
                    required: false
                },
                {
                    name: "category-support-role-3",
                    description: "Support role 3. (OPTIONAL)",
                    type: "ROLE",
                    required: false
                },
            ]
        },
        {
            name: "delete-category",
            description: "Delete a specific category.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "category-id",
                    description: "Ticket category ID.",
                    type: "STRING",
                    required: true
                },

            ],
        },
        {
            name: "list-category",
            description: "Panel Category list",
            type: "SUB_COMMAND",

        },
        {
            name: "alert",
            description: "Notify a user that their ticket will be closed.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to notify",
                    type: "USER",
                    required: true
                }
            ]
        }

    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

 

        const Sub = interaction.options.getSubcommand(["setup-panel","setup-channels","create-category","delete-category","list-category","alert"]);
        let Name = interaction.options.getString("category-name");
        let role2 = interaction.options.getRole("category-support-role-2");
        let role3 = interaction.options.getRole("category-support-role-3");
        let Description = interaction.options.getString("category-description");
        let Emoji = interaction.options.getString("category-button-emoji");
        let Category = interaction.options.getChannel("category-category");
        let customID = interaction.options.getString("category-id");


  
        if (Sub === 'setup-panel') {
            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
            }
    


            const type = interaction.options.getString('type');
            const channel = interaction.options.getChannel('channel') || interaction.channel;    

            
            if(type == 'buttons') {

            const ticketData= await ticketDB.findOne({
                guildID: interaction.guild.id
            })
                if(!ticketData) return interaction.reply({content: `No ticket panel created with that name was found.`, ephemeral: true})
                if(!ticketData.tickets || ticketData.tickets.length === 0) return interaction.reply({content: `No ticket panel found in this server.`, ephemeral: true})
                const components = [];
                lastComponents = new MessageActionRow();
                const options = ticketData.tickets.map(x => {
                    return {
                        customID:  x.customID,
                        emoji:  x.ticketEmoji,
                        name: x.ticketName,
                        description: x.ticketDescription,
                    }
                })
                for(let i = 0; i < options.length; i++) {
                    if(options[i].emoji != undefined) {
                        const button = new MessageButton()
                            .setCustomId(options[i].customID)
                            .setEmoji(options[i].emoji)
                            .setLabel(options[i].name)
                            .setStyle("SECONDARY")
                        lastComponents.addComponents(button)
                        if(lastComponents.components.length === 5) {
                            components.push(lastComponents)
                            lastComponents = new MessageActionRow();
                        }
                    }
                }
                if(lastComponents.components.length > 0) {components.push(lastComponents)}
                const panelEmbed = new MessageEmbed()
                    .setTitle(`${config.BOTNAME} | Tickets`)
                    .setDescription(`${messages.TICKET.PANEL_MESSAGE}`.replace('<ticketPanel>', `${options.map(x => `**${x.name}**\n${x.description}\n ${config.TICKET.MESSAGE_PANEL} ${x.emoji}`).join('\n\n')}`))
                    .setImage(config.TICKET.BANNER)
                    .setColor(`${config.EMBEDCOLOR}`)

                await client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: components}) 
                interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
            } else if(type == 'dropdown') {
                const ticketData = await ticketDB.findOne({
                    guildID: interaction.guild.id
                })
                if(!ticketData) return interaction.reply({content: `No ticket panel found in this server.`, ephemeral: true})
                if(!ticketData.tickets || ticketData.tickets.length === 0) return interaction.reply({content: `No ticket panel created with that name was found.`, ephemeral: true})

    
                    const options = ticketData.tickets.map(x => {
                        return {
                            label: x.ticketName,
                            value: x.customID,
                            description: x.ticketDescription,
                            emoji: x.ticketEmoji,
                            name: x.ticketName,
                        }
                    })
                    const row = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("SUPPORT-SYSTEM")
                            .setMaxValues(1)
                            .addOptions(options)
                    )
                    const panelEmbed = new MessageEmbed()
                        .setTitle(`${config.BOTNAME} | Tickets`)
                        .setDescription(`${messages.TICKET.PANEL_MESSAGE}`.replace('<ticketPanel>', `${options.map(x => `${x.emoji} - ${x.name}`).join('\n')}`))
                        .setColor(config.EMBEDCOLOR)
                    await client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: [row]})     
                    interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
                
            }


        } else if (Sub === 'setup-channels') {

            return interaction.reply('trabajando')

        } else if (Sub === 'create-category') {

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
            }
    

            const guildData = await ticketDB.findOne({
                guildID: interaction.guild.id
            })
            let role1 = interaction.options.getRole("category-support-role-1") || config.SUPPORTROLE
    
            const newTicket = {
                customID: customID,
                ticketName: Name,
                ticketDescription: Description,
                ticketCategory: Category.id,
                ticketEmoji: Emoji,
                ticketRoles: [role1 ? role1.id : null, role2 ? role2.id : role1.id, role3 ? role3.id : role1.id],
            }
            const roles = newTicket.ticketRoles.map(x => interaction.guild.roles.cache.get(x));
            const rolesUnique = roles.filter((v, i, a) => a.indexOf(v) === i);
            newTicket.ticketRoles = rolesUnique.map(x => x.id);
            
            if(guildData) {
                let ticketData = guildData.tickets.find((x) => x.customID === customID);
                if(ticketData) {
                    return interaction.reply({content: `Category <custom_id> already exists`.replace('<custom_id>', customID), ephemeral: true})
                } else {
                    guildData.tickets = [...guildData.tickets, newTicket];
                }
                await guildData.save()
            } else {
                await ticketDB.create({
                    guildID: interaction.guild.id,
                    tickets: [newTicket]
                })
            }
            let embed = new MessageEmbed()
                .setTitle(`${config.BOTNAME} | Tickets`)
                .setDescription(`<a:Si:900497814029750274> Category with ID **${customID}** has been created successfully!`)
                .addField(`<:text3:919776622956118017> **Category Info**`,`Category Name: ${Name}\nDropdown Description: ${Description}\nCategory Roles: ${rolesUnique.map(x =>`<@&${x.id}>`).join(', ')}\nEmoji Panel Button: ${Emoji}`)
                .setColor(`${config.EMBEDCOLOR}`)
            return interaction.reply({embeds: [embed]})
        

        } else if (Sub === 'delete-category') {

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
            }
    


            let categoryid = interaction.options.getString("category-id");

            const guildData = await ticketDB.findOne({guildID: interaction.guild.id})

            if(!guildData) {
                return interaction.reply({content: `No ticket panel found in this server.`, ephemeral: true})
            }
    
            const guildTicket = guildData.tickets
            const findTicket = guildTicket.find(x => x.customID == categoryid)
            if(!findTicket) {
                return interaction.reply({content: `No ticket panel created with that name was found.`, ephemeral: true})
            }
    
            const filteredTickets = guildTicket.filter(x => x.customID != categoryid)
            guildData.tickets = filteredTickets;
    
            await guildData.save()
    
            let embed = new MessageEmbed()
                .setColor(config.EMBEDCOLOR)
                .setTitle(`${config.BOTNAME} | Tickets`)
                .setDescription(`<a:Si:900497814029750274> The panel has been successfully **removed**`);
            return interaction.reply({embeds: [embed]})

    

        } else if (Sub === 'list-category'){

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
        }


            const ticketList = await ticketDB.findOne({
                guildID: interaction.guild.id
            })
            if(!ticketList) {
                let embed = new MessageEmbed()
                    .setColor(config.EMBEDCOLOR)
                    .setTitle(`${config.BOTNAME} | Tickets`)
                    .setDescription(`No panels created`)
                return interaction.reply({embeds: [embed]})
            }
            if(!ticketList || !ticketList.tickets || ticketList.tickets.length === 0) {
                let embed = new MessageEmbed()
                .setColor(config.EMBEDCOLOR)
                .setTitle(`${config.BOTNAME} | Tickets`)
                    .setDescription(`No panels created`)
                return interaction.reply({embeds: [embed]})
            }
            const data = [];
    
            const options = ticketList.tickets.map(x => {
                return {
                    customID: x.customID,
                    ticketName: x.ticketName,
                    ticketDescription: x.ticketDescription,
                    ticketCategory: x.ticketCategory,
                    ticketEmoji: x.ticketEmoji,
                    ticketRoles: x.ticketRoles,
                    }
                })
            for(let i = 0; i < options.length; i++) {

                data.push(`<:text3:919776622956118017> **Category info with ID:** ${options[i].customID} `)
                data.push(`Category Name: ${options[i].ticketName}`)
                data.push(`Dropdown Panel Description: ${options[i].ticketDescription}`)
                data.push(`Category Emoji: ${options[i].ticketEmoji}`)
                data.push(`Category Roles: ${options[i].ticketRoles.map(x => interaction.guild.roles.cache.get(x)).join(", ") || "No specified!"}`)
                data.push(`Category: ${options[i].ticketCategory}\n`)
            }
            
            const embed = new MessageEmbed()
            .setColor(config.EMBEDCOLOR)
            .setTitle(`${config.BOTNAME} | Ticket - Category List`)
            .setDescription(`${data.join("\n")}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            return interaction.reply({embeds: [embed]})

        }else if (Sub === 'alert'){


            const guildData = await ticketDB.findOne({
                guildID: interaction.guild.id
            })

            const dataRole = require("../../Models/rolesdata.js")
            const roleData = await dataRole.findOne({ Guild: interaction.guild.id })
            if(!roleData) return interaction.reply({ 
                content: 'No roles found, configure using /setroles',
                ephemeral: true
            })
            
            const rolesupport = interaction.guild.roles.cache.get(roleData.RoleSupport)

   
     
    if(!guildData) return interaction.reply({content: 'No data found.', ephemeral: true})
    if(!interaction.member.roles.cache.get(rolesupport.id)) 
      
    if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: 'This server does not have a ticket panel', ephemeral: true})
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: 'You can only use this command on a ticket!', ephemeral: true})
    
    let user = interaction.options.getUser('user');
    const embed = new MessageEmbed()
        .setDescription(`${messages.TICKET.ALERT_MESSAGE}`.replace('<user>', `${user.username}`))
        .setColor("YELLOW")
    try {
        await user.send({embeds: [embed]})	
    } catch (error) {
        return interaction.reply({
            embeds: [new MessageEmbed().setDescription(`\n❌ Error: ${error}`).setColor("RED")]
        })
    }

    interaction.reply({
        embeds: [new MessageEmbed().setDescription(`${messages.TICKET.ALERT_SENT}`.replace('<user>', `${user}`)).setColor("GREEN")]
    })
        if(!guildData) return interaction.reply({content: `No data found.`, ephemeral: true})
  
    
}
        }
    }

    
