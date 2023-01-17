const axios = require('axios');
const iconv = require('iconv-lite');
// axios 抓取GBK编码格式会 出现乱码， 这里封装iconv-lite解析GBK编码
async function getGBKResolveHtml(url, method = 'get', headers) {
    let res = await axios({
        url,
        method,
        headers,
        responseType : 'stream'
    })
    let chunks = [];
    let resDecodeGBK
    return new Promise((resolve, reject) => {
        res.data.on('data',chunk=>{
            chunks.push(chunk);
        });
        res.data.on('end',()=>{
            let buffer = Buffer.concat(chunks);
            //通过iconv来进行转化。
            resDecodeGBK = iconv.decode(buffer,'gbk');
            resolve(resDecodeGBK)
        })
    })
}
async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('延时' + time +'ms')
            console.log('\n\r延时' + time +'ms\n\r');
        }, time);
    })
}
module.exports = {
    getGBKResolveHtml,
    sleep
}