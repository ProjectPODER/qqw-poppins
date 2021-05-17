$(document)
  .ready(function() {

    var mymap = L.map('map', {
      center: [23.0000000, -102.0000000],
      zoom: 5
    });
    mymap.scrollWheelZoom.disable();

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoibWFyaXNvbGNtIiwiYSI6ImNqbGljc3dkNzBidmszc29idnVyZDBhMW4ifQ.VCXmAHrcAhrF25RR5XgUMQ'
    }).addTo(mymap);


    // Our listeners
    let geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(mymap);


    $("#map").data("geolayer",geojson);

    //Esto es para que cuando tarda en cargar la lista de estados el mapa se actualice con los valores de cada estado
    $("#tableStates").DataTable().on("draw",function() {
      console.log("redraw",geojson);
      l = geojson._layers;
      for (g in l) { geojson.resetStyle(l[g])  }
    })
    // Adding color
    function getColor(d) {
        return d > 100 ? '#ffffef' :
               d > 90 ? '#ffffe5' :
               d > 80 ? '#ffffcc' :
               d > 70 ? '#ffeda0' :
               d > 60 ? '#fed976' :
               d > 50 ? '#feb24c' :
               d > 40 ? '#fd8d3c' :
               d > 30 ? '#fc4e2a' :
               d > 20 ? '#e31a1c' :
               d > 10 ? '#bd0026' :
                         '#800026';
    }
    function style(feature) {
      let score = null;
      $.each( $('#tableStates').DataTable().data(),function(c,d) { if (d.party.name == feature.properties.name) { score = d.criteria_score.total_score } })
      score = (score*100).toFixed(2);
      // console.log(feature.properties.name,score);
      feature.properties.total_score = score;
      // findBy(stateScores,{name: feature.properties.name}).criteria_score.total_score
      return {
        fillColor: getColor(score),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
      };
    }

    // Adding interacion
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        };
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            // click: zoomToFeature
        });
    }

    // Info control
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Ranking de estados</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.total_score + ' puntos.'
            : 'Pase el mouse sobre un estado');
    };

    info.addTo(mymap);

    // Legend Control
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            labels = [];

        // loop through our intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '');
        }

        return div;
    };

    legend.addTo(mymap);
});
