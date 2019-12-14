var file1 = "peopleByFareClass1.csv";
var file2 = "peopleByFareClass2.csv";
var file3 = "peopleByFareClass3.csv";

var svgWidth = 960;
var svgHeight = 700;

var margin = {
  top: 60,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".farechart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

graphData("peopleByFareClass1.csv");
// Create axes labels
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "fareaxistext")
    .text("Fare");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "fareaxistext")
    .text("People Grouped by Fare");



// Import Data
function graphData(csvfile) {
    d3.csv(csvfile).then(function(titanicData) {
        d3.selectAll("circle").remove() 
        d3.selectAll(".fareaxis").remove() 
        d3.selectAll(".grid").remove() 
        // Step 1: Parse Data/Cast as numbers
        // ==============================
        titanicData.forEach(function(data) {
        data.fare = +data.fare;
        data.passengers = +data.passengers;
        data.survived = +data.percentSurvived;
        //console.log(data.passengers);
        });
        
        //var titanicFiltered = titanicData.filter(d => d.class = 1);
        console.log(titanicData);
        
        
        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([0, d3.max(titanicData, d => d.passengers)])
            .range([0, width]);
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(titanicData, d => d.fare)])
            .range([height, 0]);

        var zLinearScale = d3.scaleLinear()
            //.domain([d3.min(titanicData, d => d.percentSurvived),d3.max(titanicData, d => d.percentSurvived)])
            .domain([0,d3.max(titanicData, d => d.survived)+20])
            .range([0, 100]);

          // function make_x_axis() {        
          //     return xLinearScale
          //          .orient("bottom")
          //          .ticks(5)
          // }
          
          // function make_y_axis() {        
          //     return yLinearScale
          //         .orient("left")
          //         .ticks(5)
          // }

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
            .attr("class","fareaxis")
            .call(bottomAxis);

        chartGroup.append("g")
            .attr("class","fareaxis")
            .call(leftAxis);
        
        chartGroup.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(bottomAxis
            .ticks(10)
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )
    
        chartGroup.append("g")         
            .attr("class", "grid")
            .call(leftAxis
                .ticks(10)
                .tickSize(-width, 0, 0)
                .tickFormat("")
            )
        // Step 5: Create Circles
        // ==============================
            
        var circlesGroup = chartGroup
        //.attr("clip-path", "url(#clip)")
        .selectAll("circle")
        .data(titanicData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.passengers))
        .attr("cy", d => yLinearScale(d.fare))
        .attr("r", function (d) { return zLinearScale((d.survived + 20)/2); })
        .attr("fill", function (d) { return myColor(d.survived); })
        .attr("opacity", ".75");

            // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
        .attr("class", "faretooltip")
        //.offset([80, -60])
        .offset([80,0])
        .html(function(d) {
        return (`${d.survived}% Survived<br>Fare: £${d.fare}`);
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
        .attr("r", function (d) { return zLinearScale(d.survived+20); })
        .attr("opacity", "1");
        //.attr("fill", "red");
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        d3.select(this)
        .transition()
        .duration(750)
        .attr("r", function (d) { return zLinearScale((d.survived+20)/2); })
        .attr("fill", function (d) { return myColor(d.survived); })
        .attr("opacity", ".75");
        });




    // transition on page load
    chartGroup.selectAll("circle")
        .attr("fill", "white")
        .attr("opacity",".5")
        .transition()
        .duration(1200)
        .attr("fill", function (d) { return myColor(d.survived); })
        .attr("opacity", ".75");

    

      //create zoom handler 
      var zoom_handler = d3.zoom()
          .on("zoom", zoom_actions);

      //specify what to do when zoom event listener is triggered 
      function zoom_actions(){
      circlesGroup.attr("transform", d3.event.transform);
      
      }

      //add zoom behaviour to the svg element 
      //same as svg.call(zoom_handler); 
      zoom_handler(chartGroup);


    }).catch(function(error) {
    console.log(error);
    })
};

// List of groups (here I have one group per column)
var allGroup = ["First Class", "Second Class", "Third Class"]

// add the options to the button
d3.select("#selectButton")
.selectAll('myOptions')
    .data(allGroup)
.enter()
    .append('option')
.text(function (d) { return d; }) // text showed in the menu
.attr("value", function (d) { return d; }) // corresponding value returned by the button// List of groups (here I have one group per column)

// When the button is changed, run the updateChart function
d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")

    if (selectedOption==="Second Class") {
        graphData(file2);
    } else if (selectedOption==="Third Class") {
        graphData(file3);
    } else {
        graphData(file1);
    };
    });