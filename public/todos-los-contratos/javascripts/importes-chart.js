$(document)
  .ready(function() {

        var barChartData = {
            labels: ['2011', '2012', '2013', '2014', '2015', '2016', '2017','2018'],
            datasets: [{
                label: 'Puntaje bajo (23 a 39)',
                backgroundColor: "#bd0026",
                data: [276, 402, 259, 223, 364, 304, 209, 127]
            }, {
                label: 'Puntaje regular (40 a 56)',
                backgroundColor: "#fd8d3c",
                data:  [29196, 43512, 46866, 54769, 70294, 79971, 61609, 30569]
            }, {
                label: 'Puntaje bueno (57 - 72)',
                backgroundColor: "#feb24c",
                data: [6374, 10059, 10703, 13502, 12396, 13607, 10096, 5381]
            }, {
                label: 'Puntaje alto (73 - 88)',
                backgroundColor: "#ffeda0",
                data:  [6891, 12297, 14168, 19583, 20326, 14694, 12467, 7300]
            }]

        };

        var ctx = document.getElementById('importesChart').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart - Stacked'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Año'
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Cantidad de contratos'
                        }
                    }]
                }
            }
        });
});
