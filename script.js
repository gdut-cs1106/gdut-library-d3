var START_YEAR = 2007;
var now = new Date();
var nowYear = now.getFullYear();
var nowMonth = now.getMonth() + 1;
var yearSelect = document.querySelector('#yearSelect');
var monthSelect = document.querySelector('#monthSelect');
var diameter = 1060,
    format = d3.format(",d"),
    color = d3.scale.category20c();

(function () {
    var option;
    
    // 根据当前年份生成年份 select 并选择当前年份
    for (var year = START_YEAR; year <= nowYear; year++) {
        option = document.createElement('option');
        option.value = year;
        option.innerHTML = year;
        yearSelect.appendChild(option);
    }

    yearSelect.onchange = monthSelect.onchange = function () {
        var fileName = "book-" + yearSelect.value + "-" + monthSelect.value + "-1";
        draw(fileName);
    }

    // 根据当前年份选择月份
    yearSelect.value = nowYear;
    // 根据当前月份选择月份
    monthSelect.value = nowMonth;

    document.querySelector('#mc_rank').onclick = function () {
        draw('mc_rank');
    }
    document.querySelector('#user_score_rank').onclick = function () {
        draw('user_score_rank');
    }

})();

var draw = function (fileName) {
    // 先把原来的图像删除
    var article = document.querySelector('article');
    article.removeChild(article.lastChild);

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("article").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    d3.json('data/' + fileName + '.json', function(error, root) {
        var node = svg.selectAll(".node")
            .data(bubble.nodes(classes(root))
            .filter(function(d) { return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.packageName.substring(0, 1)); });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { 
                return d.className.substring(0, d.r / 6);
            });
    });
}


/**
* @synopsis 把数据打包成可以供 d3 渲染的格式
*
* @param root 源数据对象
*
* @returns 打包后的数据对象 
*/
var classes = function (root) {
    var classes = [];
    root.books.forEach(function (child) {
        classes.push({
            packageName: child.index,
            className: child.name,
            value: child.size
        });
    });
    return {children: classes};
}

draw('mc_rank');
