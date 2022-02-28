import { Constants, MessageEmbed, MessageEmbedOptions, MessageOptions, Guild } from 'discord.js';

export const ExampleVoteData: VoteCountData = {
	title: 'Example Game',
	livingPlayers: ['416757703516356628', '661828979442974730', '843514276383031296'],
	votes: [
		{
			voter: '416757703516356628',
			target: '661828979442974730',
			timestamp: 1645815707,
		},
		{
			voter: '661828979442974730',
			target: '843514276383031296',
			timestamp: 1645815743,
		},
		{
			voter: '416757703516356628',
			target: '843514276383031296',
			timestamp: 1645815744,
		},
		{
			voter: '843514276383031296',
			target: '416757703516356628',
			timestamp: 1645815746,
		},
	],
	dayStarts: [1645815720],
};

export interface VoteData {
	voter: string;
	target: string;
	timestamp: number;
}

export interface VoteCountData {
	title?: string;
	livingPlayers: string[];
	deadPlayers?: string[];
	votes?: VoteData[];
	dayStarts?: number[];
}
export const createVoteCount = (vcData: VoteCountData, _guild?: Guild | null | undefined): MessageOptions => {
	let embedData: MessageEmbedOptions = {
		color: Constants.Colors.BLURPLE,
		footer: {
			text: 'Mafia Engine VC',
		},
		timestamp: new Date(),
	};

	const dayStarts = vcData.dayStarts;
	const majority = Math.ceil(vcData.livingPlayers.length / 2);
	let voteCountString = '';
	let voteCountDesc = 'Use slash command `/vote` in the game channel\n\n';
	let vcVotes = vcData.votes || [];

	let latestDay: number = 0;
	if (dayStarts && dayStarts.length > 0) latestDay = dayStarts[dayStarts.length - 1];
	let orderedVotes = orderVotes(vcVotes);

	let wagons: Record<string, string[]> = {};
	let usersLastValidVotes: Record<string, string> = {};
	orderedVotes.forEach((vote, _index) => {
		const { voter, target, timestamp } = vote;
		let hasValidTime = timestamp > latestDay;
		if (hasValidTime) usersLastValidVotes[voter] = target;
	});

	for (const player in usersLastValidVotes) {
		const vote = `<@${usersLastValidVotes[player]}>`;
		if (!wagons[vote]) wagons[vote] = [];
		wagons[vote].push(`<@${player}>`);
	}

	for (const wagonedPlayer in wagons) {
		let voters = wagons[wagonedPlayer];
		let votersString = voters.join(', ');

		let voteSize = voters.length >= majority ? 'HAMMERED' : `${voters.length}`;
		voteCountString += `\n${wagonedPlayer} (${voteSize}) -> ${votersString}`;
	}

	voteCountDesc += `**Majority:** ${majority}`;

	embedData.title = (vcData.title || 'Vote Counter') + ` - Day ${latestDay == 0 ? 1 : dayStarts?.length}`;
	embedData.description = voteCountDesc.trim();
	if (voteCountString == '') voteCountString = 'No Votes';
	embedData.fields = [{ name: '__Votes__', value: voteCountString.trim() }];

	return {
		embeds: [new MessageEmbed(embedData)],
	};
};

const orderVotes = (votes: VoteData[]): VoteData[] => {
	let array = votes.slice();
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array.length - 1; j++) {
			if (array[j].timestamp > array[j + 1].timestamp) {
				let swap = array[j];
				array[j] = array[j + 1];
				array[j + 1] = swap;
			}
		}
	}
	return array;
};
