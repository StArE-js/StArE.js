const cheerio = require('cheerio')
const rp = require('request-promise');
const fs= require('fs');

const scrap = (q = "", p = 0, ruta="") => {

    return new Promise(function(resolve,reject){
        const searchUrl = `https://ecosia.org/search?q=${q}&p=${p}`
        rp(searchUrl).then(
            html => {
                const $ = cheerio.load(html)
                console.log(searchUrl)
                const queryJson = {
                    q,
                    websites: [],
                    totalResults: 0,
                    currentPage: p,
                    currentResults: 0,
                    resultsFrom: p*10,
                    resultsTo: 0,
                }
                $('div.result').each((index, element) => {
                    const result = {
                        title: '',
                        snippet: '',
                        url: '',
                    }
                    result.url = $(element).find('a.result-title').attr('href')
                    result.title = $(element).find('a.result-title').text().replace("\n","").trim()
                    result.description = $(element).find('p.result-snippet').text().replace("\n","").trim()
                    if (result.url) {
                        queryJson.websites[index] = result
                        queryJson.currentResults++
                    }
                })
                queryJson.totalResults = parseInt($('div.card-title-result-count').text().replace(/\\n|results|,/g,"").trim())
                resolve(queryJson);
            },
            error => console.error(error)
        )
    });
};

module.exports = { scrap };