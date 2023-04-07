const axios = require('axios')
const cheerio = require('cheerio')
const opt = require('../options.json')
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

controller.romsGames = async (req, res) => {
    let rom = req.query.rom
    let letter = req.query.letter
    let page = req.query.page
    let roms = `Nintendo DS
    Playstation Portable
    Gameboy Advance
    GameCube
    Nintendo Wii
    Super Nintendo
    Playstation 2
    Nintendo 64
    Playstation
    Nintendo
    SEGA Genesis
    Gameboy Color
    Dreamcast
    Gameboy
    MAME 037b11
    Sega Saturn
    Atari 2600
    Microsoft Xbox
    SNK Neo Geo
    Amiga 500
    Sega Master System
    ZX Spectrum
    Game Gear
    Commodore 64
    Amstrad CPC
    TurboGrafx-16
    Capcom Play System
    Atari 800
    Nokia N Gage
    Sega 32X
    ColecoVision
    Capcom Play System 2
    MSX Computer
    WonderSwan
    Atari 7800 ProSystem
    Nintendo Pokemon Mini
    Nintendo Famicom Disk System
    Neo Geo Pocket Color
    Atari Lynx
    Intellivision
    Atari Jaguar
    MSX-2
    Nintendo Virtual Boy
    Apple II
    Atari 5200 SuperSystem
    Atari ST
    Commodore VIC20
    Sega Pico
    Capcom Play System 3
    BBC Micro
    Sega SG1000
    Magnavox Odyssey 2
    Sharp X68000
    Acorn Electron
    GCE Vectrex
    Acorn 8 bit
    Apple II GS
    Acorn Archimedes
    Nintendo 3DS
    Tangerine Oric
    Tiger Game Com
    VTech V Smile
    Dragon Data Dragon
    ColecoVision ADAM
    Sinclair ZX81
    Robotron Z1013
    Neo Geo Pocket
    Thomson MO5
    Miles Gordon Sam Coupe
    Amstrad GX4000
    Fairchild Channel F
    Watara Supervision
    Sega Visual Memory System
    Tandy Color Computer
    SuFami Turbo
    Philips Videopac
    Z-Machine Infocom
    Super Grafx
    Epoch Super Cassette Vision
    Bally Pro Arcade Astrocade
    Sharp MZ 700
    Emerson Arcadia 2001
    Commodore Plus4 C16
    VTech CreatiVision
    GamePark GP32
    Camputers Lynx
    Pel Varazdin Orao
    Memotech MTX512
    Elektronika BK
    Commodore Pet
    Entex Adventure Vision
    Mattel Aquarius
    Funtech Super Acan
    Galaksija
    Hartung Game Master
    Casio PV1000
    Interact Family Computer
    Casio Loopy
    Sega Super Control Station
    Commodore Max Machine
    Wang VS
    Luxor ABC 800
    RCA Studio II
    Kaypro II`
    if(rom === undefined){
        res.status(400).json({
            message: "rom not found!",
            guide: {
                method: "GET",
                endpoint: "/romsgames",
                params: {
                    rom: "playstation...others",
                    letter: "a...z/all",
                    page: "1..99"
                },
                other: {
                    roms: roms
                }
            }
        })
    } else {
        if(letter === undefined) {
            letter = "all"
        }
        if(page === undefined) {
            page = 1
        }
        axios.get(`https://www.romsgames.net/roms/${rom}/?letter=${letter}&page=${page}&sort=alphabetical`)
            .then( function (response) {
                if(response.status == 200) {
                    const html = response.data
                    const $ = cheerio.load(html)
                    let data = []
                    $('ul.rg-gamelist > li').each( function (i, elem) {
                        let thumb = $(this).find('a > div > img').attr('src')
                        const title = $(this).find('a > span').text().trim()
                        const link = $(this).find('a').attr('href')
                        if(thumb.length < 30){ thumb = "https://www.romsgames.net" + thumb }
                        data[i] = {
                            thumb: thumb,
                            title: title,
                            link: "https://www.romsgames.net" + link
                        }
                    })
                    const result = data.filter(n => n.thumb != undefined)
                    res.status(200).json({
                        message: "Success",
                        payload: {
                            total: result.length,
                            rom: rom,
                            sort_by: letter,
                            page: page,
                            data: result,
                            other: {
                                roms: roms
                            }
                        }
                    })
                }
            })
    }
    
}

