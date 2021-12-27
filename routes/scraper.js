var express = require('express');
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var scraper_controller = require('../controllers/scraper');


// a simple test url to check that all of our files are communicating correctly.
router.get('/24ur', async (req, res) => {
    let articles = await scraper_controller.scrape24ur();
    res.send(articles);
});

router.get('/delo', async (req, res) => {
    let articles = await scraper_controller.scrapeDelo();
    res.send(articles);
});

router.get('/siol', async (req, res) => {
    let articles = await scraper_controller.scrapeSiol();
    res.send(articles);
});

router.get('/slovenskenovice', async (req, res) => {
    let articles = await scraper_controller.scrapeSlovenskeNovice();
    res.send(articles);
});

router.get('/dnevnik', async (req, res) => {
    let articles = await scraper_controller.scrapeDnevnik();
    res.send(articles);
});

router.get('/all', async (req, res) => {
    let stirindvajstur = await scraper_controller.scrape24ur();
    let delo = await scraper_controller.scrapeDelo();
    let siol = await scraper_controller.scrapeSiol();
    let slovenskenovice = await scraper_controller.scrapeSlovenskeNovice();
    
    let articles = [...stirindvajstur, ...delo, ...siol, ...slovenskenovice];
   
    articles.sort((a, b) => b.timestamp - a.timestamp);

    let dbArticles = await scraper_controller.readArticles();

    res.send(articles);
});

/*router.post('/create', scraper_controller.product_create);

router.get('/:id', scraper_controller.product_details);

router.put('/:id/update', scraper_controller.product_update);

router.delete('/:id/delete', scraper_controller.product_delete);*/


module.exports = router;