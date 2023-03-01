const mongoose = require('mongoose');
const { mongoUrl } = require('./venv');

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
	console.error(err);
});

async function mongoConnect() {
	await mongoose.connect(mongoUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

async function mongoDisconnect() {
	await mongoose.disconnect();
}

module.exports = {
	mongoConnect,
	mongoDisconnect,
};
