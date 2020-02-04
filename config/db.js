const mongoose = require('mongoose');
const config = require('config');
const fs = require('fs');

const db = process.env.mongoURI || config.get('mongoURI');
let certFile = fs.readFileSync(__dirname + '/Cerner_Root.crt');

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
			dbName: 'api-design-db',
			sslCA: certFile
		});

		console.log('MongoDB Connected');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
