const fs = require('node:fs');
const path = require('node:path');
const parser = require('csv-parse');
const planets = require('./planets.mongo');


function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../../data', 'kepler_data.csv'))
            .pipe(parser.parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data)
                }
            })
            .on('error', (err) => reject(err))
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`${countPlanetsFound} habitable planets found!`);
                resolve();
            });
    });
}


async function getAllPlanets() {
    return await planets.find({}, { _id: 0, __v: 0 });
}


async function savePlanet(planet) {
    try {
        await
            planets.updateOne({
                keplerName: planet.kepler_name
            }, {
                keplerName: planet.kepler_name
            }, {
                upsert: true
            });
    } catch (err) {
        console.error(`cound not save a planet ${err}`);
    }
}

module.exports = {
    // loadPlanetData() call in server.js to ensure that all data exists in memory,
    // before access (getAllPlanets()) or manipulate them
    loadPlanetData,
    // getAllPlanets() call when we hit the route /planets using GET http method
    getAllPlanets
}


