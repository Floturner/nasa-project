const {
	allLaunches,
	createLaunch,
	existsLaunchWithId,
	abortLaunchById,
} = require('../../models/launches.model');

const getAllLaunches = (_req, res) => {
	return res.status(200).json(allLaunches);
};

const addNewLaunch = (req, res) => {
	const launch = req.body;

	if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
		return res.status(400).json({
			error: 'Missing required launch properties',
		});
	}

	launch.launchDate = new Date(launch.launchDate);
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: 'Invalid launch date',
		});
	}

	createLaunch(launch);
	res.status(201).json(launch);
};

const abortLaunch = (req, res) => {
	const launchId = Number(req.params.id);

	if (!existsLaunchWithId(launchId)) {
		res.status(404).json({
			error: 'Launch not found',
		});
	}

	const aborted = abortLaunchById(launchId);
	res.status(200).json(aborted);
};

module.exports = {
	getAllLaunches,
	addNewLaunch,
	abortLaunch,
};
