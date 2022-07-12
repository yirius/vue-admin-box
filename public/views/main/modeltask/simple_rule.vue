<template>
  <el-dialog
      v-model="dialog3Visible"
      title="投放结果"
      width="50%">
    <el-row>
      <div style="margin: 15px" v-if="successful.length!=0">成功计划</div>
    </el-row>
    <el-row>
      <el-table style="margin-left: 15px" stripe v-if="successful.length!=0" :data="successful" style="width: 100%">
        <el-table-column width="55" label="id" prop="id"/>
        <el-table-column prop="ad_id" label="计划ID" :show-overflow-tooltip='true'/>
      </el-table>
    </el-row>
    <el-row>
      <div style="margin: 15px" v-if="failed.length!=0">失败计划</div>
    </el-row>
    <el-row>
      <el-table style="margin-left: 15px" stripe v-if="failed.length!=0" :data="failed" style="width: 100%">
        <el-table-column width="55" label="id" prop="id"/>
        <el-table-column prop="code" label="返回码" width="180" :show-overflow-tooltip='true'/>
        <el-table-column prop="message" label="具体信息" :show-overflow-tooltip='true'/>
      </el-table>
    </el-row>
  </el-dialog>

  <div class="box" v-loading="all_loading">
    <modeltaskModeltaskTableEditLayer :layer="simpletask_table_edit_layer_data"
                                      @getTableData="getTableData"
                                      v-if="simpletask_table_edit_layer_data.show" />
    <el-row :gutter="10">
      <el-col :span="24" style="padding-top: 15px">
        <el-form ref="formRef" :model="formValue" :rules="rules" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="24">
              <div style="margin-bottom: 15px">上传设置</div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="广告主" prop="advertiser">
                <el-select v-model="formValue.advertiser" placeholder="Select"
                           @change="getLiveRooms($event, formValue.advertiser)">
                  <el-option v-for="adv in advertisers" :value="adv.advertiserId" :label="adv.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="直播间" prop="liveRoom">
                <el-select v-model="formValue.liveRoom" filterable placeholder="Select">
                  <el-option v-for="r in liveRoomToShow" :label="r.awemeName" :key="r.awemeId"
                             :value="r.awemeId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="计划数量" prop="taskNum">
                <el-input v-model="formValue.taskNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-col :span="12">
                <el-form-item label="出价最小值" prop="minBid">
                  <el-input v-model.trim="formValue.minBid" @change="handleMinChange"
                            oninput="value=value.replace(/[^0-9+.]/g,'')"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出价最大值" prop="maxBid">
                  <el-input v-model.trim="formValue.maxBid" @change="handleMaxChange"
                            oninput="value=value.replace(/[^0-9+.]/g,'')"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" @click="chooseSimple()" :disabled="chooseDisavailability">提交配置
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="success" :disabled="uploadDisavailability" @click="uploadPlan()">上传计划</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-col>

    </el-row>


    <el-row :gutter="10">
      <el-col :span="24">
        <Table :data="parsedPlans" style="width: 100%" v-loading="model_task_loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column width="55" label="id" prop="id"/>

          <!--          <el-table-column prop="advertiser_id" label="广告主" width="180" />-->
<!--          <el-table-column prop="campaign_id" label="广告组" width="180" />-->
          <el-table-column v-for="(item, index) in parsedPlansColumns" :key="index" :label="item" :prop="item" :show-overflow-tooltip='true' width="100">
            <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
            <template #default="scope">
              {{scope.row[scope.column.property]}}
            </template>
          </el-table-column>
        </Table>
      </el-col>
    </el-row>

  </div>
</template>


<script lang="ts">
	
import {defineComponent, ref} from 'vue';
import {postRequest} from "@/api/request";
import Table from "@/components/table/index.vue";
import { ElMessage } from "element-plus";
import {Plus, Connection, CirclePlus} from "@element-plus/icons";
import modeltaskModeltaskTableEditLayer from "./modelTaskEdit.vue";

