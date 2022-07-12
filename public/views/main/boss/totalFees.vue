<template>
  <div class="box">
    <!--  筛选部分-->
    <el-row :gutter="10" style="margin-top: 20px">
      <!--   当前展示商铺-->
      <el-col :span="4" :xs="24">
        <div style="line-height: 40px; margin-left: 50px">当前展示商铺:</div>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-select v-model="selectedShopId" placeholder="Select" size="large" @change="refreshInterface">
          <el-option
              v-for="(item,index) in shops"
              :key="index"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <!--   时间筛选月-->
      <el-col :span="4" :offset="2" :xs="24">
        <div style="line-height: 40px; margin-left: 60px">时间筛选月:</div>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-date-picker
            v-model="timeSelected"
            type="month"
            placeholder="Select"
            size="large"
            @change="calcDatetimeCanUse"
        >
        </el-date-picker>
      </el-col>
    </el-row>

    <!--  总数据展示-->
    <div class="grayBox">
      <h3>总数据展示：</h3>
      <!-- 数字展示-->
      <div class="numBox">
        <el-row type="flex" justify="center">
          <el-col :span="24" :xs="24">
            <el-row>
              <el-col :span="8" :xs="24" align="middle" v-for="(item, index) in numTops" :key="index">
                <div class="topBox">
                  <div>{{ item.name }}</div>
                  <div>{{ allData[item.field] || '-' }}</div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- 图表展示-->
      <div class="chartBox">
        <el-row>
          <el-col :span="12">
            <doubleYChart :data="everyDayAllData" :xAxis="dayList" :title="dayTitle" :text="chartTitle"></doubleYChart>
          </el-col>
          <el-col :span="12">
            <doubleYChart :data="everyMonthAllData" :xAxis="monthList" :title="monthTitle" :text="chartTitle"></doubleYChart>
          </el-col>
        </el-row>
      </div>
    </div>

    <!--  直播间数据展示-->
    <div class="grayBox">
      <h3>直播间数据展示：</h3>
      <!-- 数字展示-->
      <div class="numBox">
        <el-row type="flex" justify="center">
          <el-col :span="24" :xs="24">
            <el-row>
              <el-col :span="8" :xs="24" align="middle" v-for="(item, index) in numTops" :key="index">
                <div class="topBox">
                  <div>{{ item.name }}</div>
                  <div>{{ liveData[item.field] || '-' }}</div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- 图表展示-->
      <div class="chartBox">
        <el-row>
          <el-col :span="12">
            <doubleYChart :data="everyDayLiveData" :xAxis="dayList" :title="dayTitle" :text="chartTitle"></doubleYChart>
          </el-col>
          <el-col :span="12">
            <doubleYChart :data="everyMonthLiveData" :xAxis="monthList" :title="monthTitle" :text="chartTitle"></doubleYChart>
          </el-col>
        </el-row>
      </div>
    </div>

    <!--  短视频数据展示  -->
    <div class="grayBox">
      <!-- 数字展示-->
      <h3>短视频数据展示：</h3>
      <div class="numBox">
        <el-row type="flex" justify="center">
          <el-col :span="24" :xs="24">
            <el-row>
              <el-col :span="8" :xs="24" align="middle" v-for="(item, index) in numTops" :key="index">
                <div class="topBox">
                  <div>{{ item.name }}</div>
                  <div>{{ videoData[item.field] || '-' }}</div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- 图表展示-->
      <div class="chartBox">
        <el-row>
          <el-col :span="12">
            <doubleYChart :data="everyDayVideoData" :xAxis="dayList" :title="dayTitle" :text="chartTitle"></doubleYChart>
          </el-col>
          <el-col :span="12">
            <doubleYChart :data="everyMonthVideoData" :xAxis="monthList" :title="monthTitle" :text="chartTitle"></doubleYChart>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import doubleYChart from './monitor/doubleYChart.vue'
import {postRequest} from "@/api/request"
import {formatDateTime} from "@/utils/tools/datetime"

