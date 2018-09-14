import { Command } from '../types';

// TODO: finish
export default {
	async run(client, message, args) {
		const command = args[0];

		await message.channel.send('TODO');
	},
	help: {
		usage: 'help <command [optional]>',
		description: 'Displays all available commands or displays usage information for a single command'
	}
} as Command;
