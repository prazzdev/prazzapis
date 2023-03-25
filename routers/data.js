const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/', controller.data1.home)
router.get('/merdeka-trending', controller.newsController.merdekaTrending)
router.get('/bk-top-anime', controller.data1.bkTopAnime)
router.get('/tebak-gambar', controller.data1.tebakGambar)
router.get('/antara-news-trending', controller.newsController.antaraNewsTrending)
router.get('/anime-batch', controller.data1.animeBatch)
router.get('/tenor-gif', controller.data1.tenorGif)
router.get('/lyric', controller.data1.lirikLagu)
router.get('/isgd', controller.data1.isgd)
router.get('/wpflare', controller.data1.wallpaperFlare)
router.get('/wpscraft', controller.data1.wallpapersCraft)
router.get('/romsgames', controller.data1.romsGames)

module.exports = router