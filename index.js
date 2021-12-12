const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const scrapperHelper = require('./scraper')


const port = 5000

const app = express()

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))

app.get('/scraper', (req, res) => {
    res.send(scrapperHelper.scrapSiol())
})
