<template>
  <StepLayer :layer="layer">
    <div class="box">
    <div class="infinite-list-wrapper" style="overflow: auto">
      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <div class="box_two">
        <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="100" :xs="12" >
              <div style="text-align: left;">
                <el-form-item style="font-size:14px;" label="定向包名称">
                  <el-input v-model="audienceName" placeholder="请输入定向包名称" size="default" clearable >{{audienceName}}</el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        <el-row :gutter="10" style="margin-top: 10px">
          <div style="text-align: left">
            <el-form-item   style="font-size:14px;" label="广告主">
              <el-col :span="100" :xs="12" >
              <el-select v-model="selectedAdvId" placeholder="Select" size="default" @change="refreshAdvertiser">
                <el-option
                    v-for="(item,index) in advertisersId_list"
                    :key="index"
                    :label="item.name"
                    :value="item.advertiserId">
                </el-option>
              </el-select>
              </el-col>
            </el-form-item>

          </div>
         </el-row>
        </div>
        <QianchuanAudience  v-model="audience" v-if="refresh" :goals="'LIVE_PROM_GOODS'" :promotionWay="'SIMPLE'" :advertiser_id=selectedAdvId></QianchuanAudience>
      </ul>
    </div>
    <div class="box_two">
      <el-button type="primary"  @click="onSubmit">保存定向包</el-button>
    </div>
    <MarketUiEvent></MarketUiEvent>
  </div>
  </StepLayer>
</template>

<script>

import { ElMessageBox } from "element-plus";
import {postRequest} from "@/api/request"
import {defineComponent, computed,ref} from "vue"
import StepLayer from "@/components/layer/index.vue"
import ActionInterestSelect from "/views/market_plugins/action_interest_select.vue";
import Schedule from "/views/market_plugins/schedule.vue";
import AudienceTargeting from "/views/market_plugins/audience_targeting.vue";
import DistrictSelect from "/views/market_plugins/district_select.vue";
import AwemeFanSelect from "/views/market_plugins/aweme_fan_select.vue";
import MarketUiEvent from "/views/market_plugins/market_ui_event.vue";
import QianchuanAudience from "/views/market_plugins/qianchuan_audience.vue";


export default defineComponent({

  components: {
    StepLayer,
    QianchuanAudience,
    AwemeFanSelect, DistrictSelect, AudienceTargeting, Schedule, ActionInterestSelect, MarketUiEvent},

  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          audienceName: "",
          advertiserId: "",
          show: false,
          showButton: false,
        }
      },
      required: true
    }
  },

  data() {

    return {
      audienceName:"",
      refresh:true,
      selectedAdvId:"",
      advertisersId_list:[],
      audience: null,
      }

  },
  mounted() {
    this.refreshAdvertiser();
  },
  watch: {
    layer: {
      immediate: true,
      handler(newV, oldV) {
        if (newV.show) {
          postRequest("/api/RuleTask/getAudienceData", {
            audienceName: this.layer.audienceName,
            advertiserId: this.layer.advertiserId,
          }).then(response => {
            console.log( response.data.audience)
            this.audience = response.data.audience;
          })
        }
      },
      deep: true
    },

    "selectedAdvId":function (){
      this.refresh = false
      this.$nextTick(()=>{
        this.refresh = true;
      })

    }
  },
  methods: {
    refreshAdvertiser() {
      postRequest("/api/RuleTask/getAdvertiserIds", {
      }).then(response => {
        this.advertisersId_list = response.data.advertisersId_list;
      });
    },

    onSubmit() {
      console.log("audience_ONE",this.audience);
      console.log("advertiserId",this.selectedAdvId);
      console.log("audience_name",this.audienceName);

      let response;
      response = postRequest("/api/RuleTask/SaveAudiencePackage",{
        audience: JSON.stringify(this.audience),
        advertiserId : this.selectedAdvId,
        audience_name : this.audienceName
      })
          .then(response => {
            ElMessageBox.alert(response.data, '返回结果', {
              confirmButtonText: 'OK'
            })
          })
      console.log(response)
    }
  },
})
</script>

<style scoped>
.box {
  padding: 15px;
  height: 800px;
}
.box_two {
  padding: 15px;
  margin-left:25px;
}
.infinite-list {
  height: 600px;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>