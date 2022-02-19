
/**
 * Load data from CSV file asynchronously and render visualizations
 * Load data from Hamilton County:  (1980-2021)
 */
//let data, scatterplot;

d3.csv('data/AnnualAQI_1980_2021.csv')

  .then(data => {
    console.log('Data loading complete. Work with dataset.');
    console.log(data);

    const StatAirQuality = [];

    const DefinedParameters = [];

    const DaysWithoutAQI = [];

    const categoryData2021 = [];

    const SO2DataOverYears = [];
    const N0DataOverYears = [];
    const CODataOverYears = [];
    const OzoneDataOverYears = [];
    const PM10DataOverYears = [];
    const PM25DataOverYears = [];


    data.forEach(d => {

      // let minYear = d3.min( data, d => d.Year);
      // let maxYear = d3.max( data, d=> d.Year );
      
      // for(let i = minYear; i < maxYear; i++) {
      //   let justThisYear = data.filter( d => d.Year == i );  

      // }      


      d['Max AQI'] = +d['Max AQI']; //Convert string aqi to number
      d['90th Percentile AQI'] = +d['90th Percentile AQI']; 
      d['Median AQI'] = +d['Median AQI'];
      d['Days with AQI'] = +d['Days with AQI'];     
      d['Good Days'] = +d['Good Days'];
      d['Moderate Days'] = +d['Moderate Days']; 
      d['Unhealthy for Sensitive Groups Days'] = +d['Unhealthy for Sensitive Groups Days'];   
      d['Unhealthy Days'] = +d['Unhealthy Days'];
      d['Very Unhealthy Days'] = +d['Very Unhealthy Days'];           
      d['Hazardous Days'] = +d['Hazardous Days']; 
      d['Days CO'] = +d['Days CO']; 
      d['Days NO2'] = +d['Days NO2'];
      d['Days Ozone'] = +d['Days Ozone'];
      d['Days SO2'] = +d['Days SO2'];
      d['Days PM2.5'] = +d['Days PM2.5'];
      d['Days PM10'] = +d['Days PM10'];

      StatAirQuality.push( {"year": d.Year, "value":d['Max AQI'],"filter": "max"});
      StatAirQuality.push( {"year": d.Year, "value":d['Median AQI'], "filter": "median"});
      StatAirQuality.push( {"year": d.Year, "value":d['90th Percentile AQI'],"filter": "90"});     
      
      //Calculate Percentage of Pollutants 
      DefinedParameters.push( {"year": d.Year, "value":(d['Days CO']/d['Days with AQI']) * 100,"filter": "CO"});
      DefinedParameters.push( {"year": d.Year, "value":(d['Days NO2']/d['Days with AQI']) * 100,"filter": "NO2"});
      DefinedParameters.push( {"year": d.Year, "value":(d['Days Ozone']/d['Days with AQI']) * 100,"filter": "Ozone"}); 
      DefinedParameters.push( {"year": d.Year, "value":(d['Days SO2']/d['Days with AQI']) * 100,"filter": "SO2"});
      DefinedParameters.push( {"year": d.Year, "value":(d['Days PM2.5']/d['Days with AQI']) * 100,"filter": "PM2.5"});   
      DefinedParameters.push( {"year": d.Year, "value":(d['Days PM10']/d['Days with AQI']) * 100,"filter": "PM10"});   

      CODataOverYears.push( {"year": d.Year, "value":(d['Days CO']/d['Days with AQI']) * 100,"filter": "CO"});
      N0DataOverYears.push( {"year": d.Year, "value":(d['Days NO2']/d['Days with AQI']) * 100,"filter": "NO2"});
      OzoneDataOverYears.push( {"year": d.Year, "value":(d['Days Ozone']/d['Days with AQI']) * 100,"filter": "Ozone"}); 
      SO2DataOverYears.push( {"year": d.Year, "value":(d['Days SO2']/d['Days with AQI']) * 100,"filter": "SO2"});
      PM25DataOverYears.push( {"year": d.Year, "value":(d['Days PM2.5']/d['Days with AQI']) * 100,"filter": "PM2.5"});   
      PM10DataOverYears.push( {"year": d.Year, "value":(d['Days PM10']/d['Days with AQI']) * 100,"filter": "PM10"});  


      //Calculate the numbers for Days Without AQI
      let daysWO = computeDaysWOAQI(d.Year,d['Days with AQI']);     

      function computeDaysWOAQI(year,count) 
      {

        let days = days_of_a_year(year);
        let difference = days - count;   
        return difference;
      }


      function days_of_a_year(year) 
      {
        console.log("Inputting in the year",year);
        return isLeapYear(year) ? 366 : 365;
      }
      
      function isLeapYear(year) {
  
        console.log("Testing new function 2");
           return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
      }

      DaysWithoutAQI.push( {"Year":d.Year,"DaysWOAQI":daysWO});


      //Calculate the Percentage of Category for 2021

    });

    //Filter for categories in 2021 d3.filter. Returns a row


    let year = data.map(function(d) { return d.Year; })
    console.log("Year",year[41]);    

    let year2021data = data.filter( d => d.Year == year[41] ); 
    let category1 = year2021data.map(function(d) { return (d['Unhealthy for Sensitive Groups Days']/d['Days with AQI']) * 100; })
    let category2 = year2021data.map(function(d) { return (d['Moderate Days']/d['Days with AQI']) * 100; })
    let category3 = year2021data.map(function(d) { return (d['Unhealthy Days']/d['Days with AQI']) * 100; })
    let category4 = year2021data.map(function(d) { return (d['Very Unhealthy Days']/d['Days with AQI']) * 100; })
    let category5 = year2021data.map(function(d) { return (d['Hazardous Days']/d['Days with AQI']) * 100; })
    let category6 = year2021data.map(function(d) { return (d['Good Days']/d['Days with AQI']) * 100; })

    categoryData2021.push( {"Year":year[41],"value":category1[0], "Category":"Unhealthy for Sensitive Groups Days"});
    categoryData2021.push( {"Year":year[41],"value":category2[0], "Category":"Moderate Days"});
    categoryData2021.push( {"Year":year[41],"value":category3[0], "Category":"Unhealthy Days"});
    categoryData2021.push( {"Year":year[41],"value":category4[0], "Category":"Very Unhealthy Days"});
    categoryData2021.push( {"Year":year[41],"value":category5[0], "Category":"Hazardous Days"});
    categoryData2021.push( {"Year":year[41],"value":category6[0], "Category":"Good Days"});


    console.log("StatAirQuality",StatAirQuality);
    console.log("DefinedParameters",DefinedParameters);
    console.log("DaysWithoutAQI",DaysWithoutAQI);
    console.log("categoryData2021",categoryData2021);
    console.log("CODataOverYears",CODataOverYears);
    console.log("N0DataOverYears",N0DataOverYears);    
    console.log("SO2DataOverYears",SO2DataOverYears); 
    console.log("PM10DataOverYears",PM10DataOverYears); 
    console.log("PM25DataOverYears",PM25DataOverYears);    
    console.log("OzoneDataOverYears",OzoneDataOverYears);          

    const sumDataVis1Group = d3.group(StatAirQuality, d => d.filter)
    console.log("SumVis1",sumDataVis1Group);

    const sumDataVis2Group = d3.group(DefinedParameters, d => d.filter)

    console.log("SumVis2",sumDataVis2Group.keys());


    const color1 = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
    
    ///////This is for vis 1//////////////////////
    
    const vis1data = [StatAirQuality,sumDataVis1Group];
    
    let lineChart = new Line ({
      'parentElement': '#line2',
      'containerHeight': 500,
      'containerWidth': 1000
      }, vis1data); 	

  ///////This is for vis 2//////////////////////

const vis2data = [DefinedParameters,sumDataVis2Group];

let lineChart2 = new Line2({
  'parentElement': '#line3',
  'containerHeight': 500,
  'containerWidth': 1000
  }, vis2data); 	


  ///////This is for vis 3//////////////////////

  // let barChart1 = new BarChart3({
  //   'parentElement': '#bar1',
  //   'containerHeight': 500,
  //   'containerWidth': 800
  //   }, DaysWithoutAQI); 	

  let lineChartTest = new LineChart3({
    'parentElement': '#line4',
    'containerHeight': 500,
    'containerWidth': 800
    }, DaysWithoutAQI); 	
  


  ///////This is for vis 4//////////////////////    

  let barChart2 = new BarChart({
    'parentElement': '#bar2',
    'containerHeight': 500,
    'containerWidth': 800
    }, categoryData2021); 	


  ///////This is for vis 5//////////////////////

    let barChart3= new BarChart2({
      'parentElement': '#bar3',
      'containerHeight': 500,
      'containerWidth': 800
      }, SO2DataOverYears);
      
 
 let value1 = SO2DataOverYears.map(function(d) { return d.value; })
 let value2 = CODataOverYears.map(function(d) { return d.value; })
 let value3 = OzoneDataOverYears.map(function(d) { return d.value; })
 let value4 = N0DataOverYears.map(function(d) { return d.value; })
 let value5 = PM10DataOverYears.map(function(d) { return d.value; })
 let value6 = PM25DataOverYears.map(function(d) { return d.value; })
 
 function collectGroups(value){
   const dataGroup = {1980: value[0], 1981: value[1], 1982:value[2], 1983:value[3], 1984:value[4],1985:value1[5],
    1986:value[6],1987:value[7],1988:value[8],1989:value[9],1990:value[10],1991: value[11], 1992: value[12], 1993:value[13], 1994:value[14], 1995:value[15],1996:value[16],
    1997:value[17],1998:value[18],1999:value[19],2000:value[20],2001:value[21], 2002:value1[22],2003:value[23],2004:value[24],2005:value[25],2006:value[26],
    2007:value[27],2008:value[28], 2009:value[29],2010:value[30],2011:value[31],2012:value[32],2013:value[33],2014:value[34],2015:value[35],2016:value[36],2017:value[37],
    2018:value[38],2019:value[39],2020:value[40],2021:value[41] };

    return dataGroup
 }

 let SO2 = collectGroups(value1)
 let CO = collectGroups(value2)
 let Ozone = collectGroups(value3)
 let NO = collectGroups(value4)
 let PM10 = collectGroups(value5)
 let PM25 = collectGroups(value6)

let selector = ["#pie1","#pie2","#pie3","#pie4","#pie5","#pie6"]

function constructPieCharts(dataGroup,selector,keyArray) 
{
//Now construct a pie chart
const width = 460,
height = 480,
margin = 10;

// // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin        

// append the svg object to the div called 'my_dataviz'
const svg = d3.select(selector)
.append("svg")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);


// set the color scale
const color = d3.scaleOrdinal()
.range(["#ff8000","#ffbf00","#ffff00","#bfff00","#80ff00","#40ff00","#00ff00","#00ff40","#00ff80","#00ffbf","#00ffff","#00bfff","#0080ff","#0040ff","#0000ff",
"#4000ff","#8000ff","#bf00ff","#ff00ff","#ff00bf","#ff0080","#ff0040","#ff0000","#DFFF00","#FFBF00","#FF7F50","#DE3163","#9FE2BF","#40E0D0","#6495ED","#CCCCFF",
"#CD5C5C","#F08080","#FA8072","#E9967A","#FFA07A"])


const pie = d3.pie()
.value(function(d) {return d[1]})
const data_ready = pie(Object.entries(dataGroup))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
const arcGenerator = d3.arc()
.innerRadius(0)
.outerRadius(radius)



// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
.selectAll('mySlices')
.data(data_ready)
.join('path')
  .attr('d', arcGenerator)
  .attr('fill', function(d){ return(color(d.data[0])) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)


// Now add the annotation. Use the centroid method to get the best coordinates
svg
.selectAll('mySlices')
.data(data_ready)
.join('text')
.text(function(d){ return  d.data[0]})
.attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
.style("text-anchor", "middle")
.style("font-size", 14)
}



constructPieCharts(SO2,selector[0]);
constructPieCharts(CO,selector[1]);
constructPieCharts(Ozone,selector[2]);
constructPieCharts(NO,selector[3]);
constructPieCharts(PM10,selector[4]);
constructPieCharts(PM25,selector[5]);



///////This is for vis 5//////////////////////

   

  })
  .catch(error => console.error(error));



