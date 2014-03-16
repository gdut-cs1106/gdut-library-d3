var jsdom = require('jsdom');
var fs = require('fs');

var popularCollect = {
    url: 'http://222.200.98.171:81/mc_rank.aspx',
    fileName: 'mc_rank.json',
    callback: function (errors, window) {
        var books = [];
        var trs = window.document.getElementsByTagName('tr');

        // 第一行是表头
        for (var i = 1, length = trs.length; i < length; i++) {
            books.push({
                title: trs[i].children[1].firstChild.firstChild.innerHTML,
                href: trs[i].children[1].firstChild.firstChild.href,
                count: trs[i].children[6].innerHTML
            });
        }
        fs.writeFile(fileName, JSON.stringify(books));
        window.close();
        console.log('update finish.');
    }
};


/**
* @synopsis 更新数据
*
* @param page 页面对象，包括一个 url 属性和一个 callback 回调函数
*
* @returns  null 
*/
var update = function (page) {
    jsdom.env(page.url, function (errors, window) {
        page.callback(errors, window);
    });
    console.log('updating…');
}

update(popularCollect);
