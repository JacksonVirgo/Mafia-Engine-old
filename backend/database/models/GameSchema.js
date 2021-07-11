const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

/* 
Day Start -> Day Number + Post Number
Players -> Players, Nicknames and Replacements.
Deadlines -> Phase + Prods
*/

const GameSchema = new mongoose.Schema({
	title: {
		type: String,
		required: false,
		default: 'Game',
	},
	moderators: {
		type: [String],
		required: true,
	},
	players: {
		type: [String],
		required: false,
		default: [],
	},
	days: {
		type: Object,
		required: false,
		default: { 1: 0 },
	},
	phaseDeadline: {
		type: Number,
		required: false,
	},
	prodTimer: {
		type: Number,
		required: false,
	},
	threadURL: {
		type: String,
		required: false,
		default: '',
	},
	locked: {
		type: Boolean,
		required: false,
		default: false,
	},
});

module.exports = {
	schema: mongoose.model('Games', GameSchema),
	validate: Joi.object({
		moderators: Joi.array().items(Joi.string()).required(),
		players: Joi.array().items(Joi.string()).default([]),
		threadURL: Joi.string().default(''),
	}),
};
