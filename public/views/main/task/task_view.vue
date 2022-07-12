<template>
  <StepLayer :layer="layer">
    <div v-loading="loading">
      <el-scrollbar>
        <el-row>
          <el-col :span="4" :xs="24">
            <div style="margin-top: 15px"></div>
            <div style="line-height: 40px">展示数据选择:</div>
          </el-col>
          <el-col :span="6" :xs="24">
            <div style="margin-top: 15px"></div>
            <el-select v-model="numSelected" class="m-2" placeholder="Select" size="large" :multiple="true"
                       :collapse-tags="true">
              <el-option
                  v-for="(item, index) in numCommons"
                  :key="index"
                  :label="item.name"
                  :value="index">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4" :xs="24">
            <div style="margin-top: 15px" class="hidden-xs-only"></div>
            <div style="line-height: 40px">统计区间选择:</div>
          </el-col>
          <el-col :span="10" :xs="24">
            <div style="margin-top: 15px" class="hidden-xs-only"></div>
            <el-date-picker size="large" v-model="timeSelected" type="datetimerange"
                            range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期"
                            style="width: 100%" @change="calcDatetimeCanUse" :disabledDate="disabledDate">
            </el-date-picker>
          </el-col>

          <el-col :span="4" :xs="24">
            <div style="margin-top: 15px" class="hidden-xs-only"></div>
            <div style="line-height: 40px">日期间隔类型:</div>
          </el-col>
          <el-col :span="6" :xs="24">
            <div style="margin-top: 15px"></div>
            <el-select v-model="interval" class="m-2" placeholder="Select" size="large" @change="">
              <el-option label="日" value="DAY" :disabled="dayDisabled"/>
              <el-option label="小时" value="HOUR" :disabled="hourDisabled"/>
              <el-option label="分钟" value="MINUTE" :disabled="minuteDisabled"/>
            </el-select>
          </el-col>
          <el-col :span="14">
            <div style="margin-top: 15px" class="hidden-xs-only"></div>
            <el-button type="primary" @click="upload()">提交</el-button>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-empty v-if="empty" description="暂无数据" />

            <div class="grayBox">
              <lineChart v-if="chartShow" :data="lineChartData" :names="lineChartNames"
                         :xAxis="timeList"></lineChart>
            </div>
          </el-col>
          <el-col :span="24">
            <Table :data="tableData" style="width: 100%">
              <el-table-column prop="dateTime" label="时间" width="150" :show-overflow-tooltip='true' sortable/>

              <el-table-column v-for="(item, index) in numCommons" :key="index" :label="item.name"
                               :prop="item.field" :show-overflow-tooltip='true' width="70" sortable>
                <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
                <template #default="scope">
                  {{ scope.row[scope.column.property] }}
                </template>
              </el-table-column>
            </Table>
          </el-col>
        </el-row>
      </el-scrollbar>
<!--      <el-tabs v-model="activeName" @tab-click="handleClick">-->
<!--        <el-tab-pane label="趋势分析" name="first">-->
<!--          -->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="详细数据" name="second">-->
<!--          <el-scrollbar>-->
<!--            <el-col :span="4" :xs="24">-->
<!--              <div style="margin-top: 15px"></div>-->
<!--              <div style="line-height: 40px">展示数据选择:</div>-->
<!--            </el-col>-->
<!--            <el-col :span="8" :xs="24">-->
<!--              <div style="margin-top: 15px"></div>-->
<!--              <el-select v-model="numSelected" class="m-2" placeholder="Select" size="large" :multiple="true"-->
<!--                         :collapse-tags="true">-->
<!--                <el-option-->
<!--                    v-for="(item, index) in numCommons"-->
<!--                    :key="index"-->
<!--                    :label="item.name"-->
<!--                    :value="index"-->
<!--                >-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-col>-->

<!--            <el-col :span="4" :xs="24">-->
<!--              <div style="margin-top: 15px" class="hidden-xs-only"></div>-->
<!--              <div style="line-height: 40px">统计区间选择:</div>-->
<!--            </el-col>-->
<!--            <el-col :span="8" :xs="24">-->
<!--              <div style="margin-top: 15px" class="hidden-xs-only"></div>-->
<!--              <el-date-picker size="large" v-model="timeSelected" type="datetimerange"-->
<!--                              range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期"-->
<!--                              style="width: 100%" @change="calcDatetimeCanUse" :disabledDate="disabledDate">-->
<!--              </el-date-picker>-->
<!--            </el-col>-->

<!--          </el-scrollbar>-->


<!--        </el-tab-pane>-->

