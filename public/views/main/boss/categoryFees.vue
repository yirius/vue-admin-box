<template>
  <div class="box">
    <!--  筛选部分-->
    <el-row :gutter="10">

      <!--   当前展示商铺-->
      <el-col :span="4" :xs="24"><div style="line-height: 40px">当前展示商铺: </div></el-col>
      <el-col :span="6" :xs="24">
        <el-select  v-model="value" class="m-2" placeholder="请选择" size="large">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>

      <!--   时间筛选月-->
      <el-col :span="4" :offset="2" :xs="24"><div style="line-height: 40px">时间筛选月: </div></el-col>
      <el-col :span="6" :xs="24">
        <div class="block">
          <el-date-picker
              size="large"
              v-model="value"
              type="month"
              placeholder="选择月"
              style="width: 100%">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>

    <!--    饼图显示-->
    <el-row :gutter="10">
      <el-col :span="15" :xs="24">
        <div class="grayBox">
          <pieSpecialLabel></pieSpecialLabel>
        </div>
      </el-col>
      <el-col :span="9" :xs="24">
        <div class="grayBox">
          <Table :data="runingTask" :pageLayout="''" style="background-color: transparent">
            <el-table-column prop="adId" label="消耗" width="150" class-name="transparentRow" />
            <el-table-column prop="name" label="GMV" min-width="180" />
            <el-table-column prop="statCost" label="ROI" width="100" />
          </Table>
        </div>
      </el-col>
    </el-row>

    <!--    日/月维度图表展示-->
    <el-row :gutter="15">
      <el-col :span="12" :xs="24">
        <div class="grayBox">
          <doubleYChart :data="lineChartData" :names="lineChartNames" :xAxis="timeList" ></doubleYChart>
        </div>
      </el-col>
      <el-col :span="12" :xs="24">
        <div class="grayBox">
          <doubleYChart :data="lineChartData" :names="lineChartNames" :xAxis="timeList" ></doubleYChart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import pieSpecialLabel from './monitor/pieSpecialLabel.vue'
import doubleYChart from './monitor/doubleYChart.vue'
import Table from "@/components/table/index.vue"
import { postRequest } from "@/api/request"


export default defineComponent({
  components: { doubleYChart, pieSpecialLabel,Table },
  // data() {
  //   return {
  //     selectedShopName: "",
  //     shops: [],
  //     value: ''
  //   }
  // },
  data() {
    return {
      options: [{
        value: '选项1',
        label: '卫仕'
      }, {
        value: '选项2',
        label: '车品'
      }, {
        value: '选项3',
        label: '函叔水果'
      }, {
        value: '选项4',
        label: '连花清瘟'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '选项1',
      label: '卫仕'
    }
  },
  mounted() {
    this.refreshInterface();
  },
  methods: {
    refreshInterface() {
      postRequest("/api/boss/interface", {
        shopName: this.selectedShopName
      }).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
        // if(!this.selectedAdvertiserId && this.advertisers.length > 0) {
        //   this.selectedAdvertiserId = this.advertisers[0].advertiserId;
        // }
      });
    },
  }
})
</script>

<style>
.box {
  padding: 15px;
}

.numBox {
  border-radius: 20px;
  background-image: linear-gradient(45deg, rgba(136, 204, 136, 0.9), rgb(85, 170, 85));
  padding: 10px 20px 20px 20px;
  margin-top: 20px;
}

.topBox { margin-top: 20px;font-size: 1.2rem;color: white;font-weight: bold }
.topBox > div:nth-child(2) { margin-top: 20px;font-size: 2rem; }
.commonBox { font-weight: bold;margin-top: 20px;color: #eeeeee }
.commonBox > div:nth-child(2) { color: white;margin-top: 20px;font-size: 1.4rem; }

.grayBox {
  border-radius: 20px;
  background-color: rgba(255,255,255,0.6);
  padding: 20px;
  margin-top: 20px;
}
</style>