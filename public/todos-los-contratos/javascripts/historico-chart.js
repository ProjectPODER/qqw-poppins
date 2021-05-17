$(document)
  .ready(function() {

    $.ajax({

        url: '/data-historico-chart.json',
        type: 'GET',
        success : function(data) {
            // console.log(data);

            var chart_labels = [], chart_dataset_labels = [],
            chart_dataset_scores = [],chart_datasets = [];

            data.forEach(function(dataset) {
                let this_scores = [];
                dataset.years.forEach(function(year){
                    if (chart_labels.indexOf(year.year) == -1) {
                        chart_labels.push(year.year)
                    }
                    this_scores.push(year.criteria_score.total_score);
                    // console.log(score);
                });
                chart_dataset_scores.push(this_scores);
                chart_dataset_labels.push(dataset.dataset.label);
            });
            let colors = ["#DB2828","#313233"]

            for (i in chart_dataset_labels) {
                chart_datasets.push({
                        label: chart_dataset_labels[i],
                        backgroundColor: colors[i],
                        borderColor: colors[i],
                        data: chart_dataset_scores[i],
                        fill: false,
                    })
            }

            // console.log(chart_labels, chart_datasets)
            var config = {
                type: 'line',
                data: {
                    labels: chart_labels,
                    datasets: chart_datasets
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    title: {
                        display: false,
                        // text: 'Chart.js Line Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Año'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Puntaje promedio'
                            }
                        }]
                    }
                }
            };
            console.log("historicoChart",config);
            var ctx = document.getElementById('historicoChart').getContext('2d');
            var myLine = new Chart(ctx, config);

        }
    });
});
