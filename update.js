var jsdom = require('jsdom');
var fs = require('fs');

/**
* @synopsis 更新数据
*
* @param page 要更新的页面对象
*
* @returns  null 
*/
var update = function (page) {
    jsdom.env(page.url, function (errors, window) {
        page.parse(errors, window);
    });
    console.log(page.fileName + ': updating…');
}

/**
* @synopsis 书籍页面对象
*
* @param url 页面 url （不包括域名）
* @param fileName 要保存的文件名
* @param countTr 书籍数量所在的列数
*
* @returns null 
*/
var BookPage = function (url, fileName, countTr) {
    // 图书馆的域名
    var DOMAIN = 'http://222.200.98.171:81/'; 
    // 数据文件保存的目录
    var DIR = 'data/';

    this.url = DOMAIN + url;
    this.fileName = DIR+ fileName;
    this.countTr = countTr;


}

/**
* @synopsis 书籍页面对象原型的页面解析函数 
*
* @param errors 从 jsdom.env 传过来的参数，解析页面出错时的错误
* @param window 从 jsdom.env 传过来的参数，解析页面后得到的 window 对象
*
* @returns null 
*/
BookPage.prototype.parse = function (errors, window) {
    var books = [];
    var trs = window.document.getElementsByTagName('tr');

    // 第一行是表头
    for (var i = 1, length = trs.length; i < length; i++) {
        books.push({
            title: trs[i].getElementsByTagName('a')[0].innerHTML,
            href: trs[i].getElementsByTagName('a')[0].href,
            count: trs[i].children[this.countTr].innerHTML
        });
    }
    // 全部数据解析完再一次写入文件
    fs.writeFile(this.fileName + '.json', JSON.stringify(books));
    console.log(this.fileName + ': update finished');
}



// 要更新的书籍页面对象数组
var pages = [
    new BookPage('mc_rank.aspx', 'mc_rank', 6),
    new BookPage('user_score_rank.aspx', 'user_score_rank', 7)
];


// 更新数据
for (var i = 0, length = pages.length; i < length; i++) {
    update(pages[i]);
}
