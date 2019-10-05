var svgWidth = 500;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(jData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    jData.forEach(function(data) {
       // console.log(data.abbr);
      data.income = +data.income;
      data.obesity = +data.obesity;
    //   data.abbr = data.abbr;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([(d3.min(jData, d => d.income)) - 2000, d3.max(jData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([(d3.min(jData, d => d.obesity)) - 1, d3.max(jData, d => d.obesity)])
      .range([height, 0]);

    
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
    .data(jData)
    .enter()
    
    
    circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    circlesGroup.append("text")
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.obesity) + 4)
    .text(d => d.abbr)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .style("font-weight", "bold")
    .attr("fill", "white");

var circleCount= d3.selectAll("circle").size();
var textCount= d3.selectAll("text").size();
console.log(textCount);
console.log(circleCount);
    // // Step 6: Initialize tool tip
    // // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.rockband}<br>Hair length: ${d.income}<br>Hits: ${d.obesity}`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("click", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Household Income (Median)");
  }).catch(function(error) {
    console.log(error);
  });
