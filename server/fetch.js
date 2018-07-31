/* 
负责爬去网站免费电影数据
*/
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const app = new Koa();
const request = require('request');
const cheerio = require('cheerio');


router.get('/', async (ctx, next) => {
    let rs = await new Promise((resolve,reject) => {
        request('http://list.iqiyi.com/www/1/----------0---11-1-1-iqiyi--.html', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //返回的body为抓到的网页的html内容
                let $ = cheerio.load(body); //当前的$符相当于拿到了所有的body里面的选择器
                let val = $('.mod-listTitle_left').map(function (i, el) {
                    // this === el
                    return $(this).html();
                }).get().join(' ');
                resolve(val);
            }
        })
    });
    ctx.body = {a:1};
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(2000, () => {
    console.log('[demo] server is starting at port 2000');
});