//Javascript code for fetching turbidity and plotting it as a line chart


// set the dimensions and margins of the graph
var margin = {top: 30, right: 10, bottom: 30, left: 50},
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
var svg4 = d3.select("body div#tur").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform","translate(" + margin.left + "," + margin.top + ")");

function draw4(data) {

var data = data;

// format the data
data.forEach(function(d) {
  d.Date = parseTime(d.time);
  d.Date.setHours(d.Date.getHours() + 5);
  d.Date.setMinutes(d.Date.getMinutes() + 30);
  d.Imports = +d.turbidity;
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
svg4.append("path")
  .data([data])
  .attr("class", "line2")
  .attr("d", valueline);

// Add the X Axis
svg4.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  // text label for the x axis
svg4.append("text")      
.attr("x", 150)
.attr("y", 280)
.style("text-anchor", "middle")
.text("Time");

// text label for the y axis
svg4.append("text")     
.attr("y", -5)
.attr("x",  -30)
.style("text-anchor", "middle")
.text("NTU");

// Add the Y Axis
svg4.append("g")
  .call(d3.axisLeft(y));

svg4.selectAll("dot").data(data)
.enter()
.append("circle")
.attr("r",5)
.attr("cx",function(d){return x(d.Date)})
.attr("cy",function(d){return y(d.Imports);})
.attr("class","dot1")
.on("mouseover", function(d) {		
  div.transition()		
      .duration(200)		
      .style("opacity", 1000);		
  div.html("<b>Turbidity</b>:" +d.Imports + "<br/>" +"<b>Time</b>:"+d.time)	
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
  draw4(data);
  
  });

/*function loadturbidity(){
  // Get the data
  d3.json("http://167.99.198.145/api/data", function(error, data) {
  if (error) throw error;
  
  // trigger render
  draw4(data);
  
  });
}

setInterval(function(){
  loadturbidity();
},5000);*/