var svgWidth = 960;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("peopleByFareClass1.csv").then(function(titanicData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    titanicData.forEach(function(data) {
      data.fare = +data.fare;
      data.passengers = +data.passengers;
      data.survived = +data.percentSurvived;
    });
    
    //var titanicFiltered = titanicData.filter(d => d.class = 1);
    console.log(titanicData);
    // var peopleByFare = d3.nest()
    //   .key(function(d) { return d.fare; })
    //   .rollup(function(v) { return {
    //     count: v.length,
    //     avgFare: d3.mean(v,function(d) {return d.fare;}),
    //     percentSurvived: Math.round(d3.sum(v,function(d) {return d.survived;})/v.length*100) 
    //     }; })
    //   .object(titanicFiltered);
    //var peopleByFare = [];
    //peopleByFare.push(peopleByFareObj);
    //console.log(peopleByFare);
    

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(titanicData, d => d.passengers)])
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(titanicData, d => d.fare)])
      .range([height, 0]);

    var zLinearScale = d3.scaleLinear()
      .domain([d3.min(titanicData, d => d.percentSurvived),d3.max(titanicData, d => d.percentSurvived)])
      .range([0, 100]);

    var myColor = d3.scaleLinear()
    .domain([0,100])
    .range(['#005580','#b3e6ff'])
    .interpolate(d3.interpolateRgb);;
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(titanicData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.passengers))
    .attr("cy", d => yLinearScale(d.fare))
    .attr("r", function (d) { return zLinearScale(d.percentSurvived/5); })
    .attr("fill", function (d) { return myColor(d.percentSurvived); })
    .attr("opacity", ".75");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`% Survived: ${d.percentSurvived}<br>Fare: $${d.fare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
      d3.select(this)
        .transition()
        .duration(750)
        .attr("r", function (d) { return zLinearScale(d.percentSurvived); })
        .attr("fill", "red");
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      d3.select(this)
        .transition()
        .duration(750)
        .attr("r", function (d) { return zLinearScale(d.percentSurvived/5); })
        .attr("fill", function (d) { return myColor(d.percentSurvived); })
        .attr("opacity", ".75");
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Fare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("People Grouped by Fare");



    // transition on page load
    chartGroup.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("fill", "red");
    }).catch(function(error) {
    console.log(error);
});
