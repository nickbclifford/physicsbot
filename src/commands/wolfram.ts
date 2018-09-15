import { Attachment, Message, RichEmbed } from 'discord.js';
import fetch from 'node-fetch';
import config from '../config';
import { Command } from '../types';

export default {
	async run(client, message, args) {
		const query = encodeURIComponent(args.join(' '));
		if (query.length === 0) {
			await message.channel.send('Cannot make an empty query to Wolfram|Alpha.');
			return;
		}

		const loadingMsg = await message.channel.send('Making request...') as Message;

		let wolframImage: Buffer;
		try {
			wolframImage = await fetch(`http://api.wolframalpha.com/v1/simple?appid=${config.wolframAppID}&i=${query}`)
				.then(r => r.buffer());
		} catch (e) {
			await message.channel.send(`Error making request to Wolfram|Alpha. (\`${e.message}\`)`);
			return;
		}

		await loadingMsg.delete();

		const attachment = new Attachment(wolframImage!, 'wolfram_response.gif');
		const embed = new RichEmbed()
			.setTitle('Wolfram|Alpha Response')
			.setImage('attachment://wolfram_response.gif')
			.attachFile(attachment);

		await message.channel.send(embed);
	},
	help: {
		usage: 'wolfram <query>',
		description: 'Makes a query to Wolfram|Alpha.'
	}
} as Command;
