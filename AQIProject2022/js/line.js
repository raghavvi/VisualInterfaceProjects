class Line {

    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 180,
        margin: { top: 35, bottom: 40, right: 150, left: 50 },
        tooltipPadding: _config.tooltipPadding || -30
      }
  
      this.data = _data; //array of objects data = 0, sum = 1
      //this.color = _color; //

      // Call a class function
      this.initVis();
    }
  
    initVis() {
        
      console.log("Let's draw a chart!!");

      let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                      //so it is good to create a variable that is a reference to 'this' class instance
  
      //set up the width and height of the area where visualizations will go- factoring in margins               
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      console.log("Test",vis.data);
      //reusable functions for x and y 
          //if you reuse a function frequetly, you can define it as a parameter
          //also, maybe someday you will want the user to be able to re-set it.
      vis.xValue = d => d.year; 
      vis.yValue =  d => d.value;
  

      vis.xScale = d3.scaleLinear()
      .domain(d3.extent(vis.data[0], vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
      .range([0, vis.width]);
       

      vis.yScale = d3.scaleLinear()
          .domain( d3.extent(vis.data[0], vis.yValue) )
          .range([vis.height, 0])
          .nice();
           //this just makes the y axes behave nicely by rounding up
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart (see margin convention)
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale);
      vis.yAxis = d3.axisLeft(vis.yScale);
  
      // Append x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`)
          .call(vis.xAxis);
      
      // Append y-axis group
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis')
          .call(vis.yAxis); 
  
      vis.line = d3.line()
          .x(d => vis.xScale(vis.xValue(d)))
          .y(d => vis.yScale(vis.yValue(+d)));
 
let keysArray= ["max","median","90"]  ;

vis.color = d3.scaleOrdinal()
    .domain(keysArray)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
      

    vis.chart.selectAll(".line")
    .data(vis.data[1])
    .join("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return vis.color(d[0]) })
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
        console.log("Catch",d);
        return d3.line()
          .x(function(d) { return vis.xScale(d.year); })
          .y(function(d) { return vis.yScale(+d.value); })
          (d[1]) //this is the array of values 
      });

  // Add one dot in the legend for each name.
  vis.chart.selectAll("mydots")
    .data(keysArray)
    .enter()
    .append("circle")
      .attr("cx", 100)
      .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function(d){ return vis.color(d)})

  // Add one dot in the legend for each name.
  vis.chart.selectAll("mylabels")
    .data(keysArray)
    .enter()
    .append("text")
      .attr("x", 120)
      .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return vis.color(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")   




    // Add dots to the line
    vis.circles = vis.chart.selectAll("myCircles")
      .data(vis.data[0])
      // .enter()
      .join("circle")
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("cx", function(d) { return vis.xScale(d.year) })
        .attr("cy", function(d) { return vis.yScale(d.value) })
        .attr("r", 3)


      vis.circles    
      .on('mouseover', (event,d) => {
        console.log("mouse over! ");
        console.log(event);
        console.log(d);
        d3.select('#tooltip')
        .style('display', 'inline')
        .style('width',200)
        .style('height',300)
        .style('font-size',40)
        .style('text-align', 'center')
        .style('right', (event.pageX + vis.config.tooltipPadding) + 'px')   
        .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
        .style('color', 'green')
        .style('background','lightgreen')
        .html(`
          <div class="tooltip-title">Year
          ${d.year}</div>
          <div><i>Air Quality
          ${d.value}</i></div>
        `);

      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      });        


          // Add X axis label:
        vis.chart.append("text")
        .attr("text-anchor", "end")
        .attr("x", vis.width)
        .attr("y", vis.height + vis.config.margin.top)
        .text("Years");

        // Y axis label:
        vis.chart.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -vis.config.margin.left+20)
        .attr("x", -vis.config.margin.top)
        .text("AQI")

        vis.chart.append("text")
        .attr("x", (vis.width / 2))             
        .attr("y", 0 - (vis.config.margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Median,Max,90Percentile for AQI");        


    }
  
  
    //leave this empty for now
   updateVis() { 
     
  
   }
  
  
   //leave this empty for now...
   renderVis() { 
  
    }
  
  
  
  }