const express = require('express');
const router = express.Router();

const actorController = require('../controllers/actor');

router.get('/get-actors', actorController.getActors);

module.exports = router;