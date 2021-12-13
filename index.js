const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const scrapperHelper = require('./scraper')

const scraperRouter = require('./routes/scraper');


const port = 5000

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/scraper', scraperRouter);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))

/*app.get('/scraper', (req, res) => {
    res.send(scrapperHelper.scrapSlovenskeNovice())
})*/
