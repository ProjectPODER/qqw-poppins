// Navbar animations
$(window).scroll(function() {
    if ($(document).scrollTop() > 500) {
    $('#navbar').addClass('shrink');
  } else {
    $('#navbar').removeClass('shrink');
  }
});

$(window).scroll(function() {
  if ($(document).scrollTop() > 10) {
    $('logo').addClass('shrink');
  } else {
    $('logo').removeClass('shrink');
  }
});

// Footer carousel
$('.owl-carousel').owlCarousel({
  // center: true,
  items:1,
  loop:true,
  margin:0,
  dots:false,
  nav:true,
  navText:['<','>'],
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  responsive:{
      1042:{
          items:1
      },
      992:{
          items:1
      },
      300:{
          items:1
      },
      0:{
          items:1
      }
  }
});

// Autocomplete Typeahead
var qqw_suggest = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: AUTOCOMPLETE_URL+"/\"\"",
  remote: {
    url: AUTOCOMPLETE_URL+'/%QUERY',
    wildcard: '%QUERY',
    transform: function(response) {
      console.log("blood",response.data);
      return response.data;
    }
  }
});


$('.easy-search-input').typeahead({
  hint: true,
  highlight: true,
  minLength: 2
  }, {
  name: 'qqw',
  display: 'name',
  source: qqw_suggest,
  templates: {
      empty: [
        '<div class="empty-message">',
          'No hay resultados para la búsqueda.',
        '</div>'
      ].join('\n'),
      suggestion: function(data){
        if (data.type == "contracts") {
          return '<a href="/' + data.type + '/' + data.ocid + '?supplier=' + data.suppliers_org + '"><div>' + data.title + '</div></a>';
        }
        return '<a href="/' + data.type + '/' + data.simple + '"><div>' + data.name + '</div></a>';
      },
      footer: function(data){
        return '<hr><div class="tt-footer"><a href="/persons?filtername=' + data.query + '"' + '>' + 'Buscar personas con '+ '"<b>' + data.query + '</b>"' + '</a></div>' + '<div class="tt-footer orgs"><a href="/orgs?filtername=' + data.query + '"' + '>' + 'Buscar organizaciones con '+ '"<b>' + data.query + '</b>"' + '</a></div>' + '<div class="tt-footer contracts"><a>' + 'Buscar contratos con '+ '"<b>' + data.query + '</b>"' + '</a></div>';
      },
    }
});

$(".twitter-typeahead").css("width","100%");
/*
#scrollable-dropdown-menu .tt-dropdown-menu {
  max-height: 150px;
  overflow-y: auto;
}
*/


// Tooltips
$('[data-toggle="tooltip"]').tooltip({placement: 'right'});

// Right menu Contract page
$('.right-menu-contracts').affix({offset: {top: 280, bottom:950} });

$('a.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top - 70)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
});

// Copy clipboard
function copyClipboard() {
  var copyText = document.getElementById("apiUrl");
  copyText.select();
  document.execCommand("copy");
  // alert("Copied the text: " + copyText.value);
} 

 // function to set the height on fly
 function autoHeight() {
   $('div.document-body').css('min-height', 0);
   $('div.document-body').css('min-height', (
     $(document).height() 
     - $('nav.bar').height() 
     - $('footer').height()
   ));
 }
function autoHeightb() {
   $('div.contact-template').css('min-height', 0);
   $('div.contact-template').css('min-height', (
     $(document).height() 
     - $('nav.bar').height() 
     - $('footer').height()
   ));
 }
 // onDocumentReady function bind
 $(document).ready(function() {
   autoHeight();
   autoHeightb();
 });

 // onResize bind of the function
 $(window).resize(function() {
   autoHeight();
   autoHeightb();
 });

