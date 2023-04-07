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

controller.inews = async (req, res) => {
    const keyword = req.query.keyword
    const inewsSearch = (keyword) => {
        axios.get(`https://www.inews.id/tag/${keyword}`)
        .then(function(response) {
            if(response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('ul.news-update-inews > li').each(function(i, elem) {
                    data[i] = {
                        link: $(this).find('a').attr('href'),
                        thumb: $(this).find('div > div > div > img').attr('data-original'),
                        title: $(this).find('div > div > div:nth-child(2) > div.title-news-update').text().trim(),
                        dateAndCategory: $(this).find('div > div > div:nth-child(2) > div.date').text().trim(),
                        truncate_desc: $(this).find('div > div > div:nth-child(2) > p').text().trim(),
                    } 
                })
                res.status(200).json({
                    message: `Success to get iNews in ${keyword.toUpperCase()}`,
                    data: data
                })
            }
        })
    }
    if(keyword == "trending") {
        inewsSearch(keyword)
    } 
    else if(keyword == "regional") {
        inewsSearch(keyword)
    }
    else {
        res.status(404).json({
            message: "Data not found."
        })
    }
}

module.exports = controller