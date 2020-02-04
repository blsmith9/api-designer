const mongoose = require('mongoose');

SwaggerSchema = mongoose.Schema({
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
	date: {
		type: Date,
		default: Date.now
	},
	info: {
		title: String,
		description: String,
		version: String,
		contextRoot: String
	},
	schemes: [String],
	consumes: [String],
	produces: [String],
	tags: [{ tempId: String, name: String, description: String }],
	endpoints: [
		{
			tempId: String,
			path: String,
			variables: [
				{
					tempId: String,
					variable: String,
					info: {
						summary: String,
						description: String,
						tag: String,
						parameters: [
							{
								tempId: String,
								in: String,
								name: String,
								description: String,
								required: String,
								parameterType: String,
								types: { items: String },
								paramSchema: { paramRef: String }
							}
						],
						responses: [
							{
								tempId: String,
								response: String,
								description: String,
								responseSchema: { responseRef: String }
							}
						]
					}
				}
			]
		}
	],
	definitions: [
		{
			tempId: String,
			definitionName: String,
			properties: [
				{
					tempId: String,
					name: String,
					propertyType: String,
					types: {
						items: String,
						itemSchema: { itemRef: String }
					},
					childSchema: { childRef: String }
				}
			]
		}
	]
});

module.exports = mongoose.model('swagger', SwaggerSchema);
