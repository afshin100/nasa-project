const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');


describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
    });

    // afterAll(async () => {
    //     await mongoDisconnect();
    // });

    describe('Test GET /launches', () => {
        test('It should response with 200 success', async () => {
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            // above "expect" method is for supertest library 
            // and below one is for jest:
            // expect(response.statusCode).toBe(200);
            // supertest library have it own assertions too :)
        })
    });


    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: 'IRR Enterprise',
            rocket: 'NCC 714-A',
            target: 'Kepler-62 f',
            launchDate: 'January 4 ,2028'
        };
        const launchDataWithoutDate = {
            mission: 'IRR Enterprise',
            rocket: 'NCC 714-A',
            target: 'Kepler-62 f',
        };
        const launchDataWithInvalidDate = {
            mission: 'IRR Enterprise',
            rocket: 'NCC 714-A',
            target: 'Kepler-62 f',
            launchDate: 'this is invalid date! :('
        };

        test('It should response with 201 created', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(requestDate).toBe(responseDate);

            expect(response.body).toMatchObject(launchDataWithoutDate);
        });


        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                status: 'fail',
                error: 'Missing required launch property',
            });
        });


        test('it should catch invalid dates', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                status: 'fail',
                error: "invalid launchDate format"
            });
        });

    }); // Test POST /launch

}); // Launch API


