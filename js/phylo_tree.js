// Display a phylo tree with datas from url
function phyloTree(url) {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2 - 30) + ")");

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var cluster = d3.cluster()
        .size([360, width / 2 - 200]);

    let color = d3.scaleSequential(t => {
                        if (t < 0.75) { return d3.interpolateInferno(t) }
                        else { return d3.interpolateViridis(1 - t + 0.75) }
              })
              .domain([-3, 3]);

    d3.csv(url, function(error, data) {
      if (error) console.log(error);

      var root = stratify(data)
          .sort(function(a, b) { return a.height - b.height || a.id.localeCompare(b.id); });

      cluster(root);

      var link = g.selectAll(".link")
          .data(root.descendants().slice(1))
          .enter().append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return "M" + project(d.x, d.y)
                + "C" + project(d.x, (d.y + d.parent.y) / 2)
                + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
                + " " + project(d.parent.x, d.parent.y);
          })
          .style("stroke", function(d) { return color(d.data.value); } )
          .style("fill", "none" );

      var node = g.selectAll(".node")
          .data(root.descendants())
          .enter().append("g")
          .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
          .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });
          //.style("fill", function(d) { return color(d.data.value); } );

      node.append("circle")
          .attr("r", 2.5)
          .style("fill", function(d) { return color(d.data.value); } );

      node.append("text")
          .attr("dy", "0.31em")
          .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
          .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
          .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
          .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); })
          .style("opacity", 0);
    });

    function project(x, y) {
      var angle = (x - 90) / 180 * Math.PI, radius = y;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    }
}