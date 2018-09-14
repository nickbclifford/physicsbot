import { Command } from '../types';

export default {
	async run(client, message, args) {
		await message.channel.send('Pong!');
	},
	help: {
		usage: 'ping',
		description: 'Pong!'
	}
} as Command;
