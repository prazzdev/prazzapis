const axios = require('axios')
const cheerio = require('cheerio')
controller = {}

controller.tokopedia = async (req, res) => {
    const keyword = req.query.keyword
    const page = req.query.page
    const shopTier = req.query.shop_tier
    const priceMin = req.query.min_harga
    const priceMax = req.query.max_harga
    const cashback = req.query.cashbackm
    const condition = req.query.condition
    const bundling = req.query.bundling
    const freeShipping = req.query.free_shipping
    const cod = req.query.cod
    const discount = req.query.discount
    const grosir = req.query.grosir
    let condText
    if(condition == 1){condText = "Baru"}else{condText = "Bekas"}
    axios.get(`https://www.tokopedia.com/search?page=${page}&q=${keyword}&shop-tier=${shopTier}&pmax=${priceMax}&pmin=${priceMin}&condition=${condition}&bundling=${bundling}&cashbackm=${cashback}&cod=${cod}&free_shipping=${freeShipping}&is_discount=${discount}&wholesale=${grosir}`)
        .then(function(response) {
            if(response.status == 200) {
                const html = response.data
                const $ = cheerio.load(html)
                let data = []
                $('div.pcv3__container').each(async function (i, elem) {
                    data[i] = {
                        thumb: $(this).find("div > a > div > img").attr("src"),
                        title: $(this).find(".prd_link-product-name").text().trim(),
                        price: $(this).find(".prd_link-product-price").text().trim(),
                        label: $(this).find(".prd_label-product-price").text().trim() ? $(this).find(".prd_label-product-price").text().trim() : "---",
                        condition: condText,
                        prod_rating: $(this).find(".prd_rating-average-text").text().trim() ? $(this).find(".prd_rating-average-text").text().trim() : "---",
                        prod_sold: $(this).find(".prd_label-integrity").text().trim() ? $(this).find(".prd_label-integrity").text().trim() : "---",
                        // shop_loc: $(this).find(".prd_link-shop-loc").text().trim(),
                        // shop_name: $(this).find(".prd_link-shop-name").text().trim(),
                    }
                })
                res.status(200).json({
                    message: `Success to get Tokopedia product data with keyword ${keyword}`,
                    options: {
                        page: page,
                    },
                    payload: data
                })
            }
        })
}

module.exports = controller