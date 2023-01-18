// const launchesMongo = require('./launches.mongo');
const launchesDatabse = require('./launches.mongo');
const planetsDatabse = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

// ------------------------------------------- Functions Declaration
async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabse
        .findOne()
        .sort('-flightNumber');
    return latestLaunch ? latestLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER;
}


async function getAllLaunches() {
    return await launchesDatabse.find({}, { _id: 0, __v: 0 });
    // return await launchesDatabse.find({});
}


async function saveLaunch(launch) {

    const planet = await planetsDatabse.find({
        keplerName: launch.target
    }).maxTimeMS(120000);

    if (!planet) {
        throw new Error("NO MATCHING PLANET")
    }

    // findOneAndUpdate() only return properties that we set in second
    // argument. (not _id or __v)
    await launchesDatabse.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, { upsert: true });
}


async function schedulaNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['HMD', 'NASA'],
        upcoming: true,
        success: true
    });

    await saveLaunch(newLaunch);
}

async function isExistsLaunchWithId(launchId) {
    return await launchesDatabse.findOne({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabse.updateOne(
        { flightNumber: launchId },
        { upcoming: false, success: false }
        // { $set: { upcoming: false, success: false } }
    );
    return aborted.acknowledged === true && aborted.modifiedCount;
}

// ------------------------------------------------------------

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'Hamidreza'],
    upcoming: true,
    success: true,
}


async function initFirstLaunch() {
    await saveLaunch(launch);
}
initFirstLaunch();

console.log('+++++++++++++++ launches.model.js LOADED ++++++++++++++++++++');


module.exports = {
    getAllLaunches,
    schedulaNewLaunch,
    abortLaunchById,
    isExistsLaunchWithId,
}