// Contact form
var to, name, subjectMail, email, text;
$("#send_email").click(function (e) {
  e.preventDefault();
  // enter your email account that you want to recieve emails at.
  name = $("#name").val();
  subjectMail = $("#subject").val();
  email = $("#email").val();
  text = $("#text").val();
  // $("#message").text("Sending E-mail...Please wait");
  $.post("/send", {
      to: to,
      name: name,
      subjectMail: subjectMail,
      email: email,
      text: text
  }, function (data) {
      if (data.status == "sent") {
            console.log("Email sent");
            $("#contactForm").hide()
            $("#thanks-column").show().removeClass("hidden");
      }
      if (data.status == "error") {
            console.log("No email sent");
            alert("Le pedimos discupas, su correo no se ha podido enviar. Por favor intente de nuevo.")
      }
  },"json").fail(function(error) {
    console.error(error);
  })
  return false;
});

// ------- GRAPHS --------

// Bar Chart
var testdata0 = [
        {
            "key" : "Quantity" ,
            "bar": true,
            "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
        },
        {
            "key" : "Price" ,
            "values" : [ [ 1136005200000 , 71.89] , [ 1138683600000 , 75.51] , [ 1141102800000 , 68.49] , [ 1143781200000 , 62.72] , [ 1146369600000 , 70.39] , [ 1149048000000 , 59.77] , [ 1151640000000 , 57.27] , [ 1154318400000 , 67.96] , [ 1156996800000 , 67.85] , [ 1159588800000 , 76.98] , [ 1162270800000 , 81.08] , [ 1164862800000 , 91.66] , [ 1167541200000 , 84.84] , [ 1170219600000 , 85.73] , [ 1172638800000 , 84.61] , [ 1175313600000 , 92.91] , [ 1177905600000 , 99.8] , [ 1180584000000 , 121.191] , [ 1183176000000 , 122.04] , [ 1185854400000 , 131.76] , [ 1188532800000 , 138.48] , [ 1191124800000 , 153.47] , [ 1193803200000 , 189.95] , [ 1196398800000 , 182.22] , [ 1199077200000 , 198.08] , [ 1201755600000 , 135.36] , [ 1204261200000 , 125.02] , [ 1206936000000 , 143.5] , [ 1209528000000 , 173.95] , [ 1212206400000 , 188.75] , [ 1214798400000 , 167.44] , [ 1217476800000 , 158.95] , [ 1220155200000 , 169.53] , [ 1222747200000 , 113.66] , [ 1225425600000 , 107.59] , [ 1228021200000 , 92.67] , [ 1230699600000 , 85.35] , [ 1233378000000 , 90.13] , [ 1235797200000 , 89.31] , [ 1238472000000 , 105.12] , [ 1241064000000 , 125.83] , [ 1243742400000 , 135.81] , [ 1246334400000 , 142.43] , [ 1249012800000 , 163.39] , [ 1251691200000 , 168.21] , [ 1254283200000 , 185.35] , [ 1256961600000 , 188.5] , [ 1259557200000 , 199.91] , [ 1262235600000 , 210.732] , [ 1264914000000 , 192.063] , [ 1267333200000 , 204.62] , [ 1270008000000 , 235.0] , [ 1272600000000 , 261.09] , [ 1275278400000 , 256.88] , [ 1277870400000 , 251.53] , [ 1280548800000 , 257.25] , [ 1283227200000 , 243.1] , [ 1285819200000 , 283.75] , [ 1288497600000 , 300.98] , [ 1291093200000 , 311.15] , [ 1293771600000 , 322.56] , [ 1296450000000 , 339.32] , [ 1298869200000 , 353.21] , [ 1301544000000 , 348.5075] , [ 1304136000000 , 350.13] , [ 1306814400000 , 347.83] , [ 1309406400000 , 335.67] , [ 1312084800000 , 390.48] , [ 1314763200000 , 384.83] , [ 1317355200000 , 381.32] , [ 1320033600000 , 404.78] , [ 1322629200000 , 382.2] , [ 1325307600000 , 405.0] , [ 1327986000000 , 456.48] , [ 1330491600000 , 542.44] , [ 1333166400000 , 599.55] , [ 1335758400000 , 583.98] ]
        }
    ].map(function(series) {
            series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
            return series;
        });

    var chart;
    nv.addGraph(function() {
        chart = nv.models.linePlusBarChart()
            .margin({top: 50, right: 50, bottom: 30, left: 75})
            .legendRightAxisHint(' [Using Right Axis]')
            .color(d3.scale.category20().range().slice(1))
            .focusEnable(false)

        chart.xAxis
        .tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
        }).showMaxMin(false);

        chart.y2Axis
        .tickFormat(function(d) { return '$' + d3.format(',f')(d) });
        
        chart.bars.forceY([0]).padData(false);

        chart.x2Axis.tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
        }).showMaxMin(false);

        d3.select('#chart svg')
            .datum(testdata0)
            .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

        return chart;
    });







