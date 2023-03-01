const http = require('http');
const { port } = require('./services/venv');
const { mongoConnect } = require('./services/mongo');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const server = http.createServer(app);

const startServer = async () => {
	await mongoConnect();
	await loadPlanetsData();

	server.listen(port, () => {
		console.log(`Server listening on port ${port}...`);
	});
};

startServer();
