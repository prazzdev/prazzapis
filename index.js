const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routers/data')

const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes)

app.listen(port, () => {
    console.log('Server running on port', port)
})