
// ------- GRAPHS --------

// Bar Chart

function barChart(summaries) {
  const yearDataSupplier = [];
  const yearDataBuyer = [];
  const yearDataFunder = [];
  const barColors = {
    "Importe de contratos como proveedor": "#278529",
    "Cantidad de contratos como proveedor": "#1b5d1c",
    "Importe de contratos como comprador": "#db2828",
    "Cantidad de contratos como comprador": "#991c1c",
    "Importe de contratos como financiador": "#DA9488",
    "Cantidad de contratos como financiador": "#af2020"
  }

  let year_isSupplier = false;
  let year_isBuyer = false;
  let year_isFunder = false;
  let index_supplier_amount,index_supplier_count,index_buyer_amount,index_buyer_count,index_funder_amount,index_funder_count = null;

  for (y in summaries.year) {
    if (summaries.year[y].supplier.value || summaries.year[y].supplier.count) {
      year_isSupplier = true;
    }
    if (summaries.year[y].buyer.value || summaries.year[y].buyer.count) {
      year_isBuyer = true;
    }
    if (summaries.year[y].funder.value || summaries.year[y].funder.count) {
      year_isFunder = true;
    }
  }

  if (year_isSupplier) {
    index_supplier_amount = yearDataSupplier.length;
    yearDataSupplier.push(
      {
        "key" : "Importe de contratos como proveedor" ,
        "bar": true,
        "values" : [],
      }
    )
    index_supplier_count = yearDataSupplier.length;
    yearDataSupplier.push(
      {
          "key" : "Cantidad de contratos como proveedor" ,
          "values" : [],
          // "color": "#1b5d1c"
      },
    )
  }
  if (year_isBuyer) {
    index_buyer_amount = yearDataBuyer.length;
    yearDataBuyer.push(
      {
          "key" : "Importe de contratos como comprador" ,
          "bar": true,
          "values" : [],
          "color": "#db2828"
      },
    )
    index_buyer_count = yearDataBuyer.length;
    yearDataBuyer.push(
      {
          "key" : "Cantidad de contratos como comprador" ,
          "values" : [],
          "color": "#991c1c"
      },
    )
  }
  if (year_isFunder) {
    index_funder_amount = yearDataFunder.length;
    yearDataFunder.push(
      {
          "key" : "Importe de contratos como financiador" ,
          "bar": true,
          "values" : [],
          "color": "#b6893e"
      },
    )
    index_funder_count = yearDataFunder.length;
    yearDataFunder.push(
      {
          "key" : "Cantidad de contratos como financiador" ,
          "values" : [],
          "color": "#5b441f"
      },
    )
  }

  for (y in summaries.year) {
    if (year_isSupplier) {
      yearDataSupplier[index_supplier_amount].values.push({
        x: y,
        y: summaries.year[y].supplier.value
      })
      yearDataSupplier[index_supplier_count].values.push({
        x: y,
        y: summaries.year[y].supplier.count
      })
    }
    if (year_isBuyer) {
      yearDataBuyer[index_buyer_amount].values.push({
        x: y,
        y: summaries.year[y].buyer.value
      })
      yearDataBuyer[index_buyer_count].values.push({
        x: y,
        y: summaries.year[y].buyer.count
      })
    }
    if (year_isFunder) {
      yearDataFunder[index_funder_amount].values.push({
        x: y,
        y: summaries.year[y].funder.value
      })
      yearDataFunder[index_funder_count].values.push({
        x: y,
        y: summaries.year[y].funder.count
      })
    }
  }

// FUNCIÓN PARA SEPARAR Y DAR UN NUEVO ID Y NUEVA VARIABLES DE YEARDATA PARA CADA UNO

function charts(idChart, dataChart) {
    var chart;

    nv.addGraph(function() {
    chart = nv.models.linePlusBarChart()
        .margin({top: 0, right: 30, bottom: 15, left: 100})
        .legendRightAxisHint(' [der.]')
        .legendLeftAxisHint(' [izq.]')
        .color(function(d,i){ return barColors[d.originalKey]})
        .focusEnable(false)

    chart.y1Axis
    .tickFormat(function(d) { return '$' + d3.format(',f')(d) });

    d3.select(idChart+' svg')
        .datum(dataChart)
        .transition().duration(500).call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
    console.log(idChart);
    console.log(dataChart);
    return chart;
  });
}

charts("#chartSupplier", yearDataSupplier);
charts("#chartBuyer", yearDataBuyer);
charts("#chartFunder", yearDataFunder);


}
// console.log(summaries.type)


// Pie Chart

