// Display a phylo tree with datas from url
function phyloTree(url) {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2 - 130) + ")");

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var cluster = d3.cluster()
        .size([360, width / 2 - 200]);

    var fisheye = d3.fisheye.circular()
                    .radius(90)
                    .distortion(7);

    let color = d3.scaleSequential(t => {
                        if (t < 0.75) { return d3.interpolateInferno(t) }
                        else { return d3.interpolateViridis(1 - t + 0.75) }
              })
              .domain([-3, 3]);

    d3.csv(url, function(error, data) {
      if (error) console.log(error);
      else {
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
              .style("fill", "none" )
              .on("mouseover", function(d) {
                d3.selectAll(".link").filter(function(e) {
		              let parents = [];
		              while (node) {
		                parents.push(node);
		                node = node.parent;
		              }
                  return containsObject(e, parents);
                })
                .style("stroke-width", 4)
              })
              .on("mouseout", function(d) {
                d3.selectAll(".link").filter(function(e) {
		              let parents = [];
		              while (node) {
		                parents.push(node);
		                node = node.parent;
		              }
                  return containsObject(e, parents);
                })
                .style("stroke-width", 1)
              });

          var node = g.selectAll(".node")
              .data(root.descendants())
              .enter().append("g")
              .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
              .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

          node.append("circle")
              .attr("r", 2.5)
              .style("fill", function(d) { return color(d.data.value); } );

          node.append("text")
              .attr("dy", "0.31em")
              .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
              .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
              .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
              .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); })
              .style("visibility", "hidden");
      }
    });

    function project(x, y) {
      var angle = (x - 90) / 180 * Math.PI, radius = y;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    }

    function retroProject(x, y, svg){
      rect = svg.getBoundingClientRect()
      x = x - width / 2;
      y = y - width / 2 + 160.;
      a = 180 * +(x<0) + 90 + 180 / Math.PI * Math.atan(y/x)
      r = Math.sqrt(x*x + y*y)
      return [180 * +(x<0) + 90 + 180 / Math.PI * Math.atan(y/x), Math.sqrt(x*x + y*y)]
    };

    function containsObject(obj, list) {
      var i;
      for (i = 0; i < list.length; i++) {
          if (list[i] === obj) {
              return true;
          }
      }
      
      return false;
    }

    svg.on("mousemove", function() {
      let mouse = retroProject(...d3.mouse(this), this);
      fisheye.focus(mouse);

      let node = g.selectAll(".node")
      let link = g.selectAll(".link")
      let text = g.selectAll("text")
      let opacity = d3.scalePow()
	                    .exponent(0.7)
	                    .range([0, 1]);

      node.each(function(d) { 
             dbis = { ...d };
             dbis.x += 360;
             dter = { ...d };
             dter.x -= 360;
             if (Math.abs(fisheye(dbis).x - dbis.x) % 360 > Math.abs(fisheye(d).x - d.x) % 360 ) {   
               d.fisheye = fisheye(dbis);
               d.fisheye.x -= 360;
             } else if (Math.abs(fisheye(dter).x - dter.x) % 360 > Math.abs(fisheye(d).x - d.x) % 360 ) {   
               d.fisheye = fisheye(dter);
               d.fisheye.x -= 360;
             } else {
               d.fisheye = fisheye(d);
             }
          })
          .attr("transform", function(d) { return "translate(" + project(d.fisheye.x, d.fisheye.y) + ")"; });

      opacity.domain([50, 0]);
      
      text.style("visibility", function(d) {
            if (d.fisheye.z == 1.) {
              return 'hidden';
            } else {
              return 'visible';
            }
             } )
          .style("opacity", function(d) {
	      dx = d.fisheye.x - mouse[0];
	      dy = d.fisheye.y - mouse[1];
	      return opacity(Math.sqrt(dx*dx + 0.7*dy*dy));
             } );
    
      link.attr("d", function(d) {
            return "M" + project(d.fisheye.x, d.fisheye.y)
                + "C" + project(d.fisheye.x, (d.fisheye.y + d.parent.fisheye.y) / 2)
                + " " + project(d.parent.fisheye.x, (d.y + d.parent.fisheye.y) / 2)
                + " " + project(d.parent.fisheye.x, d.parent.fisheye.y);
          });
    });
}
