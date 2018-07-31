// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const koaApp = new Koa();
const request = require('request');
const cheerio = require('cheerio');
const cors = require('cors');
const scoreLimit = 8;
// app.prepare().then(() => {
//     createServer((req, res) => {
//         // Be sure to pass `true` as the second argument to `url.parse`.
//         // This tells it to parse the query portion of the URL.
//         const parsedUrl = parse(req.url, true)
//         const { pathname, query } = parsedUrl

//         if (pathname === '/') {
//             app.render(req, res, '/', query)
//         } else if (pathname === '/about') {
//             app.render(req, res, '/about', query)
//         } else {
//             handle(req, res, parsedUrl)
//         }
//     }).listen(3000, err => {
//         if (err) throw err
//         console.log('> Ready on http://localhost:3000')
//     })
// })
app.prepare().then(() => {
    router.get('/', async (ctx, next) => {
        let rs = await app.render(ctx.req, ctx.res, '/', {id:1});
        ctx.body = rs;
    });
    router.get('/about', async (ctx, next) => {
        let rs = await app.render(ctx.req, ctx.res, '/about', { id: 1 });
        ctx.body = rs;
    });
    router.get('/getuser', async (ctx, next) => {
        let pageIndex = ctx.query.pageIndex || 1;

        let rs = await new Promise((resolve, reject) => {
            request(`http://list.iqiyi.com/www/1/----------0---11-${pageIndex}-1---.html`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //返回的body为抓到的网页的html内容
                    let $ = cheerio.load(body); //当前的$符相当于拿到了所有的body里面的选择器
                    let val = $('.site-piclist li').map(function (i, el) {
                        let $a = $(this).find('.movie-tit a');
                        let obj = {
                            name: $a.text().replace(/\s/g,''),
                            url: $a.attr('href'),
                            score: $(this).find('.score').text(),
                            imgUrl: $(this).find('img').attr('src')
                        }
                        // this === el
                        return obj;
                    }).get().filter(v => v.score >= scoreLimit);
                    resolve(val);
                }
            })
        });
        ctx.body = {films:rs};
    });
    
    router.get('*', async (ctx, next) => {
        let rs = await handle(ctx.req, ctx.res);
        ctx.body = '{a:11}';
    });

    koaApp.use(router.routes()).use(router.allowedMethods());
    koaApp.use(cors());
    koaApp.listen(3000, () => {
        console.log('[demo] server is starting at port 3000');
    });
});