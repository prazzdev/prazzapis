const axios = require('axios')
const cheerio = require('cheerio')

const lirikSholawat = async (req, res) => {
    axios.get(`https://www.dutaislam.com/search?q=busyro%20lana`)
        .then(function(response) {
            const html = response.data
            const $ = cheerio.load(html)

            let data = []
            $('.post-body').each( function(i, elem) {
                data[i] = {
                    thumb: $(this).find('.img-thumbnail > a > img').attr('src'),
                    title: $(this).find('.post-title > a').text().trim(),
                    link: $(this).find('.post-title > a').attr('href')
                }
            })
            console.log(data[0].link)
            axios.get(data[0].link)
                .then( async (response) => {
                    console.log(response)
                    const html = response.data
                    const $ = cheerio.load(html)

                    const data = []
                    $('.post12305138473561912603').each( async (i, elem) => {
                        data[i] = {
                            lirik: $(this).find('div').text().trim()
                        }
                    })
                    console.log(data)
                })
        })
}

lirikSholawat()