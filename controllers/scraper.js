const axios = require('axios')
const cheerio = require('cheerio');
const { next } = require('cheerio/lib/api/traversing');

const settings = {
    providers: [
        {
            name: '24ur',
            url: 'https://www.24ur.com/sveze',
            baseUrl: 'https://www.24ur.com'
        },
        {
            name: 'delo',
            url: 'https://www.delo.si/zadnje/',
            baseUrl: 'https://www.delo.si'
        },
        {
            name: 'siol',
            url: 'https://siol.net/pregled-dneva/',
            baseUrl: 'https://siol.net'
        },
        {
            name: 'slovenskeNovice',
            url: 'https://www.slovenskenovice.si/zadnje/',
            baseUrl: 'https://www.slovenskenovice.si'
        },
        {
            name: 'dnevnik',
            url: 'https://www.dnevnik.si/zadnje-novice',
            baseUrl: 'https://www.dnevnik.si'
        }
    ]
}

exports.scrape24ur = async function(req, res) {
    const provider = settings.providers.find(provider => provider.name === "24ur");
    const articlesResponse = await axios(provider.url);
    var $ = cheerio.load(articlesResponse.data);
    const articles = [];
    const timeline = await $('.timeline');

    $('.timeline__item', timeline).each(function() {
        const source = '24ur';
        const url = provider.baseUrl + $(this).attr('href');
        const title = $(this).find('.card__title-inside').text().trim();
        const date = $(this).find('.timeline__date').text().trim();
        let time = $(this).find('.timeline__time').text().trim();
        time = time.split(' ').pop();
        const summary = $(this).find('.card__summary').text().trim();
        const category = $(this).find('.card__label').text().trim();
        const image = $(this).find('img').attr('src');

        articles.push({
            source,
            url,
            title,
            date,
            time,
            summary,
            category,
            image
        });
    });
    return articles;
}

exports.scrapeDelo = async function(req, res) {
    const provider = settings.providers.find(provider => provider.name === "delo");
    const articlesResponse = await axios(provider.url);
    var $ = cheerio.load(articlesResponse.data);
    const articles = [];
    const timeline = await $('.timeline');

    $('.paginator_item', timeline).each(function() {
        const source = 'Delo';
        let url = $(this).find('.article_teaser_timeline__title_link').attr('href');
        if (extractHostname(url) == "") {
            url = provider.baseUrl + url;
        }
        const title = $(this).find('.article_teaser_timeline__title_text').text().trim();
        const date = $(this).find('.article_teaser_timeline__date_holder').text().trim();
        const time = $(this).find('.article_teaser_timeline__time_holder').text().trim();
        const summary = $(this).find('.article_teaser_timeline__subtitle_text').text().trim();
        const category = $(this).find('.article_supertitle').text().trim();

        articles.push({
            source,
            url,
            title,
            date,
            time,
            summary,
            category
        });
    })

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const articleResponse = await axios(article.url);
        const $ = cheerio.load(articleResponse.data);
        const image =  await 'https://' + extractHostname(article.url) + $('.article__img_tag').attr('src');
        article.image = image;
    }
    return articles;
}

exports.scrapeSiol = async function() {
    const provider = settings.providers.find(provider => provider.name === "siol");
    const articlesResponse = await axios(provider.url);
    var $ = cheerio.load(articlesResponse.data);
    const articles = [];
    const timeline = await $('.timemachine__article_list');

    $('.timemachine__article_item', timeline).each(function() {
        const source = 'Siol';
        const url = provider.baseUrl + $(this).find('.card__link').attr('href');
        const title = $(this).find('.card__title').text().trim();
        const today = new Date();
        const date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
        const time = $(this).find('.card__time').text().trim();
        const summary = $(this).find('.card__description').text().trim();
        const category = $(this).find('.card__overtitle').text().trim();
        const image = provider.baseUrl + $(this).find('.rspimg').attr('src');

        articles.push({
            source,
            url,
            title,
            date,
            time,
            summary,
            category,
            image
        });
    })
    return articles;
}

exports.scrapeSlovenskeNovice = async function(req, res) {
    const provider = settings.providers.find(provider => provider.name === "slovenskeNovice");
        const articlesResponse = await axios(provider.url);
        var $ = cheerio.load(articlesResponse.data);
        const articles = [];
        const timeline = await $('.timeline__section');

        $('.paginator_item', timeline).each(function() {
            let url = $(this).find('.article_teaser_timeline__title_link').attr('href');
            if (extractHostname(url) == "") {
                url = provider.baseUrl + url;
            
                const source = 'Slovenske Novice';
                const title = $(this).find('.article_teaser_timeline__title_text').text().trim();
                const summary = $(this).find('.article_teaser_timeline__subtitle_text').text().trim();
                const date = $(this).find('.article_teaser_timeline__date_holder').text().trim();
                const time = $(this).find('.article_teaser_timeline__time_holder').text().trim();
                //ADD CATEGORY
                const category = extractUrlCategory(url);

                articles.push({
                    source,
                    url,
                    title,
                    date,
                    time,
                    summary,
                    category
                });
            }
        })

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            const articleResponse = await axios(article.url);
            const $ = cheerio.load(articleResponse.data);
            const image =  await provider.baseUrl + $('.article__img_tag').attr('src');
            article.image = image;
        }
    return articles;
}

// NOT WORKING - can't find elements inside timeline
exports.scrapeDnevnik = async function () {
    const provider = settings.providers.find(provider => provider.name === "dnevnik");
    const articlesResponse = await axios(provider.url);

    var $ = cheerio.load(articlesResponse.data);
    const articles = [];

    $('.tl-article', articlesResponse.data).each(function() {
        const source = "Dnevnik";
        const url = provider.baseUrl + $(this).find('h2 > a').attr('href');
        const title = $(this).find('h2 > a').text().trim();
        const summary = $(this).find('p').text().trim();
        const category = $(this).find('.news-item-category').text().trim();
        const image = provider.baseUrl + $(this).find('img').attr('src');

        articles.push({
            source,
            url,
            title,
            summary,
            category,
            image
        });
    })
    return articles;
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function extractUrlCategory(url) {
    var category;

    category = url.split('/');

    return category[3];
}

exports.uploadArticles = function (req, res) {
    console.log("uploading...")
}