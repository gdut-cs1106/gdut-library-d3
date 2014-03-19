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
* @param sizeTr 书籍数量所在的列数
* @param indexTr 书籍索引号所在的列数
*
* @returns null 
*/
var BookPage = function (url, fileName, sizeTr, indexTr) {
    // 图书馆的域名
    var DOMAIN = 'http://222.200.98.171:81/'; 
    // 数据文件保存的目录
    var DIR = 'data/';

    this.url = DOMAIN + url;
    this.fileName = DIR+ fileName;
    this.sizeTr = sizeTr;
    this.indexTr = indexTr;
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

    // 部分月份没有数据
    if (trs.length === 0) {
        console.log(this.fileName + " has no data.");
        return;
    }

    // 第一行是表头
    for (var i = 1, length = trs.length; i < length; i++) {
        books.push({
            name: trs[i].getElementsByTagName('a')[0].innerHTML,
            href: trs[i].getElementsByTagName('a')[0].href,
            size: trs[i].children[this.sizeTr].innerHTML,
            index: trs[i].children[this.indexTr].innerHTML
        });
    }
    // 全部数据解析完再一次写入文件
    fs.writeFile(this.fileName + '.json', JSON.stringify({"books": books}));
    console.log(this.fileName + ': update finished');
}



// 要更新的书籍页面对象数组
var pages = [
    // 热门收藏
    new BookPage('mc_rank.aspx', 'mc_rank', 6, 5),
    // 热门评价
    new BookPage('user_score_rank.aspx', 'user_score_rank', 7, 5)
];


// 把年份图书数据加入 pages 数组
(function () {
    // 数据是从2007年开始有的
    var START_YEAR = 2007;
    var now = new Date();
    var nowYear = now.getFullYear();
    var date;
    for (var year = START_YEAR; year <= nowYear; year++) {
        for (var month = 1; month <= 12; month++) {
            date = year + "-" + month + "-1";
            pages.push(new BookPage(
                "bookrankresult.aspx?maxcount=200&d1=" + date +
                // 后面部分的查询字符串不影响查询结果，但是去掉的话又不能查询
                "&d2=2014-2-1&cls=&queryfile=1&yearmon=201402",
                // 文件名格式为"book-2014-3.json"
                "book-" + date, 1, 3
            ));
        }
    }
})();


// 更新数据
for (var i = 0, length = pages.length; i < length; i++) {
    update(pages[i]);
}
