const { allPlanets } = require('../../models/planets.model');

const getAllPlanets = (_req, res) => {
	return res.status(200).json(allPlanets);
};

module.exports = {
	getAllPlanets,
};
