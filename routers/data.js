const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/merdeka-trending', controller.data1.merdekaTrending)

module.exports = router