const http = require('http');
const { port } = require('./services/venv');
const { mongoConnect } = require('./services/mongo');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const server = http.createServer(app);

const startServer = async () => {
	await mongoConnect();
	await Promise.all([loadPlanetsData(), loadLaunchesData()]);

	server.listen(port, () => {
		console.log(`Server listening on port ${port}...`);
	});
};

startServer();
