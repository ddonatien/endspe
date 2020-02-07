## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/ddonatien/endspe/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

Aaaaaaaaaaaaaa
<script>
  //alert('Alert!')
  console.log("Coucou")
</script>
aaaaaaaaaaa
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>
    // Feel free to change or delete any of the code you see in this editor!
    var svg = d3.select("body").append("svg")
      .attr("width", 960)
      .attr("height", 500)
    var margin = {top: 60, right: 60, bottom: 60, left: 60};
    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var padding = {h: 15, v: 15}
    // TAILLE DE LA MATRICE. CHOISIR ENTRE 1 ET 4
    var demiNbCols = 2
    d3.csv('https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv', function(error, data) {
      if (error) {
        console.log(error)
      }
      else {
        data.columnsNum = data.columns.filter(function(d){ return +data[0][d] == data[0][d]})
        let xScale = d3.scaleBand()
                       .domain(data.columnsNum.slice(0,demiNbCols))
                       .range([0, width])
        let yScale = d3.scaleBand()
                       .domain(data.columnsNum.slice(-demiNbCols))
                       .range([0, height])
        let tScale = d3.scaleLinear()
                     .domain([1, 4])
                     .range([14, 8])
        let rScale = d3.scaleLinear()
                     .domain([5, 10])
                     .range([4, 1])
        data.columnsNum.slice(0,demiNbCols).forEach( function (d1, i) {
          data.columnsNum.slice(-demiNbCols).forEach( function (d2, j) {
            scatterplot(data, d1, d2, 'sepal_length', 'species', margin.left + i * xScale.bandwidth(), margin.top + j * yScale.bandwidth(), xScale.bandwidth(), yScale.bandwidth(), padding.v, padding.h, tScale(demiNbCols), rScale(demiNbCols))
          })
        })
      }
    })
    var scatterplot = function(data, x, y, r, c, _xStart, _yStart, _width, _height, _vPad, _hPad, _tSize, _maxR) {
      let xScale = d3.scaleLinear()
                     .domain(d3.extent(data, function (d) { return d[x] }))
                     .range([0, _width - 2 * _vPad])
      let yScale = d3.scaleLinear()
                     .domain(d3.extent(data, function (d) { return d[y] }))
                     .range([_height - 2 * _hPad, 0])
      let rScale = d3.scaleSqrt()
                     .domain(d3.extent(data, function (d) { return d[r] }))
                     .range([1, _maxR])
      let cScale = d3.scaleOrdinal(d3.schemeCategory20)
                     .domain(d3.extent(data, function (d) { return d[c] }))
      var xAxis = d3.axisBottom()
                    .scale(xScale);
      var yAxis = d3.axisLeft()
                    .scale(yScale);
      let g = svg.append('g');
      g.append("text")
       .text(`${x} vs ${y} | size : ${r}`)
       .attr('x', _xStart + _vPad)
       .attr('y', _yStart + _hPad)
       .attr("font-size", `${_tSize}px`)
       .attr("font-family", "monospace");
      g.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .style('fill', function(d) { return cScale(d[c]) })
       .style('stroke', 'gray')
       .attr('cx', function(d) { return _xStart + _vPad + xScale(d[x])})
       .attr('cy', function(d) { return _yStart + _hPad + yScale(d[y])})
       .style('opacity', '0.3')
       .on('mouseover', function(e) {
        d3.selectAll('circle')
          .style('opacity', function(d) {
            if (d===e){
              return '1'
            } else {
              return '0.3'
            }
        })
       })
       .on('mouseout', function(e) {
        d3.selectAll('circle')
          .style('opacity', '0.3')
       })
       .transition()
       .duration(500)
       .attr('r', function(d) { return rScale(d[r]) })
      g.append("g")
       .attr("class", "x axis")
       .attr("transform", `translate(${_xStart + _vPad},${_yStart +  _height - _hPad})`)
       .style("font-size", `${_tSize}px`)
       .style("font-family", "monospace")
       .call(xAxis)
      g.append("g")
       .attr("class", "y axis")
       .attr("transform", `translate(${_xStart + _vPad},${_yStart + _hPad})`)
       .style("font-size", `${_tSize}px`)
       .style("font-family", "monospace")
       .call(yAxis)
    }
</script>

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/ddonatien/endspe/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
