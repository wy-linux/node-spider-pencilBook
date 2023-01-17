const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')
const {getGBKResolveHtml, sleep} = require('../util')
const {headers} = require('../config')
if(!fs.existsSync('./欢迎来到实力至上主义的教室')) {
    fs.mkdirSync('./欢迎来到实力至上主义的教室')
}
//https://www.23qb.com/book/2385/?ucmidtm=1539535209.48
async function  getBookHref(url) {
    let res = await axios({
        url,
        method: 'get',
        headers
    })
    const $ =  cheerio.load(res.data) 
    let chawHrefArr = $('ul.chaw li a').map((_, item) => {
        return 'https://www.23qb.com' + item.attribs['href']
    })
    let chaw_cHrefArr = $('ul.chaw_c li a').map((_, item) => {
        return 'https://www.23qb.com' + item.attribs['href']
    })
    const bookHref = [...chawHrefArr, ...chaw_cHrefArr]
    return new Promise((resolve, reject) => {
        resolve(bookHref)
    })   
}
/**
 * 
 * @param {*} url 书籍的爬取链接
 * @param {*} contentLog 不想看爬取内容 请使用 false， 默认就是false， 可以不传
 */
async function getBookContent(url, contentLog = false) {
    const bookHref = await getBookHref(url)
    for(let i = 0; i < bookHref.length; i++) {
        console.log('爬取链接：' + bookHref[i]);
        let res = await getGBKResolveHtml(bookHref[i], 'get', headers)
        // console.log(res);
        const $ =  cheerio.load(res) 
        // let name =  Buffer.from($('#mlfy_main_text h1').text(), 'GBK').toString()
        // let name = iconv.decode($('#mlfy_main_text h1').text(), 'GBK');
        let name = $('#mlfy_main_text h1').text().split(' ')[0]
        let title = `第一章 ${$('#mlfy_main_text h1').text().split(' ')[1]}`
        console.log('爬取目录：' + name + ' ' +title);
        const wr = fs.createWriteStream(`./欢迎来到实力至上主义的教室/${name}.txt`, {
            flags: 'a'
        })
        wr.write('\n\r' + title+ '\n\r')
        let n = $('#TextContent p').map((_, item) => {
            wr.write(item.children[0].data + '\n')
            //想查看爬取内容 可以将contentLog = true
            contentLog && console.log(item.children[0].data);
        })
        //爬取速度过快 会被服务端封IP，这里必须将主线程挂起 降低爬取速度
        await sleep(2000)
    }  
    // })    
}
module.exports = {
    getBookContent
}
