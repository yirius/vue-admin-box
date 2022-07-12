<template>
  <div class="box">
    <Chart :option="option"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Chart from '@/components/charts/index.vue'

export default defineComponent({
  components: {
    Chart
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    xAxis: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: Array
    }
  },
  computed: {
    option() {
      return {
        title: {
          text: this.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: "30%",
          height: "60%",
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            saveAsImage: {show: true}
          }
        },
        legend: {
          orient: "vertical",
          left: "left",
          itemGap: 3,
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxis,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.text[0],
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: this.text[1],
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: this.text[2],
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            data: this.data[2]
          },
          {
            name: this.text[3],
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            data: this.data[1]
          },
          {
            name: this.text[1],
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            data: this.data[0]
          }
        ]
      };
    }
  },
})
</script>

<style scoped>
.box {
  margin: 10px auto 0;
  width: calc(100% - 40px);
  height: 300px;
  /*background: var(--system-page-background);*/
  padding: 20px;
  overflow: hidden;
}
</style>