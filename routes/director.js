const express = require('express');
const router = express.Router();

const directorController = require('../controllers/director');

router.get('/get-directors', directorController.getDirectors);
router.get('/directors/:directorId', directorController.getDirector);

module.exports = router;