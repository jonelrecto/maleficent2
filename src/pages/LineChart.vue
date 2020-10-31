<template>
	
</template>

<script>
import { Line } from 'vue-chart'

export default {
	name: 'lineChart',
	extends: Line,
	props: {
		chartData: {
			type: Array,
			required: false
		},
		chartLabels: {
			type: Array,
			required: true
		}
	},
	data () {
		return {
			options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
		}
	},
	mounted () {
		this.renderChart({
      labels: this.chartLabels,
      datasets: [
        {
          label: 'downloads',
          borderColor: '#249EBF',
          pointBackgroundColor: 'white',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          backgroundColor: 'transparent',
          data: this.chartData
        }
      ]
    }, this.options)
	}

}
</script>