// Pie Chart
nv.addGraph(function() {
  var chart = nv.models.pieChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .color(d3.scale.category20().range().slice(1))
      .showLabels(true);

    d3.select("#piechart svg")
        .datum(exampleData())
        .transition().duration(350)
        .call(chart);

  return chart;
});


//Pie chart example data. Note how there is only a single array of key-value pairs.
function exampleData() {
  return  [
      { 
        "label": "One",
        "value" : 29.765957771107
      } , 
      { 
        "label": "Two",
        "value" : 0
      } , 
      { 
        "label": "Three",
        "value" : 32.807804682612
      } , 
      { 
        "label": "Four",
        "value" : 196.45946739256
      } , 
      { 
        "label": "Five",
        "value" : 0.19434030906893
      } , 
      { 
        "label": "Six",
        "value" : 98.079782601442
      } , 
      { 
        "label": "Seven",
        "value" : 13.925743130903
      } , 
      { 
        "label": "Eight",
        "value" : 5.1387322875705
      }
    ];
}



// Treemap
var data0 = [
  {parent: "Group 1", id: "alpha", value: 29},
  {parent: "Group 1", id: "beta", value: 10},
  {parent: "Group 1", id: "gamma", value: 2},
  {parent: "Group 2", id: "delta", value: 29},
  {parent: "Group 2", id: "eta", value: 25}
];

let treemap = new d3plus.Treemap()
  .data(data0)
  .select('#treemap')
  .groupBy(["parent", "id"])
  .sum("value")
  .render();























// ---- Evolución de contratos chart
/*function evolucionDeContratos(summary) {
  console.log("Evolución de contratos chart")
  return nv.addGraph(function() {
    var chart = nv.models.linePlusBarChart()
    .margin({top: 50, right: 50, bottom: 30, left: 75})
    .x(function(d, i) { return i })
    .y(function(d) { return d[1] })
    .color(d3.scale.category20().range().slice(1))
    .showLabels(true)
    .showLegend(true)
    .focusEnable(false)
    ;

    // chart.bars.showValues(true);

    let importeValues = []
    let cantidadValues = []
    let lastYear;
    for (year in summary) {
      if (lastYear) {
        while(parseInt(year)>parseInt(lastYear)+1) {
          lastYear = parseInt(lastYear)+1;
          let lastUnixYear = new Date((lastYear+1).toString()).getTime();
          importeValues.push([new Date(lastUnixYear).getFullYear(),0])
          cantidadValues.push([new Date(lastUnixYear).getFullYear(),0])
        }
      }

      let unixYear = new Date((parseInt(year)+1).toString()).getTime();
      importeValues.push([new Date(unixYear).getFullYear(),summary[year].value])
      cantidadValues.push([new Date(unixYear).getFullYear(),summary[year].count])

      lastYear = year;
    }


    var data = [{
      "key": "Importe",
      "bar": true,
      values: importeValues
    },{
      "key": "Cantidad",
      values: cantidadValues
    }];

    chart.xAxis
    .showMaxMin(true)
    .tickFormat(function(d) {
      return data[0].values[d] && data[0].values[d][0] || d
    });

    chart.y1Axis
    .tickFormat(d3.format('$,f'));


    chart.y2Axis
    .tickFormat(d3.format(',f'));

    chart.bars.forceY([0,1000]);

    // chart.bars.forceX([0]);

    chart.lines.forceY([0,2]);

    d3.select('#chart svg')
    .datum(data)
    .transition().duration(500)
    .call(chart)
    ;

    nv.utils.windowResize(chart.update);

    return chart;
  });
}*/





