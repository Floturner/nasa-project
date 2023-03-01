const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(_req, res) {
	return res.status(200).json(await getAllPlanets());
}

module.exports = {
	httpGetAllPlanets,
};
