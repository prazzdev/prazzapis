const axios = require('axios')
const cheerio = require('cheerio')

const wa = async (req, res) => {
    axios.get("https://www.wallpaperflare.com/search?wallpaper=anime")
        .then(function (response) {
            if (response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('ul.gallery > li').each(function (i, elem) {
                    data[i] = {
                        thumb:$(this).find('figure > a > img').attr('data-src'),
                        link: $(this).find('figure > a').attr('href')
                    }
                })
                console.log(data)
                res.status(200).json({
                    message: "Success",
                    data: data
                })
            }
        })
}

wa()