// ES6 Class
class BarChart2 {

    constructor(_config,_data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 140,
        margin: { top: 10, bottom: 30, right: 10, left: 30 }
      }
  
      this.data = _data; //array of objects data = 0, sum = 1
      //this.color = _color; //    
      // Call a class function
      this.initVis();
    }
  
    initVis() {

      console.log("Let's draw a Bar chart 2!!");

      let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                      //so it is good to create a variable that is a reference to 'this' class instance
  
      //set up the width and height of the area where visualizations will go- factoring in margins               
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      console.log("Test",vis.data);

        //setting up the chart- things that won't need to update on user actions
        vis.svg = d3.select(vis.config.parentElement).append('svg');
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);


            vis.xValue = d => d.year; 
            vis.yValue = d => d.value;


            vis.xScale = d3.scaleBand()
            .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
            .range([0, vis.width])
            .padding(0.2)
            ;

      vis.chart.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");            

          // Add Y axis
            vis.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([ vis.height, 0]);

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


            // let x = d3.scaleBand()
            // .range([ 0, width ])
            // .domain(data.map(function(d) { return d.Category; }))
            // .padding(0.2);
            // svg.append("g")
            // .attr("transform", "translate(0," + height + ")")
            // .call(d3.axisBottom(x))
            // .selectAll("text")
            //   .attr("transform", "translate(-10,0)rotate(-45)")
            //   .style("text-anchor", "end");
          
          // Add Y axis
          // let y = d3.scaleLinear()
          //   .domain([0, 13000])
          //   .range([ height, 0]);
          // svg.append("g")
          //   .call(d3.axisLeft(y));             

            vis.chart.selectAll("mybar")
            .data(vis.data)
            .enter()
            .append("rect")
              .attr("x", function(d) { return vis.xScale(d.year); })
              .attr("y", function(d) { return vis.yScale(+d.value); })
              .attr("width", function(d) { return vis.xScale.bandwidth(); })
              .attr("height", function(d) { return vis.height - vis.yScale(+d.value); })
              .attr("fill", "#69b3a2")
  
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
            .text("Percentage")

            vis.chart.append("text")
            .attr("x", (vis.width / 2))             
            .attr("y", 30 - (vis.config.margin.top/2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Percentage of Pollutant Over Years");   

       // updateVis(); //call updateVis() at the end 
    }
  
   updateVis() { 
    // renderVis(); 
  
   }
  
   renderVis() { }
  
  
  

  }