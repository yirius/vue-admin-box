<template>
  <div style="width: calc(100% - 30px);padding: 15px">
    <div style="background-color: white;padding: 15px;border-radius: 6px">

      <el-row :gutter="10">
        <el-col :span="4" :xs="24"><div style="line-height: 40px;text-align: right">当前展示广告主: </div></el-col>
        <el-col :span="8" :xs="24">
          <el-select v-model="selectedAdvertiserId" class="m-2" placeholder="Select" size="large" @change="refreshTotalChart">
            <el-option
                v-for="(item, index) in advertisers"
                :key="index"
                :label="item.name"
                :value="item.advertiserId"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" :xs="24"><div style="line-height: 40px;text-align: right">统计日期选择: </div></el-col>
        <el-col :span="8" :xs="24">
          <el-date-picker size="large" v-model="timeSelected" type="date"
                          style="width: 100%;height: 40px" @change="refreshTotalChart">
          </el-date-picker>
        </el-col>
      </el-row>

      <div v-loading="showLoading">
        <Chart :option="option" style="width: 100%;height: 500px" ref="chartRef" />
      </div>
      <div v-if="hourBestList.length > 0 || hourBadList.length > 0">
        <div style="margin-left: 5px;margin-bottom: 15px;">
          当前选择时间: <span style="color: red">{{selectIndex}}点</span>,
          <span style="color: green" v-if="bestOrBad==1">素材情况较好</span>
          <span style="color: red" v-else>素材情况较差</span>
        </div>

        <div style="margin-top: 30px" v-if="hourBestList.length > 0">
          <el-tabs v-model="hourListName">
            <el-tab-pane label="消耗大于均值计划" name="first" v-if="hourBestList.length > 0">
                <el-table :data="hourBestList" style="width: 100%" size="small">
                  <el-table-column prop="adId" label="计划编号"/>
                  <el-table-column prop="time" label="最后采集时间"/>
                  <el-table-column prop="statCost" label="消耗" />
                  <el-table-column prop="ctr" label="点击" />
                  <el-table-column prop="payOrderAmount" label="下单金额" />
                  <el-table-column prop="payOrderCount" label="下单数量" />
                  <el-table-column prop="livePayOrderCostPerOrder" label="单均金额" />
                  <el-table-column prop="totalPlay" label="总播放数" />
                  <el-table-column prop="evaluateMsg" label="诊断结果" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="消耗小于均值计划" name="second" v-if="hourBadList.length > 0">
              <el-table :data="hourBadList" style="width: 100%" size="small">
                <el-table-column prop="adId" label="计划编号"/>
                <el-table-column prop="time" label="最后采集时间"/>
                <el-table-column prop="statCost" label="消耗" />
                <el-table-column prop="ctr" label="点击" />
                <el-table-column prop="payOrderAmount" label="下单金额" />
                <el-table-column prop="payOrderCount" label="下单数量" />
                <el-table-column prop="livePayOrderCostPerOrder" label="单均金额" />
                <el-table-column prop="totalPlay" label="总播放数" />
                <el-table-column prop="evaluateMsg" label="诊断结果" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div style="margin-top: 30px">
        <el-tabs v-model="conclusionData">
          <el-tab-pane label="当天素材TOP5" name="first">
            <el-table :data="maxVideoData" style="width: 100%" size="small">
              <el-table-column prop="video_id" label="素材编号"/>
              <el-table-column prop="title" label="名称"/>
              <el-table-column prop="statCost" label="消耗" width="100" />
              <el-table-column prop="payOrderAmount" label="下单金额" width="100" />
              <el-table-column prop="payOrderRoi" label="ROI" width="100" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="当天计划TOP10" name="second">
            <el-table :data="maxTaskData" style="width: 100%" size="small">
              <el-table-column prop="adId" label="计划编号"/>
              <el-table-column prop="statCost" label="消耗" width="100" />
              <el-table-column prop="payOrderAmount" label="下单金额" width="100" />
              <el-table-column prop="createOrderRoi" label="ROI" width="100" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="当天创意TOP10" name="third">
            <el-table :data="maxCreativeData" style="width: 100%" size="small">
              <el-table-column prop="creativeId" label="创意编号"/>
              <el-table-column prop="statCost" label="消耗" width="100" />
              <el-table-column prop="payOrderAmount" label="下单金额" width="100" />
              <el-table-column prop="createOrderRoi" label="ROI" width="100" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="当天素材测新效果" name="four">
            <el-table :data="videoPercent" style="width: 100%" size="small">
              <el-table-column prop="video_id" label="素材编号"/>
              <el-table-column prop="title" label="名称"/>
              <el-table-column prop="data" label="投放详情" />
              <el-table-column prop="count" label="投放个数" width="100" />
              <el-table-column prop="percent" label="投放比例" width="100" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="直播计划汇总" name="five">
            <el-table :data="reportTaskLive" style="width: 100%" size="small">
              <el-table-column prop="adId" label="计划编号"/>
              <el-table-column prop="awemeName" label="达人名称"/>
              <el-table-column prop="marketingGoal" label="目标"/>
              <el-table-column prop="externalAction" label="成交来源"/>
              <el-table-column prop="statCost" label="消耗" width="100" />
              <el-table-column prop="payOrderAmount" label="下单金额" width="100" />
              <el-table-column prop="createOrderRoi" label="ROI" width="100" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="短视频计划汇总" name="six">
            <el-table :data="reportTaskVideo" style="width: 100%" size="small">
              <el-table-column prop="adId" label="计划编号"/>
              <el-table-column prop="awemeName" label="达人名称"/>
              <el-table-column prop="marketingGoal" label="目标"/>
              <el-table-column prop="externalAction" label="成交来源"/>
              <el-table-column prop="statCost" label="消耗" width="100" />
              <el-table-column prop="payOrderAmount" label="下单金额" width="100" />
              <el-table-column prop="createOrderRoi" label="ROI" width="100" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, Vue } from 'vue';
