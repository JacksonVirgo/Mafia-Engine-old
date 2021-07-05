const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const VerifySchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Users',
	},
	token: {
		type: String,
		required: true,
	},
	expireAt: {
		type: Date,
		default: Date.now,
		index: {
			expires: 86400000,
		},
	},
});

module.exports = {
	schema: mongoose.model('Users', UserSchema),
	validate: Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
};
