const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationUserSchema = new Schema({
	appId: Schema.Types.ObjectId,
});

const UserSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		index: true,
		required: true,
	},
	password: {
		type: String,
	},

	apps:[ApplicationUserSchema],

});

const User = mongoose.model('User', UserSchema);

module.exports = User;