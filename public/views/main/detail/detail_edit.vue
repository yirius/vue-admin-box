<template>
  <StepLayer :layer="layer">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="出价">
        <el-input v-model="form.cpa_bid">{{form.cpa_bid}}</el-input>
      </el-form-item>
      <el-form-item label="预算">
        <el-input v-model="form.budget">{{form.budget}}</el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即更改</el-button>
      </el-form-item>
    </el-form>
  </StepLayer>
</template>

<script lang="ts">
import { defineComponent, ref, Vue } from 'vue';
import {postRequest} from "@/api/request";
import StepLayer from "@/components/layer/index.vue"
import { ElMessageBox } from "element-plus";
export default defineComponent({
  components: { StepLayer },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          rowIdKey: 0,
          adId: null,
          advertiserId: null,
          show: false,
          title: '',
          showButton: false,
        }
      },
      required: true
    }
  },
  data() {
    return{
      form: {
        advertiser_id: null,
        ad_id: null,
        cpa_bid: null,
        budget: null
      }
    }
  },
  mounted() {

  },
  watch: {
    layer: {
      immediate: true,
      handler(newV, oldV) {
        if (newV.show) {
          postRequest("/api/detailEdit/getAdData", {
            adId: this.layer.adId,
            advertiserId: this.layer.advertiserId
          }).then(response => {
            this.form.ad_id = response.data.ad_id;
            this.form.advertiser_id = response.data.advertiser_id;
            this.form.cpa_bid = response.data.cpa_bid;
            this.form.budget = response.data.budget
          })
        }
      },
      deep: true
    }
  },
  methods:{
    onSubmit() {
      let response;
      response = postRequest("/api/detailEdit/updateCpaBidAndBudget",{
        adId: this.form.ad_id,
        advertiserId: this.form.advertiser_id,
        cpaBid: this.form.cpa_bid,
        budget: this.form.budget
      })
          .then(response => {
            ElMessageBox.alert(response.data, '返回结果', {
              confirmButtonText: 'OK'
            })
          })
    }
  }
})
</script>

<style scoped>

</style>