export default defineComponent({
  components: {doubleYChart},
  data() {
    return {
      selectedShopId: "",
      shops: [],
      liveData: {
        statCost: 0,
        prepayAndPayOrderRoi: 0,
        payOrderAmount: 0
      },
      videoData: {
        statCost: 0,
        prepayAndPayOrderRoi: 0,
        payOrderAmount: 0
      },
      allData: {
        statCost: 0,
        prepayAndPayOrderRoi: 0,
        payOrderAmount: 0
      },
      numTops: [
        {name: "消耗", field: "statCost"},
        {name: "ROI", field: "prepayAndPayOrderRoi"},
        {name: "成交金额", field: "payOrderAmount"},
      ],
      liveDayRoiList: [],
      videoDayRoiList: [],
      allDayRoiList: [],
      liveDayStatCostList: [],
      videoDayStatCostList: [],
      allDayStatCostList: [],
      liveDayPayOrderAmountList: [],
      videoDayPayOrderAmountList: [],
      allDayPayOrderAmountList: [],
      liveMonthRoiList: [],
      videoMonthRoiList: [],
      allMonthRoiList: [],
      liveMonthStatCostList: [],
      videoMonthStatCostList: [],
      allMonthStatCostList: [],
      liveMonthPayOrderAmountList: [],
      videoMonthPayOrderAmountList: [],
      allMonthPayOrderAmountList: [],
      dayList: [],
      monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dayTitle: "日数据",
      monthTitle: "月数据",
      chartTitle: ['金额/元','ROI','成交金额','消耗'],
      timeSelected: "",
      formatTime: null,
    }
  },
  mounted() {
    this.refreshInterface();
  },
  computed: {
    everyDayVideoData() {
      return [this.videoDayRoiList, this.videoDayStatCostList, this.videoDayPayOrderAmountList];
    },
    everyDayLiveData() {
      return [this.liveDayRoiList, this.liveDayStatCostList, this.liveDayPayOrderAmountList];
    },
    everyDayAllData() {
      return [this.allDayRoiList, this.allDayStatCostList, this.allDayPayOrderAmountList];
    },
    everyMonthVideoData() {
      return [this.videoMonthRoiList, this.videoMonthStatCostList, this.videoMonthPayOrderAmountList];
    },
    everyMonthLiveData() {
      return [this.liveMonthRoiList, this.liveMonthStatCostList, this.liveMonthPayOrderAmountList];
    },
    everyMonthAllData() {
      return [this.allMonthRoiList, this.allMonthStatCostList, this.allMonthPayOrderAmountList];
    }
  },
  methods: {
    refreshInterface() {
      postRequest("/api/boss/totalFees", {
        id: this.selectedShopId,
        selectedTime: this.formatTime
      }).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
        if (!this.selectedShopId && this.shops.length > 0) {
          this.selectedShopId = this.shops[0].id;
        }
      });
    },
    calcDatetimeCanUse() {
      this.formatTime = null;
      if (this.timeSelected) {
        this.formatTime = formatDateTime(this.timeSelected);
        this.refreshInterface();
      }
    }
  }
})
</script>

<style scoped>
.box {
  padding: 15px 15px;
}

.grayBox {
  padding: 15px 15px;
  margin-top: 10px;
}

.numBox {
  border-radius: 10px;
  background-image: linear-gradient(45deg, rgba(136, 204, 136, 0.9), rgb(85, 170, 85));
  padding: 10px 20px 20px 20px;
  margin-top: 15px;
}

.chartBox {
  border-radius: 10px;
  background-color: rgba(255, 250, 250, 0.6);
  margin-top: 20px;
}

.topBox {
  margin-top: 20px;
  font-size: 1.2rem;
  color: white;
  font-weight: bold
}

.topBox > div:nth-child(2) {
  margin-top: 20px;
  font-size: 2rem;
}

.commonBox {
  font-weight: bold;
  margin-top: 20px;
  color: #eeeeee
}

.commonBox > div:nth-child(2) {
  color: white;
  margin-top: 20px;
  font-size: 1.4rem;
}
</style>