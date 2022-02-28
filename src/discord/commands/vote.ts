import { Command } from '../../interfaces/Command';
import { CommandInteraction, Message } from 'discord.js';
// import MafiaGame, { GameSchema } from '../../database/discord/Game';
// import VoteCounter, { VoteCountSchema } from '../../database/discord/VoteCounter';
import { createVoteCount, ExampleVoteData } from '../structures/VoteCount';

export default {
	tag: 'vote',
	developmentOnly: true,

	description: '[GAME] Vote a player.',
	permission: {
		regularUser: false,
		custom: (_message: Message) => true,
	},
	slashPermissions: [
		{
			type: 'ROLE',
			id: '801534801320083496',
			permission: true,
		},
		{
			type: 'ROLE',
			id: '650834329257377796',
			permission: true,
		},
		{
			type: 'ROLE',
			id: '897910725467570178',
			permission: true,
		},
		{
			type: 'ROLE',
			id: '943131009338204161',
			permission: true,
		},
	],
	options: [
		{
			name: 'target',
			description: 'Player you want to vote',
			type: 'USER',
			required: true,
		},
	],
	runSlash: async (i: CommandInteraction): Promise<any> => {
		await i.deferReply();

		console.log('Hiya');

		const formattedVC = createVoteCount(ExampleVoteData, i.guild);

		i.editReply(formattedVC);

		// const channel = i.channel as TextChannel;

		// const voteTarget = i.options.getUser('target', true);
		// const fetchedGame = (await MafiaGame.findOne({ gameChannel: i.channelId })) as GameSchema;

		// let isStandaloneVote = !fetchedGame || !fetchedGame.voteCounter;
		// if (isStandaloneVote) {
		// 	await i.editReply({
		// 		content: `[Gameless] <@${i.user.id}> voted for <@${voteTarget.id}>`,
		// 		allowedMentions: { parse: [], repliedUser: true },
		// 	});
		// }

		// const voteCounter = (await VoteCounter.findOne({ _id: fetchedGame.voteCounter })) as VoteCountSchema;
		// if (!voteCounter) {
		// 	try {
		// 		fetchedGame.voteCounter = undefined;
		// 		await fetchedGame.save();
		// 	} catch (err) {
		// 		console.log(err);
		// 	}
		// 	return;
		// }

		// let isPlayer = false;
		// if (fetchedGame.players) {
		// 	fetchedGame.players.forEach((slot) => {
		// 		if (i.user.id == slot.id) isPlayer = true;
		// 	});
		// }

		// if (isPlayer) {
		// 	await i.editReply({
		// 		content: `<@${i.user.id}> voted for <@${voteTarget.id}>`,
		// 		allowedMentions: { parse: [], repliedUser: true },
		// 	});
		// } else {
		// 	console.log(`USER [${i.user.id} - ${i.user.username}] attempted to vote in channel ${i.channelId} [${channel.name}]`);
		// }

		// if (players.includes(i.user.id) && players.includes(voted.id)) {
		// 	if (!votecount) return;
		// 	votecount.wagons = votecount.wagons || [];

		// 	let votedID: number | null = -1;
		// 	votecount.wagons.forEach((v, i) => {
		// 		if (v.target == voted.id) votedID = i;
		// 	});

		// 	if (votedID >= 0) {
		// 		// Wagon already exists
		// 	} else if (votedID == -1) {
		// 		// Wagon does not exist.
		// 	}

		// 	i.editReply(`<@${i.user.id}> has voted for ${voted.id == i.user.id ? 'themselves' : `<@${voted.id}>`}`);
		// }

		// const { votecount, players, dead } = voteCounter;
		// if (!players) return;

		// if (votecount) {
		// 	votecount.wagons = votecount.wagons || [];

		// 	let votedID: number | null = -1;
		// 	votecount.wagons.forEach((v, i) => {
		// 		if (v.target == voted.id) votedID = i;
		// 	});

		// 	if (votedID >= 0) {
		// 	}
		// }
	},
	runMsg: async (message: Message, _args: string[]) => {
		createVoteCount(ExampleVoteData, message.guild);
	},
} as Command;
