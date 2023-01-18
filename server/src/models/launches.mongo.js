const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: [true, 'FlightNumber required'],
        // unique: true,
        // default: 100,
        // min: [100, 'The minimum flight number should be 100'],
        // max: [999, 'The maximum flight number should be 999']
    },
    launchDate: {
        type: Date,
        require: [true, 'LaunchDate required']
    },
    mission: {
        type: String,
        require: [true, 'Mission required']
    },
    rocket: {
        type: String,
        required: [true, 'Rocket requierd']
    },
    // This approach add complexitie and not needed for our project
    // then we embed target not refrence like this
    // target: {
    //     type: mongoose.ObjectId,
    //     ref: 'Planet'
    // },
    target: {
        type: String,
        required: [true, 'taget required']
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: [true, 'upcoming required']
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
});

// connect launchesSchema with the "launches" collection
module.exports = mongoose.model('Launch', launchesSchema); 