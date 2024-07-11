const express = require('express');
const router = express.Router();

const actorController = require('../controllers/actor');

router.get('/actors', actorController.getActors);
router.get('/actors/:actorId', actorController.getActor);
router.get('/get-actor-data/:actorId', actorController.getActorData);
router.get('/get-actors-data', actorController.getActorsData);

module.exports = router;