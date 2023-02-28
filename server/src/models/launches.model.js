const launches = new Map();

let latestFlightNumber = 100;

const launch = {
	flightNumber: 100,
	mission: 'Kepler Exploration X',
	rocket: 'Explorer IS1',
	launchDate: new Date('December 27, 2030'),
	target: 'Kepler-442 b',
	customer: ['META', 'NASA'],
	upcoming: true,
	success: true,
};

launches.set(launch.flightNumber, launch);

const existsLaunchWithId = (launchId) => launches.has(launchId);

const allLaunches = () => Array.from(launches.values());

const createLaunch = (launch) => {
	latestFlightNumber++;
	launches.set(
		latestFlightNumber,
		Object.assign(launch, {
			flightNumber: latestFlightNumber,
			customer: ['META', 'NASA'],
			upcoming: true,
			success: true,
		})
	);
};

const abortLaunchById = (launchId) => {
	const aborted = launches.get(launchId);
	aborted.upcoming = false;
	aborted.success = false;
	return aborted;
};

module.exports = {
	allLaunches,
	createLaunch,
	existsLaunchWithId,
	abortLaunchById,
};
