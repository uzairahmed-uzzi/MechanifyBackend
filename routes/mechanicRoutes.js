const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middlewares/jwt");
const { getMechanics } = require('../controllers/mechanicController');

router.use(verifyToken)

router.post("/getMechanics",getMechanics);

module.exports = router;