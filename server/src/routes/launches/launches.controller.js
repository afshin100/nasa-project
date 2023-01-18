const {
    getAllLaunches,
    schedulaNewLaunch,
    abortLaunchById,
    isExistsLaunchWithId
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res, next) {
    return res.status(200).json(await getAllLaunches());
}


async function httpAddNewLaunch(req, res, next) {
    const newLaunch = req.body;
    if (
        !newLaunch.mission ||
        !newLaunch.rocket ||
        !newLaunch.launchDate ||
        !newLaunch.target
    ) {
        return res.status(400).json({
            status: 'fail',
            error: 'Missing required launch property',
        })
    }

    newLaunch.launchDate = new Date(newLaunch.launchDate);
    // if condition also can be: isNaN(newLaunch.launchDate)
    if (newLaunch.launchDate.toString() === 'Invalid Date') {
        return res.status(400).json({
            status: 'fail',
            error: "invalid launchDate format"
        });
    }

    await schedulaNewLaunch(newLaunch);
    return res.status(201).json(newLaunch);
}


async function httpAbortLaunch(req, res, next) {
    const launchId = Number(req.params.id);

    const existsLaunch = await isExistsLaunchWithId(launchId);
    if (!existsLaunch) {
        return res.status(404).json({
            error: 'launch not found'
        });
    }

    const isAborted = await abortLaunchById(launchId);

    if (!isAborted) {
        return res.status(400).json({
            status: 'fail',
            error: 'launch not aborted'
        });
    }

    return res.status(200).json({
        status: 'success',
        aborted: isAborted
    });

}



module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
} 