import {postRequest} from "@/api/request";
import Chart from '@/components/charts/index.vue'
import * as ElementPlus from 'element-plus'
import { formatDate } from '@/utils/tools/datetime'

var chartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    data: ['消耗', '成交', 'ROI']
  },
  xAxis: [
    {
      type: 'category',
      data: [
        "0点", "1点", "2点", "3点", "4点", "5点", "6点", "7点", "8点", "9点", "10点", "11点", "12点",
        "13点", "14点", "15点", "16点", "17点", "18点", "19点", "20点", "21点", "22点", "23点"
      ],
      axisPointer: {
        type: 'shadow'
      },
      triggerEvent: true
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '消耗',
      min: 0,
      max: 250,
      interval: 200,
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    {
      type: 'value',
      name: 'ROI',
      min: 0,
      max: 25,
      interval: 2,
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '消耗',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元';
        }
      },
      data: []
    },
    {
      name: '成交',
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 元';
        }
      },
      data: []
    },
    {
      name: 'ROI',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + '';
        }
      },
      data: []
    }
  ]
};

export default defineComponent({
  name: "poster_summary",
  components: { Chart },
  data() {
    return {
      hourListName: "first",
      conclusionData: "first",
      showLoading: false,

      selectedAdvertiserId: null,
      advertisers: [],
      timeSelected: new Date(),
      roiCalc: 0.3,

      option: {},

      payOrderAmount: null,
      payOrderAmountTotal: null,
      roi: null,
      roiAvg: null,
      statCost: null,
      statCostTotal: null,

      bestOrBad: 0,
      selectIndex: 0,
      hourBadList: [],
      hourBestList: [],

      maxVideoData: [],
      maxTaskData: [],
      maxCreativeData: [],
      videoPercent: [],
      reportTaskLive: [],
      reportTaskVideo: []
    }
  },
  mounted() {
    this.refreshTotalChart();

    // 监听坐标轴点击时间
    this.$nextTick(() => {
      let chartIns = this.$refs.chartRef.findChart();
      chartIns.getZr().on("click", (params) => {
        let pointInPixel = [params.offsetX, params.offsetY];
        if(chartIns.containPixel('grid', pointInPixel)) {
          var xIndex = chartIns.convertFromPixel({seriesIndex: 0}, pointInPixel)[0];
          var isBestOrBad = false;
          if(this.roi[xIndex+"点"] > (this.roiAvg + this.roiCalc)) {
            this.bestOrBad = 1;
            isBestOrBad = true;
          } else if(this.roi[xIndex+"点"] < (this.roiAvg - this.roiCalc)) {
            this.bestOrBad = 2;
            isBestOrBad = true;
          }

          this.selectIndex = xIndex;
          this.hourBadList = [];
          this.hourBestList = [];
          if(isBestOrBad) {
            postRequest("/api/summary/posterHour", {
              hour: xIndex,
              bestOrBad: this.bestOrBad,
              useDay: this.timeSelected?formatDate(this.timeSelected):"",
              advertiserId: this.selectedAdvertiserId
            }).then(response => {
              if(response.data.badList) {
                this.hourBadList = response.data.badList;
              }
              if(response.data.bestList) {
                this.hourBestList = response.data.bestList;
              }
            }).catch(err => {
              console.error(err);
            })
          } else {
            ElementPlus.ElMessage.info("该时间段暂无异常情况");
          }
        }
      });
    });
  },
  methods: {
    refreshTotalChart() {
      this.showLoading = true;
      postRequest("/api/summary/poster", {
        useDay: this.timeSelected?formatDate(this.timeSelected):"",
        advertiserId: this.selectedAdvertiserId
      }).then(response => {
        this.showLoading = false;
        for(var i in response.data) {
          this[i] = response.data[i];
        }

        if(!this.selectedAdvertiserId && this.advertisers.length > 0) {
          this.selectedAdvertiserId = this.advertisers[0].advertiserId;
        }

        if(this.hourBestList.length > 0) {
          this.hourListName = "first";
        } else if(this.hourBadList.length > 0) {
          this.hourListName = "second";
        }

        // 绘制图表
        var statCost = [], maxStatCost = 0;
        for(var i in response.data.statCost) {
          statCost.push(response.data.statCost[i]);
          if(maxStatCost < response.data.statCost[i]) {
            maxStatCost = response.data.statCost[i];
          }
        }
        chartOptions.series[0].data = statCost;

        var payOrderAmount = [];
        for(var i in response.data.payOrderAmount) {
          payOrderAmount.push(response.data.payOrderAmount[i]);
          if(maxStatCost < response.data.payOrderAmount[i]) {
            maxStatCost = response.data.payOrderAmount[i];
          }
        }

        chartOptions.yAxis[0].max = maxStatCost + 10;
        chartOptions.series[1].data = payOrderAmount;

        var roi = [], maxRoi = 0;
        for(var i in response.data.roi) {
          roi.push(response.data.roi[i]);
          if(maxRoi < response.data.roi[i]) {
            maxRoi = response.data.roi[i];
          }
        }
        chartOptions.yAxis[1].max = (maxRoi + 0.3).toFixed(2);
        chartOptions.series[2].data = roi;

        if(this.$refs.chartRef) {
          let chartIns = this.$refs.chartRef.findChart();
          if(chartIns) {
            chartIns.clear();
            chartIns.setOption(chartOptions);
          } else {
            this.option = chartOptions;
          }
        } else {
          this.option = chartOptions;
        }

        postRequest("/api/summary/findMaxTaskData", {
          useDay: this.timeSelected?formatDate(this.timeSelected):"",
          advertiserId: this.selectedAdvertiserId
        }).then(response => {
          this.maxTaskData = response.data;
        }).catch(err => {
          console.error(err)
        });

        postRequest("/api/summary/findMaxCreativeData", {
          useDay: this.timeSelected?formatDate(this.timeSelected):"",
          advertiserId: this.selectedAdvertiserId
        }).then(response => {
          this.maxCreativeData = response.data;
        }).catch(err => {
          console.error(err)
        });

        postRequest("/api/summary/findNewVideoPercent", {
          useDay: this.timeSelected?formatDate(this.timeSelected):"",
          advertiserId: this.selectedAdvertiserId
        }).then(response => {
          this.videoPercent = response.data;
        }).catch(err => {
          console.error(err)
        });

        postRequest("/api/summary/getReportTaskLive", {
          useDay: this.timeSelected?formatDate(this.timeSelected):"",
          advertiserId: this.selectedAdvertiserId
        }).then(response => {
          this.reportTaskLive = response.data;
        }).catch(err => {
          console.error(err)
        });

        postRequest("/api/summary/getReportTaskVideo", {
          useDay: this.timeSelected?formatDate(this.timeSelected):"",
          advertiserId: this.selectedAdvertiserId
        }).then(response => {
          this.reportTaskVideo = response.data;
        }).catch(err => {
          console.error(err)
        });
      }).catch(err => {
        console.error(err)
      });
    }
  }
})
</script>

<style scoped>
.el-date-editor.el-input, .el-date-editor.el-input__wrapper {
  height: 40px;
}
</style>