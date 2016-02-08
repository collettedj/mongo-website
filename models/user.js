const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
	},

	apps:[
		{
			roleId: Schema.Types.ObjectId,
		}
	]
	// owner_id: {
	// 	type: Schema.Types.ObjectId,
	// 	index: true
	// },
	// room_id: {
	// 	type: Schema.Types.ObjectId,
	// 	index: true
	// }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;