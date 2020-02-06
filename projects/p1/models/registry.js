const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a geolocation schema. [longitude, latitude]
const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

// create registry Schema & model
const RegistrySchema = new Schema({
    temp: {
        type: String,
        required: [true, 'temp field is required']
    },
    humid: {
        type: String,
        required: [true, 'humid field is required']
    },
    geometry: GeoSchema
});

const Registry = mongoose.model('registry', RegistrySchema);
module.exports = Registry;