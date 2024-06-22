const express = require('express');
const router = express.Router();

const directorController = require('../controllers/director');

router.get('/get-directors', directorController.getDirectors);
router.get('/directors/:directorId', directorController.getDirector);
router.get('/get-director-data/:directorId', directorController.getDirectorData);

module.exports = router;