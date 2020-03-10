var filtered_data;
var values;

// Set the dimensions and margins
var margin = {top: 30, right: 60, bottom: 70, left: 80},
width = 1000 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;


//Make chart responsive
window.addEventListener('resize', function () {
  var newWidth = $(".variations-container.row").width() - margin.left - margin.right;
  deleteChart();
  createChart(newWidth, height, filtered_data, values);
});


//Delete chart
function deleteChart() {
  var emptyData = {};
  d3.select(".consejeras_chart")
  .selectAll('svg')
  .data(emptyData)
  .exit()
  .remove();
}

//Create chart
function createChart(newWidth, height, data, y_domain) {

  // Append the svg to the body div
  var svg = d3.select(".consejeras_chart")
  .append("svg")
  .attr("width", newWidth + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

  // Set Y axis scale and styles
  var y = d3.scaleLinear()
  .domain([0, d3.max(y_domain)])
  .rangeRound([ height, 0]);

  svg.append("g")
  .style("font", "14px Lato")
  .call(d3.axisLeft(y)
  .tickSize(0))
  .call(g => g.selectAll(".tick:not(:first-of-type) line").clone()
  .attr("x2", newWidth)
  .attr("stroke-width", 1.5)
  .attr("stroke-opacity", 0.15)
  .attr("stroke-linecap", "round")
  .attr("stroke-dasharray", "0.5, 5"))
  .call(g => g.selectAll(".tick:first-of-type line").clone()
  .attr("x2", newWidth)
  .attr("stroke-width", 2)
  .attr("stroke-opacity", 1)
  .attr("stroke", "#cccccc"))
  .call(g => g.selectAll(".tick text")
  .attr("x", -10)
  .attr("dy", -4)
  .attr("fill", "#333333"))
  .call(g => g.selectAll(".domain").remove());

  // Label Y axis
  svg.append("text")
  .style("font", "14px Lato")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-weight", "bold")
  .attr("fill", "#333333")
  .text("Cantidad de empresas");

  // Set X axis scales and styles
  var x0 = d3.scaleBand()
              .rangeRound([0,newWidth])
              .paddingInner(0.1)
              .domain(data.map(d => d.consejeras_count))
  var x1 = d3.scaleBand()
              .padding(0.05)
              .domain(["2019", "2020"])
              .rangeRound([0, x0.bandwidth()]);

  svg.append("g")
  .style("font", "14px Lato")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0)
  .tickSize(0))
  .call(g => g.selectAll(".tick text")
  .attr("fill", "#333333"))
  .call(g => g.selectAll(".domain").remove())
  .selectAll("text")
  .attr("transform", "translate(0,10)");

  // Label X axis
  svg.append("text")
  .style("font", "14px Lato")
  .attr("y", margin.top + height)
  .attr("x", newWidth/2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-weight", "bold")
  .attr("fill", "#333333")
  .text("Número de consejeras mujeres");

  // Set category color range
  var z = d3.scaleOrdinal()
    .range(["#572bfa", "#2bcdc0"]);

  // Create and style bars
  var barGroups = svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("g")
    .attr("transform", function(d){ return "translate(" + x0(d.consejeras_count) + ",0)"; })
    .attr("class", "bar")

  barGroups.selectAll('rect')
  .data(getSubcategories)
  .enter()
  .append('rect')
    .attr('x', d => x1(d.key))
    .attr('y', d => (d.value < 0 ? y(0) : y(d.value)))
    .attr('width', x1.bandwidth())
    .attr('height', d => Math.abs(y(d.value) - y(0)))
    .attr('fill', d => z(d.key))
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .on("mouseover", function(d) {
      d3.select(this)
      .attr("opacity", 0.85);
    })
    .on("mouseout", function(d) {
      d3.select(this)
      .transition()
      .duration(200)
      .attr("opacity", 1);
    });

  // Data labels
  barGroups.selectAll("text")
  .data(getSubcategories)
  .enter().append("text")
    .attr("x", d => x1(d.key))
    .attr("y", d => y(d.value) - 10)
    .style('fill', d => z(d.key))
    .style('font-size', '1.25em')
    .attr("class", "label")
    .style("font", "14px Lato")
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .attr("dx", x1.bandwidth()/2)
    .text(d => d.value)

  // Legend container
  container = svg.append("rect")
    .style("fill", "white")
    .attr("y", margin.top - 40)
    .attr("x", newWidth - margin.right - 40)
    .attr("width", 95)
    .attr("height", 95)

  // Legend
  svg.append("text")
    .attr("y", margin.top - 15)
    .attr("x", newWidth - margin.right - 20)
    .style("font", "14px Lato")
    .attr("dy", "0.22em")
    .style("text-anchor", "start")
    .style("font-weight", "bold")
    .attr("fill", "#333333")
    .text("Año");

  var legend = svg.append("g")
    .style('font-size', '1.25em')
    .style("font", "14px Lato")
    .attr("text-anchor", "start")
    .attr("class", "legend")
    .attr("fill", "#333333")
    .attr("transform", "translate(0," + margin.top + ")")
  .selectAll("g")
  .data(["2019", "2020"])
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 24 + ")"; });

  legend.append("rect")
    .attr("x", newWidth - margin.right - 20)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", z);

  legend.append("text")
    .attr("x", newWidth - margin.right)
    .attr("y", 5.5)
    .attr("dy", "0.3em")
    .text(d => (d));
}


function getSubcategories(d) {
  return Object.keys(d).filter(key => key !== 'consejeras_count').map(function(key) {
    return { key: +key, value: d[key] };
  });
}


function initializeChart() {
  filtered_data = consejeras_por_empresa.summaries;
  values = filtered_data.reduce((values, cat) => {
    return [...values, cat['datos2019'], cat['datos2020']];
  }, []);
  createChart(width, height, filtered_data, values);
}

initializeChart();