<!--        <el-tab-pane label="计划详情" name="third">角色管理</el-tab-pane>-->
<!--      </el-tabs>-->


    </div>

  </StepLayer>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {postRequest} from "@/api/request";
import Table from "@/components/table/index.vue";
import {Plus, Connection} from "@element-plus/icons";
import {ElMessageBox} from 'element-plus';

import {formatDateTime} from "@/utils/tools/datetime"
import StepLayer from "./layer_drawer.vue"
import lineChart from "../dashboard/monitor/lineChart.vue";

export default {
  components: {StepLayer, lineChart, Table},
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          adId: 0,
          advertiserId: 0,
          adType: 0,
          show: false,
          title: '',
          showButton: false,
        }
      },
      required: true
    }
  },
  data() {
    return {
      adId: null,
      advertiserId: null,
      adType: null,
      interval: null,
      activeName: 'first',
      numSelected: [0, 10, 5, 37],
      numCommons: [
        {name: "消耗", field: "statCost"},
        {name: "展示次数", field: "showCnt"},
        {name: "点击率", field: "ctr", suffix: "‰"},
        {name: "平均千次展示费用", field: "cpmPlatform"},
        {name: "点击次数", field: "clickCnt"},
        {name: "成交订单数", field: "payOrderCount"},
        {name: "成单率", field: "payOrderRate", suffix: "‰"},
        {name: "下单成交金额", field: "createOrderAmount"},
        {name: "下单订单数", field: "createOrderCount"},
        {name: "成交订单金额", field: "payOrderAmount"},
        {name: "成交订单roi", field: "payOrderRoi"},
        {name: "下单roi", field: "createOrderRoi"},
        {name: "广告预售订单数", field: "prepayOrderCount"},
        {name: "广告预售订单金额", field: "prepayOrderAmount"},
        {name: "预付roi", field: "prepayAndPayOrderRoi"},
        {name: "新增粉丝数", field: "dyFollow"},
        {name: "转化数", field: "convertCnt"},
        {name: "转化成本", field: "convertCost"},
        {name: "成交客单价", field: "livePayOrderCostPerOrder"},
        {name: "直播间观看人次", field: "lubanLiveEnterCnt"},
        {name: "直播间超过1分钟观看人次", field: "liveWatchOneMinuteCount"},
        {name: "直播间新加团人次", field: "liveFansClubJoinCnt"},
        {name: "直播间查看购物车次数", field: "lubanLiveSlidecartClickCnt"},
        {name: "直播间商品点击次数", field: "lubanLiveClickProductCnt"},
        {name: "直播间评论次数", field: "lubanLiveCommentCnt"},
        {name: "直播间分享次数", field: "lubanLiveShareCnt"},
        {name: "直播间打赏次数", field: "lubanLiveGiftCnt"},
        {name: "直播间音浪收入", field: "lubanLiveGiftAmount"},
        {name: "播放数", field: "totalPlay"},
        {name: "3s播放数", field: "playDuration3s"},
        {name: "25%进度播放数", field: "play25FeedBreak"},
        {name: "50%进度播放数", field: "play50FeedBreak"},
        {name: "75%进度播放数", field: "play75FeedBreak"},
        {name: "播放完成数", field: "playOver"},
        {name: "完播率", field: "playOverRate", suffix: "‰"},
        {name: "UV价值", field: "uv"},
        {name: "互动率", field: "interactionRate", suffix: "‰"},
        {name: "成交转化率", field: "payOrderConvertRate", suffix: "‰"},
        {name: "下单转化率", field: "createOrderConvertRate", suffix: "‰"},
        {name: "预付转化率", field: "prepayConvertRate", suffix: "‰"},
      ],
      data: {
        uv: [],
        interactionRate: [],
        payOrderConvertRate: [],
        createOrderConvertRate: [],
        prepayConvertRate: [],
        clickCnt: [],
        convertCnt: [],
        convertCost: [],
        convertRate: [],
        cpmPlatform: [],
        createOrderAmount: [],
        createOrderCount: [],
        createOrderRoi: [],
        ctr: [],
        dyComment: [],
        dyFollow: [],
        dyLike: [],
        dyShare: [],
        liveFansClubJoinCnt: [],
        livePayOrderCostPerOrder: [],
        liveWatchOneMinuteCount: [],
        lubanLiveClickProductCnt: [],
        lubanLiveCommentCnt: [],
        lubanLiveEnterCnt: [],
        lubanLiveGiftAmount: [],
        lubanLiveGiftCnt: [],
        lubanLiveShareCnt: [],
        lubanLiveSlidecartClickCnt: [],
        payOrderAmount: [],
        payOrderCount: [],
        payOrderRate: [],
        payOrderRoi: [],
        playDuration_3s: [],
        playOver: [],
        playOverRate: [],
        play_25FeedBreak: [],
        play_50FeedBreak: [],
        play_75FeedBreak: [],
        prepayAndPayOrderRoi: [],
        prepayOrderAmount: [],
        prepayOrderCount: [],
        showCnt: [],
        statCost: [],
        totalPlay: [],
      },
      timeList: [],
      tableData: [],
      // 日期区间的差值
      timeSelected: [],
      timeStartData: null,
      timeEndData: null,
      chartShow: false,
      empty:false,
      loading: true,
      dayDisabled:false,
      hourDisabled:false,
      minuteDisabled:false,
    }
  },
  mounted() {
  },
  watch: {
    numSelected: {
      handler(newV, oldV) {
        this.chartShow = false
        this.loading = true
        setTimeout(() => {
          this.chartShow = true
          this.loading = false
        }, 500);
      },
      deep: true
    },
    layer: {
      immediate: true,
      handler(newV, oldV) {
        if (newV.show) {
          this.adId = this.layer.adId;
          this.advertiserId = this.layer.advertiserId;
          console.log(this.layer.adType)
          if (this.layer.adType == "VIDEO_PROM_GOODS" && this.layer.adType == "短视频带货") {
            this.adType = "VIDEO";
          } else {
            this.adType = "LIVE";
          }

          setTimeout(() => {
            this.refreshDashboard()
          }, 500);
        }
      },
      deep: true
    }
  },
  computed: {
    lineChartData() {
      var chartData = [];
      for (var i = 0; i < this.numSelected.length; i++) {
        var col = this.numCommons[this.numSelected[i]].field
        chartData.push(this.data[col])
      }
      console.log(chartData)
      return chartData
    },
    lineChartNames() {
      var chartNames = [];
      for (var i = 0; i < this.numSelected.length; i++) {
        var col = this.numCommons[this.numSelected[i]].name
        chartNames.push(col)
      }
      console.log(chartNames)
      return chartNames
    },
  },
  methods: {

    handleClick(tab, event) {
      console.log(tab, event);
    },
    refreshDashboard() {
      console.log(this.timeStartData)
      console.log(new Date())
      postRequest("/api/taskList/dashboard", {
        adType: this.adType,
        advertiserId: this.advertiserId,
        adId: this.adId,
        startTime: this.timeStartData,
        endTime: this.timeEndData,
        interval: this.interval,
      }).then(response => {
        for (var i in response.data) {
          this[i] = null;
          this[i] = response.data[i];
        }
        if (this.tableData.length > 0) {
          this.chartShow = true
          this.empty = false
        }else{
          this.chartShow = false
          this.empty = true
        }
        this.loading = false
        console.log(this.tableData)
      });
    },
    calcDatetimeCanUse() {
      if (this.timeSelected) {
        this.timeStartData = formatDateTime(this.timeSelected[0]);
        console.log(this.timeStartData)
        this.timeEndData = formatDateTime(this.timeSelected[1]);
        var difftime = (this.timeSelected[1]-this.timeSelected[0])/1000;
        console.log(difftime)
        var days = parseFloat(difftime/86400); // 天  24*60*60*1000
        console.log(days)
        if (days<=1){
          this.dayDisabled = true;
          this.hourDisabled = false;
          this.minuteDisabled = false;
        }else if(days>1&&days<=3) {
          this.dayDisabled = false;
          this.hourDisabled = false;
          this.minuteDisabled = false;
        }
        else if(days>3&&days<=7) {
          this.dayDisabled = false;
          this.hourDisabled = false;
          this.minuteDisabled = true;
        }else{
          this.dayDisabled = false;
          this.hourDisabled =  true;
          this.minuteDisabled = true;
        }
        this.interval = null;
        // if (this.timeSelected[0].getMonth() == this.timeSelected[1].getMonth()) {
        //   this.timeStartData = formatDateTime(this.timeSelected[0]);
        //   this.timeEndData = formatDateTime(this.timeSelected[1]);
        //   this.refreshDashboard();
        // } else {
        //   this.timeSelected = null;
        //   ElMessageBox.alert("选择统计日期区间需在同一个月");
        // }
      }
    },
    upload(){
      if (this.interval==null||this.timeStartData==null){
        ElMessageBox.alert("请选择日期和间隔类型");
      }else{
        this.refreshDashboard()
        this.loading = true
      }
    },


    disabledDate(date) {
      return date.getTime() > (new Date().getTime() + 24 * 60 * 60 * 1000);
    }
  }
}
</script>

<style scoped>
.grayBox {
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 20px;
  margin-top: 20px;
}

</style>