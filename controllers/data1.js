const axios = require('axios')
const cheerio = require('cheerio')
controller = {}

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







module.exports = controller