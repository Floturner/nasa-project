const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Planets API', () => {
	beforeAll(async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('GET /planets', () => {
		test('should respond with 200 success', async () => {
			await request(app).get('/v1/planets').expect('Content-Type', /json/).expect(200);
		});
	});
});