function pieChart(summaries) {
  const typeData = {
    buyer: [],
    supplier: [],
    funder: []
  }

  let isBuyerType = false;
  let isSupplierType = false;
  let isFunderType = false;

  for (t in summaries.type) {
    if (summaries.type[t].buyer.count != 0) {
      isBuyerType = true;
    }
    if (summaries.type[t].supplier.count != 0) {
      isSupplierType = true;
    }
    if (summaries.type[t].funder.count != 0) {
      isFunderType = true;
    }
    typeData.buyer.push({
      "label": t,
      "value": summaries.type[t].buyer.count
    })
    typeData.supplier.push({
      "label": t,
      "value": summaries.type[t].supplier.count
    })
    typeData.funder.push({
      "label": t,
      "value": summaries.type[t].funder.count
    })
  }

  const nameLabels = {
    "open": "Licitación abierta",
    "direct": "Adjudicación Directa",
    "limited": "Invitación a tres",
    "undefined": "Sin definir",
    "": "Sin información"
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
          .color(function (d) { return procurementColors[d.label] })
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
          .color(function (d) { return procurementColorsBuyer[d.label] })
          .showLabels(true)

        d3.select("#piechartBuyer")
            .append("svg")
            .datum(typeData.buyer)
            .transition().duration(350)
            .call(chart);


      return chart;
    });
  }

  const procurementColorsFunder = {
    "open": "#9f7836",
    "direct": "#e4ac4e",
    "limited": "#ecc483",
    "undefined": "#8b8b8b"
  }

  if (isFunderType) {
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return nameLabels[d.label] })
          .y(function(d) { return d.value })
          .color(function (d) {  return procurementColorsFunder[d.label] })
          .showLabels(true)

        d3.select("#piechartFunder")
            .append("svg")
            .datum(typeData.funder)
            .transition().duration(350)
            .call(chart);


      return chart;
    });
  }


}




//



// Force-directed Graph
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

  const name_legend = [
    { label: 'Institución', color: "#aec7e8" },
    { label: 'Empresa', color: "#ff7f0e" },
    { label: 'Persona', color: "#ffbb78" },
    { label: 'Dependencia', color: "#2ca02c" },
    { label: 'Licitación abierta', color: "#98df8a" },
    { label: 'Adjudicación Directa', color: "#ff9896" },
    { label: 'Invitación a tres', color: "#d62728" },
    { label: 'Sin definir', color: "#8b8b8b" },
    { label: 'Regular', color: "#9467bd" }
  ];

  const node_legend = [
    { label: 'Institución', color: "#aec7e8" },
    { label: 'Empresa', color: "#ff7f0e" },
    { label: 'Persona', color: "#ffbb78" },
    { label: 'Dependencia', color: "#2ca02c" },
  ];

  const link_legend = [
    { label: 'Licitación abierta', color: "#98df8a" },
    { label: 'Adjudicación Directa', color: "#ff9896" },
    { label: 'Invitación a tres', color: "#d62728" },
    { label: 'Sin definir', color: "#8b8b8b" },
    { label: 'Regular', color: "#9467bd" }
  ];

  const linkLabels = {
    "open": "Licitación abierta",
    "direct": "Adjudicación Directa",
    "limited": "Invitación a tres",
    "undefined": "Sin definir",
    "regular": "Regular",
    "": "Sin información"
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
      d4.forceCollide(function (d) { return radius(d.weight)*1.5 })
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

// Legend
  var legendRectSize = 18;  
  var legendSpacing = 4;    

  var legend = svg.selectAll('.legend')                  
          .data(node_legend)                                
          .enter()                                             
          .append('g')                                         
          .attr('class', 'legend')                             
          .attr('transform', function(d, i) {                  
            var height = legendRectSize + legendSpacing;       
            var offset =  height * color.domain().length / 2;  
            var horz = 0;                       // NEW
            var vert = i * height - offset;                    
            return 'translate(' + horz + ',' + vert + ')';     
          });                                                    
        
        legend.append("circle")
          .attr("cx", 7)
          .attr("cy", 7.7) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style('fill', function(d) { return d.color; })                                
          .style('stroke', function(d) { return d.color; });

        legend.append('text')                                  
          .attr('x', legendRectSize + legendSpacing)           
          .attr('y', legendRectSize - legendSpacing)           
          .text(function(d) { return d.label; });
          
  var legend2 = svg.selectAll('.legend2')                  
          .data(link_legend)                                
          .enter()                                             
          .append('g')                                         
          .attr('class', 'legend2')                             
          .attr('transform', function(d, i) {                  
            var height = legendRectSize + legendSpacing;       
            var offset =  height * color.domain().length / 2;  
            var horz = 150;                       // NEW
            var vert = i * height - offset;                    
            return 'translate(' + horz + ',' + vert + ')';     
          });

          legend2.append('rect')                                  
          .attr('width', legendRectSize)                       
          .attr('height', 4)                      
          .style('fill', function(d) { return d.color; })                                
          .style('stroke', function(d) { return d.color; });
          
          legend2.append('text')                                  
          .attr('x', legendRectSize + legendSpacing)           
          .attr('y', legendRectSize - legendSpacing)           
          .text(function(d) { return d.label; });


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
      .on("mouseover", function(d) {
        dOverLink = d;
        d4.select(this).style("cursor", "none");
        var linkTooltip = d4.select("body")//svg
        .append("div")
        .attr('class', 'foreign-tooltip')
        
        linkTooltip.append("div")
        .attr('class', 'node-tooltip')
        .html(function(d) {
          return '<p class="name">' + linkLabels[dOverLink.type] + ': ' + dOverLink.weight + '</p>';
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
        dOverLink = [];
        d4.select(this).style("cursor", "default");
        d4.select(".foreign-tooltip")
        .remove();
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
