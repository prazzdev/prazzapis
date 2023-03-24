const axios = require('axios')
const cheerio = require('cheerio')
controller = {}

// merdekaTrending, antaraNewsTrending, bkTopAnime, tebakGambar, animeBatch
// tenorGif, 

controller.home = async (req, res) => {
    res.redirect('https://prazzdev.github.io/prazzapis')
}

controller.bkTopAnime = async (req, res) => {
    const topAnime = "https://batchkun.com/category/top-anime/"
    axios.get(topAnime)
    .then(function(response) {
        if(response.status == 200){
            const html = response.data
            const $ = cheerio.load(html)

            let anime = []
            $('.gmr-box-content').each(function(i, elem) {
                anime[i] = {
                    url: $(this).find('.content-thumbnail a').attr('href'),
                    thumb: $(this).find('.content-thumbnail a img').attr('data-src'),
                    title: $(this).find('.item-article header h2 a').text().trim(),
                    date: $(this).find('.item-article header .entry-meta .gmr-metacontent .posted-on .updated').text().trim(),
                }
            })
            const animeList = anime.filter(n => n != undefined)
            res.status(200).json({
                data: animeList
            })
        }
    }), 
    (error) => console.log(err)
}

controller.tebakGambar = async (req, res) => {
    const tebakGambar = "https://jawabantebakgambar.net/all-answers/"
    axios.get(tebakGambar)
        .then(function(response) {
            if(response.status == 200){
                const html = response.data
                const $ = cheerio.load(html)

                let question = []
                $('ul.images li').each(function(i, elem) {
                    question[i] = {
                        image: `https://jawabantebakgambar.net` + $(this).find('li a img').attr('data-src'),
                        answer: $(this).find('li a span').text().trim(),
                    }
                })
                const questionList = question.filter(n => n != undefined && n.answer.length > 1)
                res.status(200).json({
                    data: questionList
                })
            }
        }), 
        (error) => console.log(err)
}

controller.animeBatch = async (req, res) => {
    const page1 = "https://www.animebatch.id/movies/"
    const page2 = "https://www.animebatch.id/movies/page/2/"
    const page3 = "https://www.animebatch.id/movies/page/3/"
    const page4 = "https://www.animebatch.id/movies/page/4/"
    const page5 = "https://www.animebatch.id/movies/page/5/"

    axios.get(page2)
        .then(function(response) {
            if(response.status == 200){
                const html = response.data
                const $ = cheerio.load(html)

                let data = []
                $('.box-blog').each(function(i, elem) {
                    data[i] = {
                        // no: $(this).find('a').text().trim(),,
                        thumb: $(this).find('.img a img').attr('src'),
                        title: $(this).find('.data h2 a').text().trim(),
                        desc: $(this).find('.data .exp p').text().trim(),
                        date: $(this).find('.data .auth i').text().trim(),
                        url: $(this).find('.box-blog img a').attr('href'),
                    }
                })
                const dataTrim = data.filter(n => n != undefined)
                res.status(200).json({
                    data: dataTrim
                })
            }
        }), (error) => console.log(err)
}

controller.tenorGif = async (req, res) => {
    const tenor = "https://tenor.com/search/meme-gifs"
    axios.get(tenor)
        .then(function(response) {
            if(response.status == 200){
                const html = response.data
                const $ = cheerio.load(html)

                let data = []
                $('.GifListItem').each(function(i, elem) {
                    data[i] = {
                        image: $(this).find('a .Gif img').attr('src'),
                        // answer: $(this).find('li a span').text().trim(),
                    }
                })
                const tenorTrim = data.filter(n => n.image != undefined)
                res.status(200).json({
                    data: tenorTrim
                })
            }
        }), (error) => console.log(err)
    }

controller.lirikLagu = async (req, res) => {
    const judul = req.query.title    
    if(judul == undefined){
        res.status(400).json({
            message: "Judul tidak boleh kosong!"
        })
    } else {
        console.log(`[INFO] Mencari lirik lagu "${judul.toUpperCase()}"`)
        return new Promise(async(resolve, reject) => {
            axios.get('https://www.musixmatch.com/search/' + judul)
            .then(async({ data }) => {
            const $ = cheerio.load(data)
            const hasil = {};
            let limk = 'https://www.musixmatch.com'
            const link = limk + $('div.media-card-body > div > h2').find('a').attr('href')
                await axios.get(link)
                .then(({ data }) => {
                    const $$ = cheerio.load(data)
                    hasil.thumb = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src')
                    $$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function(a,b) {
            hasil.lirik = $$(b).find('span > p > span').text() +'\n' + $$(b).find('span > div > p > span').text()
            })
        })
            resolve(hasil)
            res.status(200).json({
                data: hasil
            })
        })
        .catch(err => {
            console.log(err)
        })
        })
    }
}

// URL Shortener
controller.isgd = async (req, res) => {
    const url = req.query.url
    const options = {
        method: "GET",
        url: `https://api.akuari.my.id/short/isgd?link=${url}`
    }
    if(url == undefined){
        res.status(400).json({
            message: "URL tidak boleh kosong"
        })
    } else {
        axios.request(options).then( async (response) => {
            const oriUrl = response.data.url_asli
            const shortUrl = response.data.hasil.shorturl
            res.status(200).json({
                message: "URL Shortener",
                data: {
                    oriUrl: oriUrl,
                    shortUrl: shortUrl
                }
            })
        })
    }
}

controller.wallpaperFlare = async (req, res) => {
    const query = req.query.search
    axios.get(`https://www.wallpaperflare.com/search?wallpaper=${query}`)
        .then(function (response) {
            if (response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('ul.gallery > li').each(function (i, elem) {
                    data[i] = {
                        thumb: $(this).find('figure > a > img').attr('data-src'),
                        link: $(this).find('figure > a').attr('href')
                    }
                })
                const result = data.filter(n => n.thumb != undefined)
                res.status(200).json({
                    message: "Success",
                    data: result
                })
                console.log(`[NOTICE] Success to get data from wallpaperflare with query: ${query} (${result.length})`)
            }
        })
}

controller.wallpapersCraft = async (req, res) => {
    const search = req.query.search
    const size = req.query.size
    axios.get(`https://wallpaperscraft.com/search/?query=${search}&size=${size}`)
        .then(function (response) {
            if (response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('li.wallpapers__item').each(function (i, elem) {
                    data[i] = {
                        thumb: $(this).find('a > span > img').attr('src'),
                        fullImage: 'https://wallpaperscraft.com' + $(this).find('a').attr('href')
                    }
                })
                const result = data.filter(n => n.thumb != undefined)
                res.status(200).json({
                    message: "Success",
                    data: result,
                    other: {
                        category: "All, 3D, Abstract, Animals, Anime, Art, Black, Black and white, Cars, City, Dark, Fantasy, Flowers, Food, Holidays, Love, Macro, Minimalism, Motorcycles, Music, Nature, Other, Space, Sport, Technologies, Textures, Vector, Words",
                        size: "3840x2400, 3840x2160, 2560x1600, 2560x1440, 2560x1080, 2560x1024, 2048x1152, 1920x1200, 1920x1080, 1680x1050, 1600x900, 1440x900, 1280x800, 1280x720"
                    }
                })
            }
        })
}

module.exports = controller