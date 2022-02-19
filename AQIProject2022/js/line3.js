class LineChart3 {

    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 180,
        margin: { top: 35, bottom: 40, right: 150, left: 50 }
      }
  
      this.data = _data; //array of objects data = 0, sum = 1
      //this.color = _color; //

      // Call a class function
      this.initVis();
    }
  
    initVis() {
        
      console.log("Let's draw a line chart!!");

      let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                      //so it is good to create a variable that is a reference to 'this' class instance
  
      //set up the width and height of the area where visualizations will go- factoring in margins               
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      console.log("Test",vis.data);
      //reusable functions for x and y 
          //if you reuse a function frequetly, you can define it as a parameter
          //also, maybe someday you will want the user to be able to re-set it.
      vis.xValue = d => d.Year; 
      vis.yValue = d => d.DaysWOAQI;
  

      vis.xScale = d3.scaleLinear()
      .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
      .range([0, vis.width]);
       

      vis.yScale = d3.scaleLinear()
          .domain( d3.extent(vis.data, vis.yValue) )
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
      vis.xAxis = d3.axisBottom(vis.xScale).ticks(6);
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
          

vis.color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
      
    vis.chart.selectAll(".line")
    .data(vis.data)
    .join("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return vis.color(d[0]) })
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
        console.log("Catch",d);
        return d3.line()
          .x(function(d) { return vis.xScale(d.Year); })
          .y(function(d) { return vis.yScale(+d.DaysWOAQI); })
         //this is the array of values 
      });
   
    // Add the line
    vis.circles = vis.chart.selectAll("myCircles")
      .data(vis.data)
      //.enter()
      .join("circle")
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("cx", function(d) { return vis.xScale(d.Year) })
        .attr("cy", function(d) { return vis.yScale(d.DaysWOAQI) })
        .attr("r", 3)

        vis.circles    
        .on('mouseover', (event,d) => {
          console.log("mouse over! ");
          console.log(event);
          console.log(d);
          d3.select('#tooltip3')
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
            <div class="tooltip-title">
            <div><i>Days WO AQI
            ${d.DaysWOAQI}</i></div>
          `);

        })


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
        .text("Days")

        vis.chart.append("text")
        .attr("x", (vis.width / 2))             
        .attr("y", 0 - (vis.config.margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Days Without AQI");        


    }
  
  
    //leave this empty for now
   updateVis() { 
     
  
   }
  
  
   //leave this empty for now...
   renderVis() { 
  
    }
  
  
  
  }