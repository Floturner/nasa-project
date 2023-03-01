const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let DEFAULT_FLIGHT_NUMBER = 100;

async function existsLaunchWithId(launchId) {
	return await launches.findOne({ flightNumber: launchId });
}

async function getLastestFlightNumber() {
	const latestLaunch = await launches.findOne({}).sort('-flightNumber');

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber + 1;
}

async function getAllLaunches() {
	return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
	try {
		const planet = await planets.findOne({
			keplerName: launch.target,
		});

		if (!planet) {
			throw new Error('No matching planet found');
		}

		await launches.findOneAndUpdate(
			{
				flightNumber: launch.flightNumber,
			},
			launch,
			{
				upsert: true,
			}
		);
	} catch (err) {
		console.error(`Could not save launch ${err}`);
	}
}

async function scheduleNewLaunch(launch) {
	const newFlightNumber = await getLastestFlightNumber();

	const newLaunch = Object.assign(launch, {
		flightNumber: newFlightNumber,
		customers: ['META', 'NASA'],
		upcoming: true,
		success: true,
	});

	await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
	const aborted = await launches.updateOne(
		{ flightNumber: launchId },
		{
			upcoming: false,
			success: false,
		}
	);

	return aborted.acknowledged && aborted.modifiedCount === 1;
}

module.exports = {
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
};
