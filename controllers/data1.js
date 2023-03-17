const axios = require('axios')
const cheerio = require('cheerio')
controller = {}

// merdekaTrending, antaraNewsTrending, bkTopAnime, tebakGambar, animeBatch

controller.home = async (req, res) => {
    res.redirect('https://prazzdev.github.io/prazzapis')
}

controller.merdekaTrending = async (req, res) => {
    axios.get('https://www.merdeka.com/trending')
    .then(function(response) {
        if(response.status == 200){
            const html = response.data
            const $ = cheerio.load(html)

            let detikList = []
            $('.clearfix').each(function(i, elem) {
                detikList[i] = {
                    // no: $(this).find('a').text().trim(),
                    title: $(this).find('.meta-content div h3 a').text().trim(),
                    url: `https://merdeka.com${$(this).find('.meta-content div h3 a').attr('href')}`,
                    date: $(this).find('.meta-content div .mdk-body-newsimg-date').text().trim(),
                }
            })
            const detikListTrim = detikList.filter(n => n.title.length > 2 && n.title.length < 200)
            // fs.writeFile('data/merdeka.json',
            // JSON.stringify(detikListTrim, null, 4), (err) => {
            //     console.log('Write scrapping is Success')
            // })
            res.status(200).json({
                data: detikListTrim
            })
        }
    }), 
    (error) => console.log(err)
}

controller.antaraNewsTrending = async (req, res) => {
    axios.get('https://www.antaranews.com/indeks')
    .then(function(response) {
        if(response.status == 200){
            const html = response.data
            const $ = cheerio.load(html)

            let detikList = []
            $('.simple-post').each(function(i, elem) {
                detikList[i] = {
                    // no: $(this).find('a').text().trim(),,
                    thumb: $(this).find('.simple-thumb a img').attr('data-src'),
                    title: $(this).find('header h3 a').text().trim(),
                    url: $(this).find('header h3 a').attr('href'),
                    date: $(this).find('.simple-share span').text().trim(),
                }
            })
            const detikListTrim = detikList.filter(n => n != undefined)
            console.log(detikListTrim)
        }
    }), (error) => console.log(err)
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

controller.lirikSholawat = async (req, res) => {
    axios.get(`https://www.dutaislam.com/search?q=lirik`)
        .then(function(response) {
            console.log(response)
        })
}


module.exports = controller