const express = require('express');
const router = express.Router();
const Registry = require('../models/registry');

// app.<get|delete|post|put>


// get a list of registries from the database
router.get('/registries', function (req, res, next) {
    /*Registry.find({}).then(function(registries){
        res.send(registries);
    });//*/
    Registry.aggregate().near({
        near: { type: "Point", coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)] },
        maxDistance: 300000, spherical: true, distanceField: "distance"
    }
    ).then(function (registries) {
        res.send(registries);
    });
});

// add a new registry to the db
router.post('/registries', function (req, res, next) {
    Registry.create(req.body).then(function (registry) {
        res.send(registry);
    }).catch(next);
});

// update a registry in the db
router.put('/registries/:id', function (req, res, next) {
    Registry.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        Registry.findOne({ _id: req.params.id }).then(function (registry) {
            res.send(registry);
        });
    });
});

// delete a registry from the db
router.delete('/registries/:id', function (req, res, next) {
    Registry.findByIdAndRemove({ _id: req.params.id }).then(function (registry) {
        res.send(registry);
    });
});

module.exports = router;