controller.apksfree = async (req, res) => {
    const query = req.query.search
    if(query == undefined){
        res.status(404).json({
            message: "Search query can't be empty"
        })
    } else {
        axios.get(`https://androidapksfree.com/?s=${query}`)
            .then(function (response) {
                if(response.status == 200) {
                    const html = response.data
                    const $ = cheerio.load(html)
                    const link = $('div.devapk-apps-list > section').find('div.content.cursor-pointer.box-shadow').attr('onclick')
                    let rep1 = link.replace(`location.href=`,``)
                    let rep2 = rep1.replace(/'/g,``) + "download"
                    axios.get(rep2)
                        .then(async function(response) {
                            if(response.status == 200) {
                                const html = response.data
                                const $ = cheerio.load(html)
                                let data = {}
                                const title = $('div.app-icon-new').find('img').attr('alt')
                                const icon = $('div.app-icon-new').find('img').attr('src')
                                const link = $('div.download-button-main.centered-element').find('a').attr('href')
                                // const shortLink = async (param) => {
                                //     await axios.get(`https://api.shrtco.de/v2/shorten?url=${param}`)
                                //     .then(function(response) {
                                //         const datas = response.data
                                //         console.log(datas.result.short_link3)
                                //         return datas.result.short_link3
                                //     })
                                // }
                                // const shortTitle = shortLink(title)
                                // const shortUrl =  shortLink(link)
                                data = {
                                    icon: icon,
                                    title: title,
                                    link: link
                                }
                                res.status(200).json({
                                    message: "Success to get apk data",
                                    data: data,
                                    note: opt.reply.note[0]
                                })
                            }
                        })
                }
            })
    }
}

controller.rs = async (req, res) => {
    const query = "tongkol"
    axios.request({
            url: `https://cookpad.com/id/cari/${query}?event=search.typed_query`,
            method: "GET",
            headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
            // "cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=i14curq5t8omcljj1hlle52762; popCookie=1; _gid=GA1.2.1936694796.1623913934"
        }
        })
        .then(async function(response) {
            if(response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('div#main_contents > div > div:nth-child(2) > ul > li').each(function(i, elem) {
                    data[i] = {
                        title: $(this).find('div:nth-child(1) > div > div > h2 > a').text().trim(),
                        short_ingredients_desc: $(this).find('div:nth-child(1) > div > div:nth-child(2) > div > div').text().trim(),
                        author: $(this).find('div:nth-child(4) > div > span > span').text().trim(),
                        thumb: $(this).find('div:nth-child(2) > picture > img').attr('data-original'),
                        url: "https://cookpad.com" + $(this).find('div:nth-child(1) > div > div > h2 > a').attr('href'),
                    }
                })
                console.log(data)
                res.send(data)
                
            }
            console.log(response.status)
        })
}

controller.resep = async (req, res) => {
    const query = req.query.search
    // const query = "tongkol"
    if(query == undefined) {
        axios.get(`https://www.masakapahariini.com/resep/`)
        .then(function(response) {
            if(response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('._recipes-list > .row > div.col-12').each(async function (i, elem) {
                    data[i] = {
                        thumb: $(this).find('div._recipe-card > div.card > .thumbnail >  img').attr('data-src'),
                        title: $(this).find('div._recipe-card > div.card > .thumbnail >  img').attr('alt'),
                        link: $(this).find('div._recipe-card > div.card > div.card-body > h3.card-title > a').attr('href'),
                    }
                })
                console.log(data)
                let selection = Math.floor(Math.random() * 10)
                // load selection page
                axios.get(data[selection].link)
                    .then(function(response) {
                        if(response.status == 200) {
                            const html = response.data
                            const $ = cheerio.load(html)
                            let data = {}
                            data = {
                                title: $('div._recipe-header > div:nth-child(2) > div:nth-child(2) > header > h1').text().trim(),
                                desc: $('div._recipe-header > div:nth-child(2) > div:nth-child(2) > div.excerpt').text().trim(),
                                thumb: $('div._recipe-header > div:nth-child(2) > div:nth-child(2) > div.d-block > figure.recipe-image > div.image-wrapper > picture > img').attr('data-src'),
                                cook_time: $('div._recipe-header > div:nth-child(2) > div:nth-child(2) > div._recipe-features > div > div > a:nth-child(1)').text().trim(),
                                difficult: $('div._recipe-header > div:nth-child(2) > div:nth-child(2) > div._recipe-features > div > div > a:nth-child(2)').text().trim(),
                                long_desc: $('div._rich-content > p').text().trim(),
                                ingredients: $('div.ingredients > div > div._recipe-ingredients > div.d-flex').text().trim().replace(/'/g,''),
                                steps:  $('div.container > div:nth-child(3) > div:nth-child(2) > div._recipe-steps > div').text().trim()
                            }
                            // console.log(data)
                            res.send(data)
                        }
                    })
            }
        })
    } else {
        axios.get(`https://www.masakapahariini.com/resep/`)
        .then(function(response) {
            if(response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('._recipes-list > .row > div.col-12').each(async function (i, elem) {
                    data[i] = {
                        thumb: $(this).find('div._recipe-card > div.card > .thumbnail >  img').attr('data-src'),
                        title: $(this).find('div._recipe-card > div.card > .thumbnail >  img').attr('alt'),
                    }
                })
                console.log(data)
            }
        })
    }
}

controller.sof = async (req, res) => {
    axios.get(`https://survey.stackoverflow.co/2022`)
        .then(function(response) {
            if(response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                const title = $('article#section-education-educational-attainment > div > h3 > a').text().trim()
                const desc = $('article#section-education-educational-attainment > div:nth-child(2) > p').text().trim()
                const response_total = $('article#section-education-educational-attainment > div:nth-child(3) > figure.js-active > div:nth-child(2) > span').text().trim() + " responses"
                $('table#ed-levelwy3mt > tbody > tr').each(function(i, elem) {
                    data[i] = {
                        respondent_name: $(this).find(`td:nth-child(1)`).text().trim(),
                        persentase: $(this).find(`td:nth-child(2) > span:nth-child(1)`).text().trim()
                    }
                })
                res.status(200).json({
                    message: "Success to get Stackoverflow Data Survey 2022 in All Respondents Category",
                    payload: {
                        title: title,
                        desc: desc,
                        response_total: response_total,
                        data: data
                    }
                })
            }
        })
}

module.exports = controller