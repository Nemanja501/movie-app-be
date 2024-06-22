const express = require('express');
const router = express.Router();

const actorController = require('../controllers/actor');

router.get('/get-actors', actorController.getActors);
router.get('/actors/:actorId', actorController.getActor);
router.get('/get-actor-data/:actorId', actorController.getActorData);

module.exports = router;