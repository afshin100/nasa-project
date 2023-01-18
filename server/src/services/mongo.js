const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:OH7f9BkuyYdZ7cyv@nasacluster.9unvzvz.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.set('strictQuery', true); // CHECK

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', err => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
    // console.log(mongoose.connection.readyState);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}
