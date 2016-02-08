const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
	name: {
		type: String,
	},

	description: {
		type: String,
	},

	roles:[
		{
			name: String,
			description: String,
		}
	]

});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;