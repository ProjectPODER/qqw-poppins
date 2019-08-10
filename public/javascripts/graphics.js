
// ------- GRAPHS --------

// Bar Chart
const yearData = [
  {
      "key" : "Importe vendedor" ,
      "bar": true,
      "values" : []
  },
  {
      "key" : "Cantidad vendedor" ,
      "values" : []
  },
  {
      "key" : "Importe comprador" ,
      "bar": true,
      "values" : []
  },
  {
      "key" : "Cantidad comprador" ,
      "values" : []
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
      .color(d3.scale.category20().range().slice(1))
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

// console.log(summaries.type)

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

// console.log(typeData);

// Pie Chart
if (isSupplierType) {
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .color(d3.scale.category20().range().slice(1))
        .showLabels(true);

      d3.select("#piechartSupplier")
          .append("svg")
          .datum(typeData.supplier)
          .transition().duration(350)
          .call(chart);

    return chart;
  });
}

if (isBuyerType) {
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .color(d3.scale.category20().range().slice(1))
        .showLabels(true);

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







// 



//------ Force-directed Graph
function flujosProveedores(relationSummary) {

  console.log("Force-directed Graph",1)

  var chartDiv = document.getElementById("graph-container");
  // $(chartDiv).height(500);
  var width = chartDiv.clientWidth;
  var height = chartDiv.clientHeight;
  var slide;
  var vWidth = document.body.clientWidth;

  var centerCoor = [], radiusRange = [], linkDistance, nodeDistance;

  if(vWidth <= 767) {
    centerCoor = [width * 0.5, height * 0.5];
    radiusRange = [3,25];
    linkDistance = 10;
    nodeDistance = 7;
  } else if(vWidth >= 768 && vWidth <= 1007) {
    centerCoor = [width * 0.5, height * 0.5];
    radiusRange = [4,50];
    linkDistance = 20;
    nodeDistance = 14;
  } else if(vWidth >= 1008 && vWidth <= 1199) {
    centerCoor = [width * 0.5, height * 0.5];
    radiusRange = [4,50];
    linkDistance = 20;
    nodeDistance = 14;
  } else if(vWidth >= 1200 && vWidth <= 1439) {
    centerCoor = [width * 0.5, height * 0.5];
    radiusRange = [4,50];
    linkDistance = 20;
    nodeDistance = 14;
  } else if(vWidth >= 1440) {
    centerCoor = [width * 0.5, height * 0.5];
    radiusRange = [4,50];
    linkDistance = 20;
    nodeDistance = 14;
  }

  function findNode(value) {
    for(var i = 0; i < nodes.length; i += 1) {
      if(nodes[i]["id"] === value) {
        return i;
      }
    }
    return -1;
  }

  function findLink(value) {
    for(var i = 0; i < links.length; i += 1) {
      if(links[i]["id"] === value) {
        return i;
      }
    }
    return -1;
  }

  function blend_colors(color1, color2, percentage) {
    color1 = color1 || '#000000';
    color2 = color2 || '#ffffff';
    percentage = percentage || 0.5;

    if (color1.length != 4 && color1.length != 7)
    throw new error('colors must be provided as hexes');

    if (color2.length != 4 && color2.length != 7)
    throw new error('colors must be provided as hexes');

    if (percentage > 1 || percentage < 0)
    throw new error('percentage must be between 0 and 1');

    if (color1.length == 4)
    color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
    else
    color1 = color1.substring(1);
    if (color2.length == 4)
    color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
    else
    color2 = color2.substring(1);

    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];

    var color3 = [
      (1 - percentage) * color1[0] + percentage * color2[0],
      (1 - percentage) * color1[1] + percentage * color2[1],
      (1 - percentage) * color1[2] + percentage * color2[2]
    ];

    color3 = '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

    return color3;
  }

  function int_to_hex(num) {
    var hex = Math.round(num).toString(16);
    if (hex.length == 1)
    hex = '0' + hex;
    return hex;
  }

  function zoomed() {
    chart.attr("transform", d4.event.transform);
  }

  var zoom = d4.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  // console.log("Force-directed Graph",2)

  var svg = d4.select("#graph-container")
    .append('svg')
    .attr('width', width)
    .attr('height', height);
    // .call(zoom);

  var chart = svg.append("g")
    .attr("class", "nodesChart");

  var radius = d4.scaleSqrt()
    .range(radiusRange);

  var color = d4.scaleOrdinal(d4.schemeCategory20); //d4.scale.category20().range().slice(1)

  // Nodos dependencia: org, unidadesCompradoras, contratos, proveedores
  // Nodos empresa: org, contratos, department, dependency
  // links: org-contrato, contrato-department, department-dependency

  data = summaries.relation;
  console.log(summaries.relation);

  var dOver = [];

  nodes = data.nodes;
  links = data.links;

  var simulation = d4.forceSimulation(nodes)
    .force("charge", d4.forceManyBody().strength(10).distanceMax(180))
    .force("center", d4.forceCenter(centerCoor[0], centerCoor[1]))
    .force("link", d4.forceLink().id(function(d) { return d.id; }).distance(linkDistance).strength(3))
    // .force("x", d4.forceX().x(centerCoor[0]).strength(0.9))
    // .force("y", d4.forceY().y(centerCoor[1]).strength(0.9))
    // .alphaTarget(0.02)
    .force("collide", d4.forceCollide(function (d) { return d.weight+15; })
    .strength(0.7))
    // .force("radial", d4.forceRadial(200,centerCoor[0],centerCoor[1]))
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
      // .style("fill", function(d) {
      //   var color = "";
      //   console.log(activeNodes.indexOf(d.id));
      //   if(activeNodes.indexOf(d.id) != -1) {
      //     color = d.color;
      //   } else {
      //     color = blend_colors(d.color, "#F3F3F3", 0.85);
      //   }
      //   console.log(color);
      //   return color;
      // })
      .attr("r", function(d){ return radius(d.weight); })
      .on("mouseover", function(d) {
        dOver = d;
        d4.select(this).style("cursor", "none");
        // tpActive = true;
        var nodeTooltip = d4.select("body")//svg
        .append("div")
        .attr('class', 'foreign-tooltip')
        // .attr('x', dOver.x - 80)
        // .attr('y', dOver.y + 20)

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
      var color = "";
      // console.log(activeNodes.indexOf(d.id));
      color = d.color;
      // if(activeNodes.indexOf(d.id) != -1) {
      // } else {
      //   color = blend_colors(d.color, "#F3F3F3", 0.90);
      // }
      // console.log(color);
      return color;
    })

    // d4.selectAll(".node").selectAll("text").remove();

    //TODO: Agregar texto para nodos con mucho weight
    nodeLabel = d4.select("#node0").append("text")
      .html(function(d) {
        return d.label;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '1rem')//12
      .attr('dy', '.35em')
      .attr('pointer-events', 'none')
      .attr('class', 'bubble-label');

    // Apply the general update pattern to the links.
    link = link.data(links);//, function(d) { return links[findWithAttr(links, "id", d.source)] + "-" + links[findWithAttr(links, "id", d.target)]; });
    link.exit().remove();
    link = link.enter().append("line")
      .attr("stroke", function(d) {
        // console.log(d);
        return "#999";
        //return blend_colors(nodes[findNode(d.source)].color, nodes[findNode(d.target)].color, 0.5);
      })
      .merge(link);

    d4.selectAll("line")
      .style("opacity", function(d) {
        var op;
        // console.log(activeNodes.indexOf(d.id));
        op = 0.8;
        // if(activeLinks.indexOf(d.id) != -1) {
        // } else {
        //   op = 0.4;
        // }
        // console.log(color);
        return op;
      })
      .attr("stroke-width", function(d) {
        var sw;
        // console.log(activeNodes.indexOf(d.id));
        // sw = d.weight;
        sw = 2;

        // if(activeLinks.indexOf(d.id) != -1) {
        // } else {
        //   sw = 1;
        // }
        // console.log(color);
        return sw;
      })

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links).id(function(d) { return d.id; });
    // simulation.force("link", d4.forceLink(links).id(function(d) { return d.id; }).distance(40));
    simulation.alpha(0.05);
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

    // if(tpActive) {
    //   svg.select('.foreign-tooltip')
    //     .attr('x', dOver.x - 80)
    //     .attr('y', dOver.y + 20)
    // }
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

function addLink (relationSummary,link) {
  if (relationSummary.links.length > 1000) return false;

  var source = _.findWhere(relationSummary.nodes,{"label": link.source});
  var target = _.findWhere(relationSummary.nodes,{"label": link.target});

  if (source&&target) {

    // console.log("addLink",link,sourceId,target.id);
    if (!source.fixedWeight){
      source.weight = source.weight + 0.5;
    }
    if (!_.findWhere(relationSummary.links,{source: source.id,target: target.id})) {
      // console.log("addLink",link);
      relationSummary.links.push({id:relationSummary.links.length,source:source.id,target:target.id})
    }
  }
  else {
    console.error("Faltó agregar algún nodo",link);
  }
}
function addNode(relationSummary,node) {
  if (relationSummary.nodes.length > 400) return false;

  if (!_.findWhere(relationSummary.nodes,{label: node.label})) {
    // console.log("addNode",node);
    node.id = relationSummary.nodes.length;
    relationSummary.nodes.push(node);
  }
  return true;
}

function maxContractAmount(contracts) {
  return contracts[0].contracts[0].value.amount;
}

function drawGraphs(drawn,org) {
  var oc = Session.get("orgContracts");
  console.log("drawGraphs",drawn);
  drawn[0] = true;

  if (oc && oc.length > 0) {
    console.log("orgContracts",oc,drawn);

    //Esto es para que corra una sola vez

    var orgName = org.name;

    //Generar los objetos para cada gráfico
    let summary = {}
    let typeSummary = {}
    let ramoSummary = {}
    let relationSummary = {nodes: [], links: []}

    let nodeNumber = 1;
    let linkNumber = 1;

    //organización 1
    addNode(relationSummary,{"label":orgName,"weight":50,"color":"#b22200","cluster":1},nodeNumber);

    for (c in oc) {
      let cc = oc[c];
      let year = new Date(cc.contracts[0].period.startDate).getFullYear();
      if (!summary[year]) {
        summary[year] = {value: 0, count: 0}
      }
      //TODO: sumar los amounts en MXN siempre

      summary[year].value += cc.contracts[0].value.amount;
      summary[year].count += 1;

      if (!typeSummary[cc.tender.procurementMethodMxCnet]) {
        typeSummary[cc.tender.procurementMethodMxCnet] = 0;
      }
      typeSummary[cc.tender.procurementMethodMxCnet]++;

      var buyer = cc.parties[0];
      var ramo = buyer.id.toString().substr(0,3);
      if (!ramoSummary[ramo]) {
        ramoSummary[ramo] = {};
      }
      if (!ramoSummary[ramo][buyer.memberOf.name]) {
        ramoSummary[ramo][buyer.memberOf.name] = 0;
      }
      //TODO: sumar los amounts en MXN siempre
      ramoSummary[ramo][buyer.memberOf.name] += cc.contracts[0].value.amount;

      // Nodos dependencia: org, unidadesCompradoras, contratos, proveedores
      // Nodos empresa: org, contratos, department, dependency
      // links: org-contrato, contrato-department, department-dependency

      //adjudicación 2
      addNode(relationSummary,{"label":cc.tender.procurementMethodMxCnet,"weight":10,"color":"#282ffb","cluster":1})
      addLink(relationSummary,{source:orgName,target:cc.tender.procurementMethodMxCnet});
      //contratos 3
      addNode(relationSummary,{"label":cc.contracts[0].title,"weight":(cc.contracts[0].value.amount/maxContractAmount(oc))*25,fixedWeight: true, "color":"#282f6bcc","cluster":2})
      addLink(relationSummary,{source:cc.tender.procurementMethodMxCnet,target:cc.contracts[0].title});
      //departamento 4
      addNode(relationSummary,{"label":cc.buyer.name,"weight":10,"color":"#aec7e8","cluster":3})
      addLink(relationSummary,{source:cc.contracts[0].title,target:cc.buyer.name});

      if (org.isPublic()) {
        // proveedor 5
        let added = addNode(relationSummary,{"label":cc.parties[1].name,"weight":15,"color":"#ff7f0e","cluster":4})
        if (added) {
          addLink(relationSummary,{source:cc.parties[1].name,target:cc.buyer.name});
        }

      }
      else {
        // dependencia 5
        // console.log(1,cc.parties[0].memberOf.name);
        let added = addNode(relationSummary,{"label":cc.parties[0].memberOf.name,"weight":15,"color":"#ff7f0e","cluster":4})
        // console.log(2,added,cc.buyer.name);
        if (added == true) {
          addLink(relationSummary,{source:cc.parties[0].memberOf.name,target:cc.buyer.name});
          // console.log(3);
        }
        else {
          // console.log("4")
        }
      }

    }
    // console.log("relationSummary",relationSummary);


  }
  return drawn;
}


flujosProveedores();
