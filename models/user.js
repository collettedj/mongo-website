const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	userName: {
		type: String,
		index: true
	},
	password: {
		type: String,
	}
	// owner_id: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	index: true
	// },
	// room_id: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	index: true
	// }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}