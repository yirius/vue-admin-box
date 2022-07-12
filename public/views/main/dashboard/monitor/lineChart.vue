<template>
  <div class="box">
    <Chart :option="option" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    names: {
      type: Array,
      required: true
    },
    xAxis: {
      type: Array,
      required: true
    }
  },
  computed: {
    option() {
      var dataList = [];
      var color = ['#4D8EFF', '#84BFFF', '#FE9D9A'];
      for(var i in this.data) {
        dataList.push({
          type: 'line',
          name: this.names[i],
          data: this.data[i],
          color: color[i%3],
          smooth: true,
          symbol: 'none',
        });
      }

      const useNames = this.names;
      return {
        tooltip: {
          trigger: 'axis',
          formatter: function (params, ticket, callback) {
            var htmlStr = '';
            for (var i = 0; i < params.length; i++) {
              var param = params[i];
              var xName = param.name; //x轴的名称
              var seriesName = param.seriesName; //图例名称
              if(useNames.indexOf(seriesName) >= 0) {
                var value = param.value; //y轴值
                var color = param.color; //图例颜色
                if (i === 0) {
                  htmlStr += xName + '<br/>'; //x轴的名称
                }
                htmlStr += '<div>';
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>'; //一个点
                htmlStr += seriesName + '：' + value + (seriesName.indexOf('率')>=0?'%':""); //圆点后面显示的文本
                htmlStr += '</div>';
              }
            }
            return htmlStr;
          }
        },
        grid: {
          top: '20%',
          left: '1%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        legend: {
          top: '5%',
          data: this.names
        },
        xAxis: {
          type: 'category',
          data: this.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: dataList
      };
    }
  },
  setup() {
    return {

    }
  }
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