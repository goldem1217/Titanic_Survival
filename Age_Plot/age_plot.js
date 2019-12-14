var svgWidth = 1000;
var svgHeight = 660;

var chartMargin = {
  top: 100,
  right: 30,
  bottom: 30,
  left: 30
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var tip1 = d3.tip()
.attr('class', 'd3-tip')
.offset([-20, 0])
.html(function(d) {
  return (`<strong>Age: ${d.age}<strong><h6>${d.percent_s}% Survived</h6>`);
})
var tip2 = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
  return (`<strong>Age: ${d.age}<strong><h6>${d.survivors} Survived</h6>`);
})

///////////////////////////////////////////////////////////////////////

d3.select("body")
.append("div")
.attr("class", "container")
.html(
  "<select id='options'>\
  <option value='ages.csv' selected='selected'>Ages</option>\
  <option value='binned_ages.csv'>Age Groups</option>\
  </select>\
  <select id='options2'>\
  <option value='ages.csv' selected='selected'>Ages</option>\
  <option value='binned_ages.csv'>Age Groups</option>\
  </select><br>");

var svg = d3
  .select("div")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)

///////////////////////////////////////////////////////////////////////

function chart1(csv){
  d3.csv(csv).then(function(ageData) {
    if(csv === 'ages.csv'){
      ageData.forEach(function(data) {
          data.age = +data.age;
          data.total_onboard = +data.total_onboard;
          data.survivors = +data.survivors;
          data.deceased = +data.deceased;
          data.percent_s = +data.percent_s;
          data.percent_d = +data.percent_d;        
        });
    };
    if(csv === 'binned_ages.csv'){
      ageData.forEach(function(data) {
          data.age = data.age;
          data.total_onboard = +data.total_onboard;
          data.survivors = +data.survivors;
          data.deceased = +data.deceased;
          data.percent_s = +data.percent_s;
          data.percent_d = +data.percent_d;        
        });
    };

  var barSpacing = 3;
  var scaleY = 5;

  var barWidth = (chartWidth - (barSpacing * (ageData.length - 1))) / ageData.length;

  var ageLabels = ageData.map(function(d) { 
    return d.age });

  var yScale = d3.scaleLinear()
  .domain([0,100])
  .range([chartHeight, 0]);

  var xScale = d3.scaleBand()
  .domain(ageLabels)
  .range([0, chartWidth])
  .padding(0.05);

  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale)

  chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .attr("class", "axis")
  .call(xAxis);
  

  chartGroup.append("g")
  .attr("class", "axis")
  .call(yAxis);

  //d3.select('.axis')
  //.attr("stroke","#E04836")
  //.attr("stroke-width","6")
  //.attr("opacity",".6");


  var barsGroup = chartGroup.selectAll(".bar")
  .data(ageData)
  .enter()
  .append("rect")
  .classed("bar", true)
  .attr("id", "fix")
  .attr("width", d => barWidth)
  .attr("height", d => (yScale(100-d.percent_s)))
  .attr("x", (d, i) => i * (barWidth + barSpacing))
  .attr("y", d => chartHeight - yScale(100-d.percent_s));

  
  chartGroup.call(tip1);

  barsGroup.on("mouseover", function(d) {
      tip1.show(d, this)})
      .on("mouseout", function(d) {
        tip1.hide(d);

      });
  });
};

function chart2(csv) {
d3.csv(csv).then(function(ageData) {
  if(csv === 'ages.csv'){
    ageData.forEach(function(data) {
        data.age = +data.age;
        data.total_onboard = +data.total_onboard;
        data.survivors = +data.survivors;
        data.deceased = +data.deceased;
        data.percent_s = +data.percent_s;
        data.percent_d = +data.percent_d;        
      });
  };
  if(csv === 'binned_ages.csv'){
    ageData.forEach(function(data) {
        data.age = data.age;
        data.total_onboard = +data.total_onboard;
        data.survivors = +data.survivors;
        data.deceased = +data.deceased;
        data.percent_s = +data.percent_s;
        data.percent_d = +data.percent_d;        
      });
  };

var barSpacing = 3;
var scaleY = 5;

var barWidth = (chartWidth - (barSpacing * (ageData.length - 1))) / ageData.length;

var ageLabels = ageData.map(function(d) { 
  return d.age });

var yLimit = d3.max(ageData, function(d) { 
  return d.survivors; 
});

var yScale = d3.scaleLinear()
.domain([0,yLimit])
.range([chartHeight, 0]);

var xScale = d3.scaleBand()
.domain(ageLabels)
.range([0, chartWidth])
.padding(0.05);

var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale)

chartGroup.append("g")
.attr("transform", `translate(0, ${chartHeight})`)
.attr("class", "axis")
.call(xAxis).selectAll("text")

chartGroup.append("g")
.attr("class", "axis")
.call(yAxis);

var barsGroup = chartGroup.selectAll(".bar")
.data(ageData)
.enter()
.append("rect")
.classed("bar", true)
.attr("id", "fix")
.attr("width", d => barWidth)
.attr("height", d => (yScale(yLimit-d.survivors)))
.attr("x", (d, i) => i * (barWidth + barSpacing))
.attr("y", d => chartHeight - yScale(yLimit-d.survivors));


chartGroup.call(tip2);

barsGroup.on("mouseover", function(d) {
    tip2.show(d, this)})
    .on("mouseout", function(d) {
      tip2.hide(d);

    });
});
};

//////////////////////////////////////////////////////////////////////////////////
d3.select('#options')
.on("change", function () {
  var sect = document.getElementById("options");
  var section = sect.options[sect.selectedIndex].value;

  d3.selectAll("rect").remove();
  d3.selectAll(".axis").remove();

  console.log(section)
  console.log("as percentages")

  return chart1(section)

  
  });

d3.select('#options2')
.on("change", function () {
  var sect = document.getElementById("options2");
  var section = sect.options[sect.selectedIndex].value;

  d3.selectAll("rect").remove();
  d3.selectAll(".axis").remove();

  console.log(section)
  console.log("as whole numbers")


  return chart2(section)

  
  });
  

chart1(`ages.csv`)