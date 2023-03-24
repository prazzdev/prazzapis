const express = require('express')
const router = express.Router()
const controller = require('../controllers')

router.get('/', controller.data1.home)
router.get('/merdeka-trending', controller.data1.merdekaTrending)
router.get('/bk-top-anime', controller.data1.bkTopAnime)
router.get('/tebak-gambar', controller.data1.tebakGambar)
router.get('/antara-news-trending', controller.data1.antaraNewsTrending)
router.get('/anime-batch', controller.data1.animeBatch)
router.get('/tenor-gif', controller.data1.tenorGif)
router.get('/lyric', controller.data1.lirikLagu)
router.get('/isgd', controller.data1.isgd)
router.get('/wallpaperflare', controller.data1.wallpaperFlare)

module.exports = router