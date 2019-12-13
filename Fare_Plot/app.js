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
//   .call(d3.zoom().on("zoom", function () {
//     svg.attr("transform", d3.event.transform)
//  }))
// .append("g");

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
      data.passengers_x = +data.passengers_x;
      data.survived_x = +data.percentSurvived_x;
      data.passengers_y = +data.passengers_y;
      data.survived_y = +data.percentSurvived_y;
      console.log(data.passengers_x);
    });
    
    //var titanicFiltered = titanicData.filter(d => d.class = 1);
    console.log(titanicData[0]["passengers"]);

    // List of groups (here I have one group per column)
    var allGroup = ["First Class", "Second Class", "Third Class"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

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

    // var clip = svg.append("defs").append("svg:clipPath")
    //   .attr("id", "clip")
    //   .append("svg:rect")
    //   .attr("width", width )
    //   .attr("height", height )
    //   .attr("x", 0)
    //   .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    
    
    var circlesGroup = chartGroup
    //.attr("clip-path", "url(#clip)")
    .selectAll("circle")
    .data(titanicData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.passengers))
    .attr("cy", d => yLinearScale(d.fare))
    .attr("r", function (d) { return zLinearScale(d.percentSurvived/5); })
    .attr("fill", function (d) { return myColor(d.percentSurvived); })
    .attr("opacity", ".75");

    
    // function update(selectedGroup1,selectedGroup2) {
    //   // Create new data with the selection?
    //   var dataFilter = titanicData.map(function(d){return {fare: d.fare, passengers:d[selectedGroup1], percentSurvived:d[selectedGroup2]} })
    //   console.log(dataFilter);
    //   circlesGroup.selectAll("circle")
    //   .data(dataFilter)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", d => xLinearScale(d.passengers))
    //   .attr("cy", d => yLinearScale(d.fare))
    //   .attr("r", function (d) { return zLinearScale(d.percentSurvived/5); })
    //   .attr("fill", function (d) { return myColor(d.percentSurvived); })
    //   .attr("opacity", ".75");
    // }
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")

      if (selectedOption==="Second Class") {

        graphData2();
      };
      console.log(selectedOption1,selectedOption2);
      // run the updateChart function with this selected option
      update(selectedOption1,selectedOption2)
    })
    // // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    // var zoom = d3.zoom()
    // .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
    // .extent([[0, 0], [width, height]])
    // .on("zoom", updateChart);

    // // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    // svg.append("rect")
    // .attr("width", width)
    // .attr("height", height)
    // .style("fill", "none")
    // .style("pointer-events", "all")
    // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // .call(zoom);

    // A function that updates the chart when the user zoom and thus new boundaries are available
  // function updateChart() {

  //   // recover the new scale
  //   var newX = d3.event.transform.rescaleX(xLinearScale);
  //   var newY = d3.event.transform.rescaleY(yLinearScale);

  //   // update axes with these new boundaries
  //   // bottomAxis.call(d3.axisBottom(newX))
  //   // leftAxis.call(d3.axisLeft(newY))
  //   // d3.axisBottom(xLinearScale);
  //   // d3.axisLeft(yLinearScale);
  //   chartGroup.append("g")
  //     .attr("transform", `translate(0, ${height})`)
  //     .call(bottomAxis)
  //     .call(d3.axisBottom(newX));

  //   chartGroup.append("g")
  //     .call(d3.axisLeft(newY));

  //   // update circle position
  //   circlesGroup = chartGroup.selectAll("circle")
  //   .attr("cx", d => xLinearScale(d.passengers))
  //   .attr("cy", d => yLinearScale(d.fare));
  // }

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

