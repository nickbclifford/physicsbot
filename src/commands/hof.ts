import { Message, TextChannel } from 'discord.js';
import config from '../config';
import { addToHallOfFame } from '../hall-of-fame';
import { Command } from '../types';

export default {
	async run(client, message, args) {
		if (message.author.id !== config.botOwnerID) {
			await message.channel.send('You do not have permission to run this command.');
			return;
		}

		if (!args[0]) {
			await message.channel.send('Missing message ID.');
			return;
		}

		let channel = message.channel as TextChannel;
		if (args[1]) {
			channel = message.guild.channels.get(args[1])! as TextChannel;
		}

		let hofMessage: Message;
		try {
			hofMessage = await channel.fetchMessage(args[0]);
		} catch (e) {
			await message.channel.send(`Error finding message. (\`${e.message}\`)`);
			return;
		}

		await addToHallOfFame(hofMessage);
		await message.channel.send('Message successfully added to Hall of Fame.');
	},
	help: {
		usage: 'hof <message id> <channel id [optional]>',
		description: 'Manually adds a message to the Hall of Fame. ' +
			'(Defaults to current channel if no ID provided, only usable by bot owner.)'
	}
} as Command;
