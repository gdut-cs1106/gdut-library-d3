var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("article").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("data/user_score_rank.json", function(error, root) {
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

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
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

d3.select(self.frameElement).style("height", diameter + "px");
