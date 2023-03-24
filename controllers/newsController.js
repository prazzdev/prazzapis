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

module.exports = controller