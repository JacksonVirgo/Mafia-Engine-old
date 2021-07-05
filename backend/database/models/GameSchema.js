const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

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
