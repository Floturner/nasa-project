const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

async function findLaunch(filter) {
	return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
	return await findLaunch({ flightNumber: launchId });
}

async function populateLaunches() {
	try {
		console.log('Downloading launches data...');
		const response = await axios.post(SPACEX_API_URL, {
			query: {},
			options: {
				pagination: false,
				populate: [
					{
						path: 'rocket',
						select: {
							name: 1,
						},
					},
					{
						path: 'payloads',
						select: {
							customers: 1,
						},
					},
				],
			},
		});

		const launchDocs = response.data.docs;
		for (const launchDoc of launchDocs) {
			const payloads = launchDoc.payloads;
			const customers = payloads.flatMap((payload) => payload.customers);

			const launch = {
				flightNumber: launchDoc.flight_number,
				mission: launchDoc.name,
				rocket: launchDoc.rocket.name,
				launchDate: launchDoc.date_local,
				upcoming: launchDoc.upcoming,
				success: launchDoc.success,
				customers,
			};

			await saveLaunch(launch);
		}
		console.log('Launches data loaded');
	} catch (err) {
		console.log(`Error downloading launches data: ${err}`);
		throw new Error('Launches data download failed');
	}
}

async function loadLaunchesData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat',
	});

	if (firstLaunch) {
		console.log('Launches data already loaded');
	} else {
		await populateLaunches();
	}
}

async function getLastestFlightNumber() {
	const latestLaunch = await launches.findOne({}).sort('-flightNumber');

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber + 1;
}

async function saveLaunch(launch) {
	try {
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

async function getAllLaunches(skip, limit) {
	return await launches.find({}, { _id: 0, __v: 0 }).sort('flightNumber').skip(skip).limit(limit);
}

async function scheduleNewLaunch(launch) {
	const newFlightNumber = await getLastestFlightNumber();

	const newLaunch = Object.assign(launch, {
		flightNumber: newFlightNumber,
		customers: ['META', 'NASA'],
		upcoming: true,
		success: true,
	});

	const planet = await planets.findOne({
		keplerName: newLaunch.target,
	});

	if (!planet) {
		throw new Error('No matching planet found');
	}

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
	loadLaunchesData,
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById,
};
