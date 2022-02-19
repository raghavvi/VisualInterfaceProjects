
class PieChart {
  constructor(_config,_data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 3500,
        containerHeight: _config.containerHeight ||3500,
        margin: { top: 250, bottom: 30, right: 80, left: 780 }
      }    
      this.data = _data; //array of objects data = 0, sum = 1
      //this.color = _color; //    
      // Call a class function
      this.initVis();
  }
  initVis() {    
      console.log("Let's draw a pie chart!!");
      let vis = this; 
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
      // - vis.config.margin.left        
// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
vis.radius = Math.min(vis.width, vis.height) / 2     
// append the svg object to the div called 'my_dataviz'
    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left / 2},${vis.config.margin.top / 2})`);      
// set the color scale
vis.color = d3.scaleOrdinal()
  .range(d3.schemeSet1);

// set the color scale
vis.color = d3.scaleOrdinal()
.range(["#ff8000","#ffbf00","#ffff00","#bfff00","#80ff00","#40ff00","#00ff00","#00ff40","#00ff80","#00ffbf","#00ffff","#00bfff","#0080ff","#0040ff","#0000ff",
"#4000ff","#8000ff","#bf00ff","#ff00ff","#ff00bf","#ff0080","#ff0040","#ff0000","#DFFF00","#FFBF00","#FF7F50","#DE3163","#9FE2BF","#40E0D0","#6495ED","#CCCCFF",
"#CD5C5C","#F08080","#FA8072","#E9967A","#FFA07A"])   
//Pass the data
  
vis.pie = d3.pie()
  .value(function(d) {return d[1]})
vis.data_ready = vis.pie(Object.entries(vis.data)) //d

console.log("Collecting the required data",vis.data_ready);
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
vis.arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(vis.radius)

console.log("Color",vis.color(vis.data[0]))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
vis.chart.selectAll('mySlices')
  .data( vis.data_ready)
  .join('path')
    .attr('d', vis.arcGenerator)
    .attr('fill', function(d){ return(vis.color(vis.data[0])) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
vis.chart.selectAll('mySlices')
  .data(vis.data_ready)
  .join('text')
  .text(function(d){ return vis.data[0]})
  .attr("transform", function(d) { return `translate(${vis.arcGenerator.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 15)      
  
}

updateVis() { 
// renderVis(); 
}
renderVis() { }



}    