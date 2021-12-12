const axios = require('axios')
const cheerio = require('cheerio')

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
        }
    ]
}

module.exports = {
    scrap24ur: () => {
    const provider = settings.providers.find(provider => provider.name === "24ur");
      axios(provider.url)
        .then(async (response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const news = []
            
            const timeline = await $('.timeline');

            $('.timeline__item', timeline).each(function() {
                const url = provider.baseUrl + $(this).attr('href')
                const title = $(this).find('.card__title-inside').text()
                const summary = $(this).find('.card__summary').text()
                const category = $(this).find('.card__label').text()
                const image = provider.baseUrl + $(this).find('img').attr('src')

                news.push({
                    url,
                    title,
                    summary,
                    category,
                    image
                })
            })
            console.log(news)
        })

    },
  
    scrapDelo: async () => {
        const provider = settings.providers.find(provider => provider.name === "delo");
        const articlesResponse = await axios(provider.url);
        var $ = cheerio.load(articlesResponse.data)
        const articles = []
        const timeline = await $('.timeline');

        $('.paginator_item', timeline).each(function() {
            const url = provider.baseUrl + $(this).find('.article_teaser_timeline__title_link').attr('href')
            const title = $(this).find('.article_teaser_timeline__title_text').text().trim()
            const summary = $(this).find('.article_teaser_timeline__subtitle_text').text().trim()
            const category = $(this).find('.article_supertitle').text().trim()

            articles.push({
                url,
                title,
                summary,
                category
            })
        })

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            const articleResponse = await axios(article.url);
            const $ = cheerio.load(articleResponse.data)
            const image =  await provider.baseUrl + $('.article__img_tag').attr('src');
            article.image = image;
        }
        console.log(articles)
    },

    scrapSiol: async () => {
        const provider = settings.providers.find(provider => provider.name === "siol");
        const articlesResponse = await axios(provider.url);
        var $ = cheerio.load(articlesResponse.data)
        const articles = []
        const timeline = await $('.timemachine__article_list');

        $('.timemachine__article_item', timeline).each(function() {
            const url = provider.baseUrl + $(this).find('.card__link').attr('href')
            const title = $(this).find('.card__title').text().trim()
            const summary = $(this).find('.card__description').text().trim()
            const category = $(this).find('.card__overtitle').text().trim()
            const image = provider.baseUrl + $(this).find('.rspimg').attr('src')

            articles.push({
                url,
                title,
                summary,
                category,
                image
            })
        })
        console.log(articles)
    }
  };