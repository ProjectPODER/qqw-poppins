
// ------- GRAPHS --------

// Bar Chart

function barChart(summaries) {
  const yearData = [
    {
        "key" : "Importe de contratos como proveedor" ,
        "bar": true,
        "values" : [],
        "color": "#278529"
    },
    {
        "key" : "Cantidad de contratos como proveedor" ,
        "values" : [],
        "color": "#1b5d1c"
    },
    {
        "key" : "Importe de contratos como comprador" ,
        "bar": true,
        "values" : [],
        "color": "#db2828"
    },
    {
        "key" : "Cantidad de contratos como comprador" ,
        "values" : [],
        "color": "#991c1c"
    },
  ]

  for (y in summaries.year) {
    yearData[0].values.push({
      x: y,
      y: summaries.year[y].supplier.value
    })
    yearData[1].values.push({
      x: y,
      y: summaries.year[y].supplier.count
    })
    yearData[2].values.push({
      x: y,
      y: summaries.year[y].buyer.value
    })
    yearData[3].values.push({
      x: y,
      y: summaries.year[y].buyer.count
    })
  }

  var chart;
  nv.addGraph(function() {

  chart = nv.models.linePlusBarChart()
      .margin({top: 0, right: 30, bottom: 10, left: 100})
      // .x(function(d,i) { return i })
      // .y(function(d,i) {return d[1] })
      .legendRightAxisHint(' [Eje derecho]')
      .legendLeftAxisHint(' [Eje izquierdo]')
      // .color(d3.scale.category20().range().slice(1))
      .color(function(d){return d.data.color})
      .focusEnable(false)

  // chart.xAxis.tickFormat(function(d) {
  //   var dx = yearData[0].values[d] && yearData[0].values[d].x || 0;
  //   return d3.time.format('%Y')(new Date(dx))
  // });

  chart.y1Axis
  .tickFormat(function(d) { return '$' + d3.format(',f')(d) });

  // chart.bars.forceY([0]).padData(false);
  // chart.lines.forceY([0,2]);

  // chart.x2Axis.tickFormat(function(d) {
  //     return d3.time.format('%Y')(new Date(yearData[0].values[d].x))
  // }).showMaxMin(false);

  d3.select('#chart svg')
      .datum(yearData)
      .transition().duration(500).call(chart);

  nv.utils.windowResize(chart.update);

  chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

  return chart;
});
}
// console.log(summaries.type)

function pieChart(summaries) {
  const typeData = {
    buyer: [],
    supplier: []
  }

  let isBuyerType = false;
  let isSupplierType = false;

  for (t in summaries.type) {
    if (summaries.type[t].buyer.count != 0) {
      isBuyerType = true;
    }
    if (summaries.type[t].supplier.count != 0) {
      isSupplierType = true;
    }
    typeData.buyer.push({
      "label": t,
      "value": summaries.type[t].buyer.count
    })
    typeData.supplier.push({
      "label": t,
      "value": summaries.type[t].supplier.count
    })
  }

  const nameLabels = {
    "open": "Licitación abierta",
    "direct": "Adjudicación Directa",
    "limited": "#Invitación a tres",
    "undefined": "Sin definir"
  } 

  // console.log(typeData);
  const procurementColors = {
    "open": "#1f6a20",
    "direct": "#8AB283",
    "limited": "#DDF8D7",
    "undefined": "#8b8b8b"
  } 
  // Pie Chart
  if (isSupplierType) {
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return nameLabels[d.label] })
          .y(function(d) { return d.value })
          .color(function (d) { console.log(d); return procurementColors[d.label] })
          .showLabels(true);

        d3.select("#piechartSupplier")
            .append("svg")
            .datum(typeData.supplier)
            .transition().duration(350)
            .call(chart);

      return chart;
    });
  }

  const procurementColorsBuyer = {
    "open": "#af2020",
    "direct": "#DA9488",
    "limited": "#FFE5DB",
    "undefined": "#8b8b8b"
  }

  if (isBuyerType) {
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return nameLabels[d.label] })
          .y(function(d) { return d.value })
          .color(function (d) { console.log(d); return procurementColorsBuyer[d.label] })
          .showLabels(true)

        // d3.select("#piechartBuyer")
        //     .append("svg")
        //     .append("text")
        //     .attr("x", 200)
        //     .attr("y", 100)
        //     .attr("text-anchor", "middle")
        //     .text("Sample Charts")
        //     .call(chart);

        d3.select("#piechartBuyer")
            .append("svg")
            .datum(typeData.buyer)
            .transition().duration(350)
            .call(chart);


      return chart;
    });
  }


}




//



