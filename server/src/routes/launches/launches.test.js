const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API', () => {
	beforeAll(async () => {
		await mongoConnect();
		await loadPlanetsData();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('GET /launches', () => {
		test('should respond with 200 success', async () => {
			await request(app).get('/v1/launches').expect('Content-Type', /json/).expect(200);
		});
	});

	describe('POST /launches', () => {
		const launchDataWithoutDate = {
			mission: 'USS Marchal',
			rocket: 'NCC 1801-A',
			target: 'Kepler-62 f',
		};
		const completeLaunchData = {
			...launchDataWithoutDate,
			launchDate: 'January 4, 2026',
		};
		const launchDataWithInvalidDate = {
			...launchDataWithoutDate,
			launchDate: 'Hello',
		};

		test('should respond with 201 success', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(completeLaunchData)
				.expect('Content-Type', /json/)
				.expect(201);

			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();

			expect(responseDate).toBe(requestDate);

			expect(response.body).toMatchObject(launchDataWithoutDate);
		});

		test('should catch missing required propreties', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(launchDataWithoutDate)
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: 'Missing required launch properties',
			});
		});

		test('should catch invalid dates', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(launchDataWithInvalidDate)
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: 'Invalid launch date',
			});
		});
	});
});
