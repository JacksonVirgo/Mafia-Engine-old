const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	securityToken: {
		type: String,
		required: false,
	},
	games: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
	},
});

module.exports = {
	schema: mongoose.model('Users', UserSchema),
	validate: Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
};