//------ Force-directed Graph
function flujosProveedores(summaries) {

  // console.log(summaries.relation);
  const nodes = summaries.relation.nodes;
  const links = summaries.relation.links;
  const node_colors = {
    "institution": "#aec7e8",
    "company": "#ff7f0e",
    "person": "#ffbb78",
    "dependency": "#2ca02c",
  }
  const node_radius = {
    "institution": 6,
    "company": 10,
    "person": 8,
    "dependency": 10,
  }
  const link_colors = {
    "open": "#98df8a",
    "limited": "#d62728",
    "direct": "#ff9896",
    regular: "#9467bd"
  }

  var chartDiv = document.getElementById("graph-container");
  // $(chartDiv).height(500);
  var width = chartDiv.clientWidth;
  var height = chartDiv.clientHeight;
  var slide;

  var centerCoor = [], radiusRange = [];

  centerCoor = [width * 0.5, height * 0.5];
  radiusRange = [4,30];
  strokeRange = [0.1,5];

  var svg = d4.select("#graph-container")
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var chart = svg.append("g")
    .attr("class", "nodesChart");

  var radius = d4.scaleSqrt()
    .range(radiusRange);

  var strokeWidth = d4.scaleSqrt()
    .range(strokeRange);

  var color = d4.scaleOrdinal(d4.schemeCategory20); //d4.scale.category20().range().slice(1)


  var dOver = [];


  var simulation = d4.forceSimulation(nodes)
    .force("charge", d4.forceManyBody().strength(1).distanceMax(width/nodes.length))
    .force("center", d4.forceCenter(centerCoor[0], centerCoor[1]))
    .force("link", d4.forceLink().id(function(d) { return d.id; }).distance(1).strength(0.7))
    .force("collide",
      d4.forceCollide(function (d) { return radius(d.weight)*1.2 })
      .strength(0.9)
    )
    .force("radial", d4.forceRadial(width/4.5,centerCoor[0],centerCoor[1]).strength(0.5))
    .on("tick", ticked);

  var link = chart.append("g")
    .attr("class", "links")
    .selectAll(".link");

  var node = chart.append("g")
    .attr("class", "nodes")
    .selectAll(".node");

  var nodeCircle, nodeLabel;

  function update() {

    radius.domain(d4.extent(nodes, function(d){
      return d.weight;
    })).nice();

    d4.selectAll(".btn").classed("active", false);

    // Apply the general update pattern to the nodes.
    node = node.data(nodes, function(d) { return d.id;});
    node.exit().remove();
    node = node.enter().append("g")
      .attr("id", function(d) { return "node" + d.id;})
      .attr("class", "node")
      .append("circle")
      .attr("r", function(d){ return radius(d.weight); })
      .on("mouseover", function(d) {
        dOver = d;
        d4.select(this).style("cursor", "none");
        var nodeTooltip = d4.select("body")//svg
        .append("div")
        .attr('class', 'foreign-tooltip')

        var tp = nodeTooltip.append("div")
        .attr('class', 'node-tooltip')
        .html(function(d) {
          return '<p class="name">' + dOver.label + '</p>';
        });
      })
      .on("mousemove", function(d) {
        // console.log(d4.mouse(this)[0]);
        d4.select(".foreign-tooltip")
        .style("left", (d4.event.pageX - 80) + "px")
        .style("top", (d4.event.pageY + 10) + "px");
      })
      .on("mouseout", function(d) {
        // tpActive = false;
        dOver = [];
        d4.select(this).style("cursor", "default");
        d4.select(".foreign-tooltip")
        .remove();
      })
      .call(d4.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .merge(node);

    // Colorize active nodes
    d4.selectAll(".node").selectAll("circle")
    .style("fill", function(d) {
      return node_colors[d.type];
    })

    // d4.selectAll(".node").selectAll("text").remove();

    // Apply the general update pattern to the links.
    link = link.data(links);
    link.exit().remove();
    link = link.enter().append("line")
      .attr("stroke", function(d) {
        return link_colors[d.type];
      })
      .merge(link);

    d4.selectAll("line")
      .style("opacity", 0.7)
      .attr("stroke-width", function(d) { return strokeWidth(d.weight); })

    nodeLabel = d4.selectAll(".node").filter(d => {return d.weight>30}).append("text")
      .html(function(d) {
        return d.label;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '1rem')//12
      .style('text-shadow', '2px 2px 2px white')//12
      .attr('dy', '.35em')
      .attr('pointer-events', 'none')
      .attr('class', 'bubble-label');

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links).id(function(d) { return d.id; });
    // simulation.force("link", d4.forceLink(links).id(function(d) { return d.id; }).distance(40));
    simulation.alpha(0.25);
    chart.simulation = simulation;
  }

  function ticked() {
    node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

    nodeLabel
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; });

    link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  }

  function dragstarted(d) {
    if (!d4.event.active) simulation.alphaTarget(0.05).restart();//0.08
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d4.event.x;
    d.fy = d4.event.y;
  }

  function dragended(d) {
    if (!d4.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }


  /******** User interactions ********/

  update();
  return chart;
}

pieChart(summaries);
barChart(summaries);
flujosProveedores(summaries);
