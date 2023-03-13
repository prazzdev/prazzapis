const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/merdeka-trending', controller.data1.merdekaTrending)
router.get('/bk-top-anime', controller.data1.bkTopAnime)
router.get('/tebak-gambar', controller.data1.tebakGambar)

module.exports = router