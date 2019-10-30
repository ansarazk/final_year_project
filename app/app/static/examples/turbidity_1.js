//Javascript code for fetching turbidity and plotting it as a bar chart


// set the dimensions of the canvas
var margin = {top: 50, right: 20, bottom: 70, left: 32},
    width = 380 ;//- margin.left - margin.right,
    height = 145 ;//- margin.top - margin.bottom;
 
// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
 
var y = d3.scale.linear().range([height, 0]);
 
// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
 
 
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var div = d3.select("body").append("div")
    .attr("class","tooltip")
    .style("opacity",0);

// SVG 2st graph
var svg1 = d3.select("body div#tur").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform","translate(" + margin.left + "," + margin.top + ")");

//data for graph 2
d3.json("http://167.99.198.145/api/data", function(error, data) {
 
    data.forEach(function(d) {
        d.Year = d.time;
        d.Total1 = +d.turbidity;
    });
 
  // scale the range of the data
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.Total1; })]);
 
  // add axis
  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );
  // text label for the x axis
  svg1.append("text")      
  .attr("x", 200)
  .attr("y",  210)
  .style("text-anchor", "middle")
  .text("Time");
 
  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("y", -16)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("(NTU)");
 
 
  // Add bar chart
  svg1.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar1")
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", x.rangeBand()-1)
      .attr("height", function (d) { return height - y(d.Total1); })
      .attr("y", function (d, i) { return y(d.Total1); })
      .on("mouseover", function(d) {		
          div.transition()		
              .duration(200)		
              .style("opacity", 1000);		
          div.html("<b>Turbidity</b>:" +d.Total1 + "<br/>" +"<b>Time</b>:"+d.time)	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
        .on("mouseout", function(d) {		
          div.transition()		
              .duration(1000)		
              .style("opacity", 0);	
      });
});