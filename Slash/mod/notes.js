const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const db = require("../../Models/notesDB")

module.exports = {
    name: "notes",
    description: "Notes System.",
    permissions: "KICK_MEMBERS",
    options: [
        {
            name: "add",
            description: "Add someone a note",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "Select a user you want to add note.",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "Give a reason why you want to add note him.",
                     type: "STRING",
                     required: true
               },
               {
                   name: "evidence",
                   description: "Provide evidence.",
                   type: "STRING",
                   required: false
               },
            ]
        },
        {
            name: "check",
            description: "Check the notes of a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "Select a user you want to add note.",
                    type: "USER",
                    required: true
                },
            ]
        },
        {
            name: "remove",
            description: "Remove a note from a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "Select a user you want to add note.",
                    type: "USER",
                    required: true
                },
                {
                    name: "note-id",
                    description: "Provide the note ID",
                    type: "NUMBER",
                    required: true
                },
            ]
        },
        {
            name: "clear",
            description: "Clear all notes from a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "Select a user you want to add note.",
                    type: "USER",
                    required: true
                },
            ]
        }
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
        }
        

        const { options } = interaction;

        const Sub = options.getSubcommand(["add", "check", "remove", "clear"]);
        const Target = options.getMember("user");
        const Reason = options.getString("reason");
        const Evidence = options.getString("evidence") || "None provided.";
        const WarnID = options.getNumber("note-id") - 1;
        const WarnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

        if (Sub === 'add') {

        db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.user.tag }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    GuildID: interaction.guildId,
                    UserID: Target.id,
                    UserTag: Target.user.tag,
                    Content: [
                        {
                            ExecuterID: interaction.user.id,
                            ExecuterTag: interaction.user.tag,
                            Reason: Reason,
                            Evidence: Evidence,
                            Date: WarnDate
                        }
                    ],
                })
            } else {
                const obj = {
                    ExecuterID: interaction.user.id,
                    ExecuterTag: interaction.user.tag,
                    Reason: Reason,
                    Evidence: Evidence,
                    Date: WarnDate
                }
                data.Content.push(obj)
            }
            data.save()
        });

        interaction.reply({embeds: [new MessageEmbed()
        .setTitle("Note Added")
        .setColor(`${config.EMBEDCOLOR}`)
        .setDescription(`**User**: ${Target.user.tag} | ||${Target.id}||\n**Reason**: ${Reason}\n**Evidence**: ${Evidence}`)]});


        } else if (Sub === 'check') {

        db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.user.tag }, async (err, data) => {
            if (err) throw err;
            if (data) {
                interaction.reply({embeds: [new MessageEmbed()
                .setTitle("Notes check")
                .setColor(`${config.EMBEDCOLOR}`)
                .setDescription(`${data.Content.map(
                    (w, i) => `**ID**: ${i + 1}\n**Staff**: ${w.ExecuterTag}\n**Date**: ${w.Date}\n**Reason**: ${w.Reason}\n**Evidence**: ${Evidence}
                    \n`
                ).join(" ")}`)]});
            } else {
                interaction.reply({embeds: [new MessageEmbed()
                .setColor(`${config.EMBEDCOLOR}`)
                .setDescription(`${Target.user.tag} | ||${Target.id}|| has no notes.`)]});
            }
        });

        } else if (Sub === 'remove') {
            
        db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.user.tag }, async (err, data) => {
            if (err) throw err;
            if (data) {
                data.Content.splice(WarnID, 1)
                interaction.reply({embeds: [new MessageEmbed()
                .setTitle("Note Clear Action")
                .setColor(`${config.EMBEDCOLOR}`)
                .setDescription(`${Target.user.tag}'s note id: ${WarnID + 1} has been removed.`)]});
                data.save()
            } else {
                interaction.reply({embeds: [new MessageEmbed()
                    .setColor(`${config.EMBEDCOLOR}`)
                    .setDescription(`${Target.user.tag} | ||${Target.id}|| has no notes.`)]});
            }
        });

        } else if (Sub === 'clear') {
            
        db.findOne({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.user.tag }, async (err, data) => {
            if (err) throw err;
            if (data) {
                await db.findOneAndDelete({ GuildID: interaction.guildId, UserID: Target.id, UserTag: Target.user.tag })
                interaction.reply({embeds: [new MessageEmbed()
                .setAuthor("Note Clear Action")
                .setColor(`${config.EMBEDCOLOR}`)
                .setDescription(`${Target.user.tag}'s notes were cleared. | ||${Target.id}||`)]});
            } else {
                interaction.reply({embeds: [new MessageEmbed()
                    .setColor(`${config.EMBEDCOLOR}`)
                    .setDescription(`${Target.user.tag} | ||${Target.id}|| has no notes.`)]});

            }
        })
        }
    } // SaturnBot (by rtx#3317)
}