require('dotenv').config();

module.exports = {
	port: process.env.PORT || 8000,
	mongoUrl: process.env.MONGO_URL,
};
