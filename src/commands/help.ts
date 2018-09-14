import { RichEmbed } from 'discord.js';
import config from '../config';
import { Command } from '../types';

export default {
	async run(client, message, args) {
		const command = args[0];

		if (!command) {
			const embed = new RichEmbed().setTitle('Command List');

			for (const [name, commandObj] of client.commands) {
				embed.addField(config.prefix + name, commandObj.help.description);
			}

			await message.channel.send(embed);
		} else {
			const commandObj = client.commands.get(command);

			if (!commandObj) {
				await message.channel.send(`Command \`${config.prefix}${command}\` not found.`);
				return;
			}

			const embed = new RichEmbed()
				.setTitle(`Command: \`${config.prefix}${command}\``)
				.addField('Usage', `\`${config.prefix}${commandObj.help.usage}\``)
				.addField('Description', commandObj.help.description);

			await message.channel.send(embed);
		}
	},
	help: {
		usage: 'help <command [optional]>',
		description: 'Displays all available commands or displays usage information for a single command'
	}
} as Command;
