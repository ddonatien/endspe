// Display a phylo tree with datas from url
function phyloTree(url) {
    const Http = new XMLHttpRequest();
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2 - 80) + ")");

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var cluster = d3.cluster()
        .size([360, width / 2 - 200]);

    var fisheye = d3.fisheye.closedRadial()
               .frontier(width / 2 - 200)
                    .radius(70)
                    .distortion(15);

    let color = d3.scaleSequential(t => {
                        if (t < 0.75) { return d3.interpolateInferno(t) }
                        else { return d3.interpolateViridis(1 - t + 0.75) }
              })
              .domain([-3, 3]);

    var scaleDatas = [
      { "x_axis": 10, "y_axis": 10, "height": 17, "width": 17, "color" : color(3), "text": "Safe" },
      { "x_axis": 10, "y_axis": 40, "height": 17, "width": 17, "color" : color(2), "text": "Minor threat" },
      { "x_axis": 10, "y_axis": 70, "height": 17, "width": 17, "color" : color(1.5), "text": "Vulnerable" },
      { "x_axis": 10, "y_axis": 100, "height": 17, "width": 17, "color" : color(1), "text": "Endangered" },
      { "x_axis": 10, "y_axis": 130, "height": 17, "width": 17, "color" : color(-0.1), "text": "Critical danger" },
      { "x_axis": 10, "y_axis": 160, "height": 17, "width": 17, "color" : color(-1), "text": "Extinct in the wild" },
      { "x_axis": 10, "y_axis": 190, "height": 17, "width": 17, "color" : color(-3), "text": "Extinct" }
    ];

    function draw_scale_legend(data) {
      let g = svg.append("g");

      data.forEach( function(d) {
        var rectangle = g.append("rect")
            .attr("x", d.x_axis)
            .attr("y", d.y_axis)
            .attr("height", d.height)
            .attr("width", d.width)
            .style("fill", d.color)
            .style("opacity", 0.9);
        var legend = g.append("text")
            .text(d.text)
            .attr("x", d.x_axis + 27)
            .attr("y", d.y_axis + 14)
            .attr("font-size", "15px")
            .attr("fill", "#3f4040");
      })
    }

    draw_scale_legend(scaleDatas);

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
                  if (e===d) return true
		       	      let node = { ...d };
		              while (node) {
				            if (node === e) {
					            return true;
				            }
		                node = node.parent;
		              }
                })
                .style("stroke-width", 2)
                .style("stroke", 'black')
              })
              .on("mouseout", function(d) {
                d3.selectAll(".link").filter(function(e) {
                  if (e===d) return true
		       	      let node = { ...d };
		              while (node) {
				            if (node == e) {
					            return true;
				            }
		                node = node.parent;
		              }
                })
                .style("stroke-width", 1)
                .style("stroke", function(d) { return color(d.data.value); } )
              });

          var node = g.selectAll(".node")
              .data(root.descendants())
              .enter().append("g")
              .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
              .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; })
              .on("mouseover", function(d) {
                d3.selectAll(".link").filter(function(e) {
                  if (e===d) return true
		       	      let node = { ...d };
		              while (node) {
				            if (node === e) {
					            return true;
				            }
		                node = node.parent;
		              }
                })
                .style("stroke-width", 2)
                .style("stroke", 'black')
              })
              .on("mouseout", function(d) {
                d3.selectAll(".link").filter(function(e) {
                  if (e===d) return true
		       	      let node = { ...d };
		              while (node) {
				            if (node == e) {
					            return true;
				            }
		                node = node.parent;
		              }
                })
                .style("stroke-width", 1)
                .style("stroke", function(d) { return color(d.data.value); } )
              })
              .on('click', function(d) {
                console.log('click');
                let split = d.id.split('.')
                let url=`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exintro=&titles=${split[split.length - 1]}&format=json`;
                Http.open("GET", url, true);
                Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                Http.responseType = 'json';
                Http.send();

                Http.onreadystatechange = (e) => {
                  console.log(Http.response);
                  let pages = Http.response.query.pages;
                  let key = Object.keys(pages)[0];
                  d3.select("#wiki").html(pages[key].extract);
                }
              });

          node.append("circle")
              .attr("r", 0.45)
              .style("fill", function(d) { return color(d.data.value); } );

          node.append("text")
              .attr("dy", "0.31em")
              .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
              .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
              .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
              .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); })
              .style("visibility", "hidden")
	  
        // Utilisé pour la calibration (on peut sûrement faire mieux)
        // g.append("circle")
        //  .attr("r", 2.5)
        //  .attr("fill", "black")
        //  .attr("transform", "translate(" + project(0, 0) + ")");
      }
    });

    function project(x, y) {
      var angle = (x - 90) / 180 * Math.PI, radius = y;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    }

    function retroProject(x, y, svg){
      // rect = svg.getBoundingClientRect()
      // console.log(x, y)
      x = x - width / 2;
      y = y - width / 2 + 110;
      a = 180 * +(x<0) + 90 + 180 / Math.PI * Math.atan(y/x)
      r = Math.sqrt(x*x + y*y)
      return [180 * +(x<0) + 90 + 180 / Math.PI * Math.atan(y/x), Math.sqrt(x*x + y*y)]
    };

    function containsObject(obj, list) {
      var i;
      for (i = 0; i < list.length; i++) {
          if (list[i].id === obj.id) {
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
      let circle = g.selectAll("circle")
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
          .attr("transform", function(d) { return "translate(" + project(d.fisheye.x, d.y) + ")"; });

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
	      dy = d.y - mouse[1];
	      //return opacity(Math.exp(-2*dx*dx/(0.01 + dy)));
	      return (1 - 0.01*dy*dy)*Math.exp(-2*dx*dx/(0.01 + d.y));
             } );

      circle.attr("r", function(d) { return 0.45 * d.fisheye.z; });
    
      link.attr("d", function(d) {
            return "M" + project(d.fisheye.x, d.y)
                + "C" + project(d.fisheye.x, (d.y + d.parent.y) / 2)
                + " " + project(d.parent.fisheye.x, (d.y + d.parent.y) / 2)
                + " " + project(d.parent.fisheye.x, d.parent.y);
          });
    });
}
