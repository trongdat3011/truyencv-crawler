const request = require("request")
const cheerio = require("cheerio")
const fs = require('fs');

function makedir(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

String.prototype.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '');
};

function getContent(name, data, ord){
    const $ = cheerio.load(data)
    content = $('#js-truyencv-content')
    res = []
    if (!content['0']){
        console.log("Lỗi khi parse truyện, chương: ",ord)
        console.log("Format truyện không đúng")
        if (debug) 
            console.log(data);
        return
    }
    content['0'].children.forEach( (e) => {
        if (e.type == 'text'){
            if (e.data.trim())
                res.push(e.data.trim())
        } else res.push('')
    })
    console.log(`Tải chương ${ord} thành công`)
    fs.writeFileSync(`${mainFolder}/${name}/chuong-${ord}.txt`, res.join('\n'), 'utf-8')
}

function getChapters(name, latest, from=null, to=null){
    if (!from) {
        from = 1
        to = latest
    }
    if (!to) 
        to = from
    if (from > to)
        return console.log("Chương bắt đầu phải nhỏ hơn chương kết thúc")
    if (to > latest)
        to = latest
    for(let i=from; i<=to; i++){
        let chapter_url = `http://truyencv.com/${name}/chuong-${i}`
        setTimeout(
            () => 
            request(chapter_url, (err, res, body) => {
                console.log(`Chương ${i} at url: ${chapter_url}`)
                if (err)
                    return console.log('Error request: ', err)
                console.log("Request thành công")
                getContent(name, body, i)
            }),
            (i-from)*interval
        )
    }
}

function getTruyen(name, from=null, to=null){
    let truyen_url = `http://truyencv.com/${name}`
    request(truyen_url, (err, res, body) => {
        console.log(`Xác thực truyện: ${truyen_url}`)
        if (err){
            console.log("Có vấn đề về đường truyền, xin thử lại sau")
            return
        }
        const $ = cheerio.load(body)
        const element = $('.info .list .item .item-value a')['3']
        if (!element){
            console.log("Tên truyện không hợp lệ hoặc có vấn đề về đường truyền")
            console.log("Tên truyện phải theo format ten-truyen-khong-dau-gach-ngang-giua-cac-tu")
            return
        }
        const latest = element.attribs.href.match(/-\d+\/$/)['0'].slice(1, -1)
        console.log(`Xác thực thành công truyện: ${name}, chương mới nhất: ${latest}`)
        console.log('Bắt đầu tải truyện sau 1 giây')
        makedir(`${mainFolder}/${name}`)
        setTimeout(
            () => getChapters(name, latest, from, to),
            1000
        )
    })
}

// Pre-process
const mainFolder = process.env.saveFolder || 'truyen'
makedir(mainFolder)
const debug = process.env.debug || false
const interval = process.env.interval || 1000
// End pre-process

getTruyen(...process.argv.slice(2))
