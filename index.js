const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ejsLayouts = require('express-ejs-layouts')
const axios = require('axios')
const cheerio = require('cheerio')
const routes = require('./routers/data')

const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(ejsLayouts)
app.set('view engine', 'ejs')

app.use('/', routes)

app.listen(port, () => {
    console.log('Server running on port', port)
})