// Import Data
function graphData2 () {
  d3.csv("peopleByFareClass2.csv").then(function(titanicData) {
  chartGroup.selectAll("circle").remove();
  // Step 1: Parse Data/Cast as numbers
  // ==============================
  titanicData.forEach(function(data) {
    data.fare = +data.fare;
    data.passengers = +data.passengers;
    data.survived = +data.percentSurvived;
    data.passengers_x = +data.passengers_x;
    data.survived_x = +data.percentSurvived_x;
    data.passengers_y = +data.passengers_y;
    data.survived_y = +data.percentSurvived_y;
    console.log(data.passengers_x);
  });
  
  //var titanicFiltered = titanicData.filter(d => d.class = 1);
  console.log(titanicData[0]["passengers"]);
  
  // List of groups (here I have one group per column)
  //var allGroup = ["First Class", "Second Class", "Third Class"]

  // // add the options to the button
  // d3.select("#selectButton")
  //   .selectAll('myOptions')
  //  	.data(allGroup)
  //   .enter()
  // 	.append('option')
  //   .text(function (d) { return d; }) // text showed in the menu
  //   .attr("value", function (d) { return d; }) // corresponding value returned by the button

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

  // var clip = svg.append("defs").append("svg:clipPath")
  //   .attr("id", "clip")
  //   .append("svg:rect")
  //   .attr("width", width )
  //   .attr("height", height )
  //   .attr("x", 0)
  //   .attr("y", 0);

  // Create the scatter variable: where both the circles and the brush take place
  
  
  var circlesGroup = chartGroup
  //.attr("clip-path", "url(#clip)")
  .selectAll("circle")
  .data(titanicData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.passengers))
  .attr("cy", d => yLinearScale(d.fare))
  .attr("r", function (d) { return zLinearScale(d.percentSurvived/5); })
  .attr("fill", function (d) { return myColor(d.percentSurvived); })
  .attr("opacity", ".75");

  
  // function update(selectedGroup1,selectedGroup2) {
  //   // Create new data with the selection?
  //   var dataFilter = titanicData.map(function(d){return {fare: d.fare, passengers:d[selectedGroup1], percentSurvived:d[selectedGroup2]} })
  //   console.log(dataFilter);
  //   circlesGroup.selectAll("circle")
  //   .data(dataFilter)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", d => xLinearScale(d.passengers))
  //   .attr("cy", d => yLinearScale(d.fare))
  //   .attr("r", function (d) { return zLinearScale(d.percentSurvived/5); })
  //   .attr("fill", function (d) { return myColor(d.percentSurvived); })
  //   .attr("opacity", ".75");
  // }
  // When the button is changed, run the updateChart function
  // d3.select("#selectButton").on("change", function(d) {
  //   // recover the option that has been chosen
  //   var selectedOption = d3.select(this).property("value")

  //   if (selectedOption==="Second Class") {
  //     var selectedOption1 = "passengers_x";
  //     var selectedOption2 = "percentSurvived_x";
  //   } else if (selectedOption==="Third Class") {
  //     var selectedOption1 = "passengers_y";
  //     var selectedOption2 = "percentSurvived_y";
  //   } else {
  //     selectedOption1 = "passengers";
  //     selectedOption2 = "percentSurvived";
  //   }
  //   console.log(selectedOption1,selectedOption2);
  //   // run the updateChart function with this selected option
  //   update(selectedOption1,selectedOption2)
  // })
  // // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  // var zoom = d3.zoom()
  // .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
  // .extent([[0, 0], [width, height]])
  // .on("zoom", updateChart);

  // // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
  // svg.append("rect")
  // .attr("width", width)
  // .attr("height", height)
  // .style("fill", "none")
  // .style("pointer-events", "all")
  // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  // .call(zoom);

  // A function that updates the chart when the user zoom and thus new boundaries are available
// function updateChart() {

//   // recover the new scale
//   var newX = d3.event.transform.rescaleX(xLinearScale);
//   var newY = d3.event.transform.rescaleY(yLinearScale);

//   // update axes with these new boundaries
//   // bottomAxis.call(d3.axisBottom(newX))
//   // leftAxis.call(d3.axisLeft(newY))
//   // d3.axisBottom(xLinearScale);
//   // d3.axisLeft(yLinearScale);
//   chartGroup.append("g")
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis)
//     .call(d3.axisBottom(newX));

//   chartGroup.append("g")
//     .call(d3.axisLeft(newY));

//   // update circle position
//   circlesGroup = chartGroup.selectAll("circle")
//   .attr("cx", d => xLinearScale(d.passengers))
//   .attr("cy", d => yLinearScale(d.fare));
// }

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
})};