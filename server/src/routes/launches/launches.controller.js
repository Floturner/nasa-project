const {
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(_req, res) {
	return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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

	await scheduleNewLaunch(launch);
	res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
	const launchId = Number(req.params.id);

	const existsLaunch = await existsLaunchWithId(launchId);
	if (!existsLaunch) {
		res.status(404).json({
			error: 'Launch not found',
		});
	}

	const aborted = await abortLaunchById(launchId);
	if (!aborted) {
		res.status(400).json({
			error: 'Launch not aborted',
		});
	}

	res.status(200).json({ ok: true });
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
};