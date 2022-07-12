<template>
  <div style="width: 100%;height: calc(100% - 30px)">
    <div style="height: 80px;padding: 15px">
      <div class="bg-white" style="border-radius: 6px;padding: 15px">
        <el-row>
          <el-col :span="6">
            <div>消耗:</div>
            <Chart ref="statCostChart" style="height: 50px" :option="option" v-if="chartShow"></Chart>
          </el-col>
          <el-col :span="6">
            <div>ROI:</div>
            <Chart ref="roiChart" style="height: 50px" :option="option" v-if="chartShow"></Chart>
          </el-col>
          <el-col :span="6">
            <div>下单数量:</div>
            <Chart ref="payOrderCountChart" style="height: 50px" :option="option" v-if="chartShow"></Chart>
          </el-col>
          <el-col :span="6">
            <div>下单金额:</div>
            <Chart ref="payOrderAmountChart" style="height: 50px" :option="option" v-if="chartShow"></Chart>
          </el-col>
        </el-row>
      </div>
    </div>
    <ViewBaseComponent renderUrl="/monitor/task/listData" style="height: calc(100% - 110px)" ref="taskListPage"></ViewBaseComponent>
  </div>
</template>

<script>
import { defineComponent, ref, Vue, unref, toRaw } from 'vue';
import {postRequest} from "@/api/request";
import * as ElementPlus from 'element-plus';
import eventBus from '@/utils/admin/eventBus';
import Chart from '@/components/charts/index.vue'
import { formatDate } from '@/utils/tools/datetime';

export default defineComponent({
  name: "video_list_chart",
  components: { Chart },
  data() {
    return {
      chartShow: false,
      option: {
        grid:{
          x: 0,
          y: 10,
          x2: 10,
          y2: 10,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          show: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {},
            smooth: true
          }
        ]
      }
    }
  },
  mounted() {
    eventBus.default.on("refreshVideoChart", () => {
      this.chartShow = true;
    });
  },
  unmounted() {
    eventBus.default.off("refreshVideoChart");
  },
  methods: {

  }
})
</script>

<style scoped>

</style>