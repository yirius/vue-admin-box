<template>
  <StepLayer :layer="layer">
    <el-empty v-if="successful.length==0&&failed.length==0" description="暂无数据" />
    <el-row>
      <div style="margin: 15px" v-if="successful.length!=0">成功创意</div>
    </el-row>
    <el-row>
      <el-table style="margin-left: 15px" stripe v-if="successful.length!=0" :data="successful" style="width: 100%">
        <el-table-column width="150" label="广告主ID" prop="advertiser_id"/>
        <el-table-column prop="creative_id" label="创意ID" :show-overflow-tooltip='true'/>
      </el-table>
    </el-row>
    <el-row>
      <div style="margin: 15px" v-if="failed.length!=0">失败创意</div>
    </el-row>
    <el-row>
      <el-table style="margin-left: 15px" stripe v-if="failed.length!=0" :data="failed" style="width: 100%">
        <el-table-column width="150" label="广告主ID" prop="advertiser_id"/>
        <el-table-column prop="creative_id" label="创意ID" width="150" :show-overflow-tooltip='true'/>
        <el-table-column prop="error_message" label="错误信息" :show-overflow-tooltip='true'/>
      </el-table>
    </el-row>
  </StepLayer>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { postRequest } from "@/api/request";
import Table from "@/components/table/index.vue";
import { Plus, Connection } from "@element-plus/icons";
import { ElMessage } from "element-plus";
import StepLayer from "@/components/layer/index.vue"

export default {
  components: { StepLayer },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          responseResult:{},
          width:"100%",
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
      columns: [
        {label: "使用参数", prop: "field"},
        {label: "参数类型", prop: "fieldType"},
        {label: "判断数值", prop: "params"}
      ],
      advertisers:[],
      successful: [],
      failed: [],
    }
  },
  mounted() {
    console.log(this.layer.responseResult.data)
    this.successful = this.layer.responseResult.data["successfulIds"];
    this.failed = this.layer.responseResult.data["failedIds"];
  },

  methods: {

  }
}
</script>