//------ Evolución chart
// function flagsGraph(summary) {
//   console.log("Gráficos de banderas")
//   return nv.addGraph(function() {
//     var chart = nv.models.lineChart()
//     .margin({top: 30, right: 15, bottom: 30, left: 30})
//     .x(function(d, i) { return i })
//     .y(function(d) { return d[1] })
//     .color(d3.scale.category20().range().slice(1))
//     // .showLabels(true)
//     // .showLegend(true)
//     .focusEnable(false)
//     .useInteractiveGuideline(true)
//     ;

//     let puntajeValues = []

//     for (year in summary[0].years) {
//       let unixYear = new Date((parseInt(summary[0].years[year].year)+1).toString()).getTime();
//       let yearDisplay = new Date(unixYear).getFullYear();
//       let valueDisplay = (Number(summary[0].years[year].criteria_score.total_score)*100).toFixed(2);
//       puntajeValues.push([yearDisplay,valueDisplay])
//     }
//     puntajeValues = reverse(puntajeValues);

//     var data = [{
//       "key": "Puntaje",
//       values: puntajeValues
//     }];
//     console.log("calidad graph",data)

//     chart.xAxis
//     .showMaxMin(true)
//     .tickFormat(function(d) {
//       return data[0].values[d] && data[0].values[d][0] || d
//     });

//     chart.yAxis
//     .tickFormat(d3.format(',f'));


//     chart.lines.forceY([0,100]);

//     d3.select('#flags-graph svg')
//     .datum(data)
//     .transition().duration(500)
//     .call(chart)
//     ;

//     nv.utils.windowResize(chart.update);

//     return chart;
//   });
// }



//------ Piechart
/*function tipoDeContratos(typeSummary) {
  console.log("Piechart")
  nv.addGraph(function() {
    var piechart = nv.models.pieChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .color(d3.scale.category20().range().slice(1))
    .showLabels(true);

    var piedata = [];
    for (type in typeSummary) {
      piedata.push({
        "label": type+" ",
        "value": typeSummary[type]
      })
    }

    d3.select("#piechart svg")
    .datum(piedata)
    .transition().duration(1200)
    .call(piechart);

    nv.utils.windowResize(piechart.update);

    console.log(piedata);
    return piechart;
  });
}
tipoDeContratos();*/



//------ Treemap
// function presupuestoPorRamo(ramoSummary) {
//   console.log("Treemap",1)
//   var data = []
//   for (ramo in ramoSummary) {
//     for (dependency in ramoSummary[ramo]) {
//       // if (ramoSummary[ramo].length == 1) {
//       //   dependency = ramo + " - " + dependency
//       // }
//       data.push({
//         parent: ramo,
//         id: dependency,
//         value: Math.round(ramoSummary[ramo][dependency]),
//       })
//     }
//     // console.log(dependency);
//     // console.log(data);
//   }

//   // console.log("Treemap",2)
//   // console.log("data",data);
//   let treemap = new d3plus.Treemap()
//   .data(data)
//   .select('#treemap')
//   .groupBy(["parent", "id"])
//   .tooltipConfig({
//     body: function(d) {
//       var table = "<table class='tooltip-table'>";
//       table += "<tr><td class='title'>Monto:</td><td class='data'>" + d.value + "</td></tr>";
//       table += "</table>";
//       return table;
//     },
//   })
//   .sum("value");

//   // console.log("Treemap",3)
//   treemap.render();
//   nv.utils.windowResize(treemap.render());
//   return treemap;
// }





//------ Force-directed Graph
function flujosProveedores(relationSummary) {

  console.log("Force-directed Graph",1)

  var chartDiv = document.getElementById("graph-container");
  // $(chartDiv).height(500);
  var width = chartDiv.clientWidth;
  var height = chartDiv.clientHeight;
  var slide;
  var vWidth = $(window).width();

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

  data = relationSummary;

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

    evolucionDeContratos(summary);
    Meteor.setTimeout(function() {
      tipoDeContratos(typeSummary);
    }, 20);
    Meteor.setTimeout(function() {
      presupuestoPorRamo(ramoSummary);
    }, 30);

    Meteor.setTimeout(function() {
      chart = flujosProveedores(relationSummary);
      // console.log(chart);
    }, 40);

  }
  return drawn;
}