export default defineComponent({
  components: {Table,modeltaskModeltaskTableEditLayer},

  data() {
    return {
      Plus, Connection,CirclePlus,
      simpletask_table_edit_layer_data :{ "show": false, "showButton": true, "title": "编辑"},

      planType:"极速计划",
      limitBid: null,
      limitBudget: null,
      accessType: null,
      rules: {
        liveRoom: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        taskNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateTaskNum, trigger: 'blur'},
        ],
        advertiser: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        minBid: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBid, trigger: 'blur'},
          {validator: this.validateMin, trigger: 'blur'},
        ],
        maxBid: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBid, trigger: 'blur'},
          {validator: this.validateMax, trigger: 'blur'},
        ],
      },
      model_task_loading:false,
      all_loading:false,
      dialog1Visible:false,
      dialog2Visible:false,
      plansToUpload:[], //不能删
      parsedPlans:[],//不能删
      parsedPlansColumns:[],//不能删
      uploadDisavailability: true,
      chooseDisavailability:false,
      advertisers: [],//不能删
      campaigns: {},//不能删
      campaignsToShow: [],//不能删
      liveRooms: {},//不能删
      liveRoomToShow: [],//不能删
      dialog3Visible: false,
      successful:[],
      failed:[],
      formValue: {
        maxBid: null,
        minBid: null,
        liveRoom: null,
        taskNum: null,
        advertiser: null,
      },
      centerParams: []
    }
  },
  mounted() {
    this.getData();
  },
  methods: { // 专门写方法
    clickRow(row,event,column){
      console.log(row['id'])
      this.simpletask_table_edit_layer_data.rowIdKey = row['id'];
      this.simpletask_table_edit_layer_data.liveRooms = this.liveRooms;
      this.simpletask_table_edit_layer_data.advertisers = this.advertisers;
      this.simpletask_table_edit_layer_data.crowds = this.crowds;
      this.simpletask_table_edit_layer_data.planType = this.planType;
      this.simpletask_table_edit_layer_data.rowSqlIdKey = row['sql_id'];
      this.simpletask_table_edit_layer_data.show = true;
    },
    inputIconClick(){
      this.dialog1Visible = true
    },
    includeInputIconClick(){
      this.dialog2Visible = true
    },
	
    uploadPlan (){
      if (this.plansToUpload.length != 0) {
        this.chooseDisavailability = true;
        this.uploadDisavailability = true;
        this.all_loading = true;
        postRequest("/api/modeltask/uploadPlan", {postData: JSON.stringify(this.plansToUpload), resultType: "tju_极速自动投放",planType:this.planType})
            .then(response => {
              this.dialog3Visible=true;
              this.failed = response.data.result["failedIds"]
              this.successful = response.data.result["successfulIds"]
              this.chooseDisavailability = false;
              this.uploadDisavailability = false;
              this.all_loading = false;
            })
      }
    },

    handleSelectionChange (val) {
      // 获取到选中行的数据
      if (val.length==0){
        this.uploadDisavailability=true;
      }else  {
        this.uploadDisavailability=false;
        var planArray=[];
        for (var i=0;i<val.length;i++) {
          planArray.push(val[i].postData);
        }
        this.plansToUpload=planArray;
      }

    },

    chooseSimple() {

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.model_task_loading = true;
          this.chooseDisavailability = true;
          postRequest("/api/modeltask/chooseSimple", {
            planNumber: this.formValue.taskNum,
            awemeId: this.formValue.liveRoom,
            bidRangeMin: this.formValue.minBid,
            bidRangeMax: this.formValue.maxBid,
            advertiserId: this.formValue.advertiser,
            planType:this.planType
            // campaignId: this.formValue.campaign,
          }).then(response => {

            if (response.data.parsedPlans.length!=this.formValue.taskNum){
              ElMessage('系统中计划数不足所输入数量，总共' + response.data.parsedPlans.length + "条")
            }

            for (var i in response.data) {
              this[i] = response.data[i];
            }
            this.model_task_loading = false;
            this.chooseDisavailability = false;
          })
        }

      });

    },

    getData() {
      postRequest("/api/modeltask/getData", {}).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
      })
      this.getTableData();
    },
    //获得缓存计划数据
    getTableData() {
      postRequest("/api/modeltask/getTableData", {
        planType: this.planType
      }).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
      })
    },
    getLiveRooms(val, advId) {
      if (val != null && val != '' && val != undefined) {
        this.liveRoomToShow = this.liveRooms[advId];
        this.formValue.liveRoom = null;
      }
    },

    getFormData() {
      const ret = {
        valid: null,
        form: null,
      };
      this.$refs.formRef.validate((valid) => {
        ret.valid = valid;
        ret.form = this.form;
      });
      return ret;
    },
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    handleMinChange() {
      this.$refs.formRef.validateField('minBid');
    },
    handleMaxChange() {
      this.$refs.formRef.validateField('maxBid');
    },
    validateBid(rule, value, callback) {
      if (value.toString().indexOf(".")==0){
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length>2){
        return callback(new Error('输入值必须合法数字'));
      }

      const one = Number(value);
      var max = 10000
      console.log(this.limitBid)
      if (this.limitBid != null && this.accessType == 1) {
        max = this.limitBid
      }
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值超出限制'));
      }
      return callback();
    },
    validateTaskNum(rule, value, callback) {
      const one = Number(value);
      var max = 1000
      if (one <= 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('一次性不能超过1000个计划'));
      }
      return callback();
    },
    validateBudget(rule, value, callback) {
      if (value.toString().indexOf(".")==0){
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length>2){
        return callback(new Error('输入值必须合法数字'));
      }

      const one = Number(value);
      var max = 10000
      if (this.limitBudget != null && this.accessType == 1) {
        max = this.limitBudget
      }
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值超出限制'));
      }
      return callback();
    },
    validateMin(rule, value, callback) {
      const one = Number(value);
      const max = Number(this.formValue.maxBid);
      if (!max || one < max) {
        return callback();
      }
      return callback(new Error('输入值不得大于最大阈值'));
    },
    validateMax(rule, value, callback) {
      const one = Number(value);
      const min = Number(this.formValue.minBid);
      if (!min || one > min) {
        return callback();
      }
      return callback(new Error('输入值不得小于最小阈值'));
    },
  }
})
</script>

<style scoped>
.box {
  padding: 15px;
}
</style>