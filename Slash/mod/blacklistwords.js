const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const schema = require('../../Models/blacklistWords');
const db = require('../../Models/roleWhitelist');
const { Schema } = require("mongoose");

module.exports = {
    name: "blacklistwords",
    description: "Blacklist Words.",
    permissions: "MANAGE_MESSAGES",
    options: [
        {
            name: "add",
            description: "Add a word to blacklist.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "blacklistword",
                    description: "Write a word to blacklist.",
                    type: "STRING",
                    required: true
                },
            ]
        },
        {
            name: "list",
            description: "List of blacklist words.",
            type: "SUB_COMMAND",
        },
        {
            name: "remove",
            description: "Remove a word form the list.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "word",
                    description: "Provide the word",
                    type: "STRING",
                    required: true
                },
            ]
        },
        {
            name: "whitelist-role",
            description: "Role that will be allowed to submit blacklisted words.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "role",
                    description: "Role.",
                    type: "ROLE",
                    required: true
                },
            ]
        },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
        }
        

        const { options } = interaction;

        const Sub = options.getSubcommand(["add", "list", "remove", "whitelist-role"]);
        const addword = options.getString("blacklistword")
        const removeword = options.getString("word")


        let data;
        try {
            data = await schema.findOne({ guildId: interaction.guild.id })
            if(!data){
                data = await schema.create({ guildId: interaction.guild.id })
            }

        } catch (error) {
            console.log(error)
        }

        if (Sub === 'add') {
            const wordadded = new MessageEmbed()
            .setColor(`${client.config.EMBEDCOLOR}`)
            .setTitle(`${client.config.BOTNAME} | Blacklist Words`)
            .setDescription(`Hey <@${interaction.user.id}>, succesfully added **${addword}** to the blacklist words list.`)
            const wordToBeAdded = addword.toLowerCase()
            if(data.BLW.includes(wordToBeAdded)) return interaction.reply({content: 'This word is already in the list', ephemeral: true})

            interaction.reply({
                embeds: [wordadded]
          })
            data.BLW.push(wordToBeAdded)
            await data.save()



        } else if (Sub === 'list') {

            const datos = data.BLW.map(r => `${r}`).join(', ')
            if(!datos) return interaction.reply({
                content: 'No Words found',
                ephemeral: true
            })
            const listwords = new MessageEmbed()
            .setColor(`${config.EMBEDCOLOR}`)
            .setTitle(`${config.BOTNAME} | Blacklist Words`)
            .setDescription(`Hey ${interaction.user}, these are all the words blacklisted.\n\n**${datos}**`)

            interaction.reply({
                embeds: [listwords]
            })

           
            
      

        } else if (Sub === 'remove') {
            const wordremoved = new MessageEmbed()
            .setColor(`${client.config.EMBEDCOLOR}`)
            .setTitle(`${client.config.BOTNAME} | Blacklist Words`)
            .setDescription(`Hey <@${interaction.user.id}>, succesfully removed **${removeword}** to the blacklist words list.`)
            const wordToBeRemoved = removeword.toLowerCase()
            if(!data.BLW.includes(wordToBeRemoved)) return interaction.reply({content: 'This word is already not in the list', ephemeral: true})
            let array = data.BLW

            array = array.filter(x => x !== wordToBeRemoved)
            data.BLW = array
            interaction.reply({
                embeds: [wordremoved]
            })
            await data.save()
      

        } else if (Sub === 'whitelist-role') {


            const role = options.getRole('role')
            const data = await db.findOne({guildID: interaction.guild.id})
            if (!data) {
                await db.create({
                    guildID: interaction.guild.id,
                    Role: role.id
                })
                return interaction.reply({content: `Set the whitelist role to ${role.toString()}`})
            } else {
                await db.findOneAndUpdate({guildID: interaction.guild.id}, {Role: role.id})
                return interaction.reply({content: `Changed the whitelist role to ${role.toString()}`})
            }

    

        }
    }
}