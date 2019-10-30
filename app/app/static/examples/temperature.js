//Javascript code for fetching temperature and plotting it as a line chart

// set the dimensions and margins of the graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
width = 350;// - margin.left - margin.right,
height = 250;// - margin.top - margin.bottom;

var div = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

// parse the date / time
var parseTime = d3.timeParse("%H:%M:%S");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
.x(function(d) { return x(d.Date); })
.y(function(d) { return y(d.Imports); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg1 = d3.select("body div#temp").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform","translate(" + margin.left + "," + margin.top + ")");

function draw1(data) {

var data = data;

// format the data
data.forEach(function(d) {
  d.Date = parseTime(d.time);
  d.Date.setHours(d.Date.getHours() + 5);
  d.Date.setMinutes(d.Date.getMinutes() + 30);
  d.Imports = +d.temp;
});

// sort years ascending
data.sort(function(a, b){
return a["Date"]-b["Date"];
})

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return d.Date; }));
y.domain([0, d3.max(data, function(d) {
return Math.max(d.Imports); })]);

// Add the valueline path.
svg1.append("path")
  .data([data])
  .attr("class", "line")
  .attr("d", valueline);

// Add the X Axis
svg1.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add the Y Axis
svg1.append("g")
  .call(d3.axisLeft(y));

// text label for the x axis
svg1.append("text")      
.attr("x", 150)
.attr("y",  280)
.style("text-anchor", "middle")
.text("Time");

// text label for the y axis
svg1.append("text")     
.attr("y", 0)
.attr("x",  -30)
.style("text-anchor", "middle")
.text("°C");

svg1.selectAll("dot").data(data)
.enter()
.append("circle")
.attr("r",5)
.attr("cx",function(d){return x(d.Date)})
.attr("cy",function(d){return y(d.Imports);})
.attr("class","dot")
.on("mouseover", function(d) {		
  div.transition()		
      .duration(200)		
      .style("opacity", 1000);		
  div.html("<b>Temp</b>:" +d.Imports + "<br/>" +"<b>Time</b>:"+d.time)	
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");	
})					
.on("mouseout", function(d) {		
  div.transition()		
      .duration(1000)		
      .style("opacity", 0);	
});
}

// Get the data
d3.json("http://167.99.198.145/api/data", function(error, data) {
  if (error) throw error;
  
  // trigger render
  draw1(data);
  
  });

/*function loadtempreture(){

  // Get the data
  d3.json("http://167.99.198.145/api/data", function(error, data) {
  if (error) throw error;
  
  // trigger render
  draw1(data);
  //$("#temp").empty();
  });
}

setInterval(function(){
  loadtempreture();
},5000);*/
