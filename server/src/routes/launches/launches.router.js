const express = require('express');
const { getAllLaunches, addNewLaunch, abortLaunch } = require('./launches.controller');

const router = express.Router();

router.get('/', getAllLaunches);
router.post('/', addNewLaunch);
router.delete('/:id', abortLaunch);

module.exports = router;
