<template>
  <el-dialog
      v-model="dialog1Visible"
      title="排除关键词"
      width="30%">


    <el-form ref="formRef1" :model="excludedWordsForm">
      <div>
        <el-form-item>
          <el-input v-model="excludedWordsForm.excludedWordsFirst"/>
        </el-form-item>
      </div>

      <div v-for="(excludeWord,index) in excludedWordsForm.excludedWordsList">
        <el-form-item>
          <el-input v-model="excludeWord.word"/>
        </el-form-item>
      </div>
    </el-form>
    <el-button @click="addNewExcludeWord">新增关键词</el-button>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog1Visible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmExcludeWord">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="dialog2Visible"
      title="必选关键词"
      width="30%">


    <el-form ref="formRef2" :model="includedWordsForm">
      <div>
        <el-form-item>
          <el-input v-model="includedWordsForm.includedWordsFirst"/>
        </el-form-item>
      </div>

      <div v-for="(includeWord,index) in includedWordsForm.includedWordsList">
        <el-form-item>
          <el-input v-model="includeWord.word"/>
        </el-form-item>
      </div>
    </el-form>
    <el-button @click="addNewIncludeWord">新增关键词</el-button>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog2Visible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmIncludeWord">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

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
        <el-table-column prop="request_id" label="请求id" :show-overflow-tooltip='true'/>
      </el-table>
    </el-row>
  </el-dialog>
  <div class="box" v-loading="all_loading">
    <modeltaskModeltaskTableEditLayer :layer="modeltask_table_edit_layer_data"
                                      @getTableData="getTableData"
                                      v-if="modeltask_table_edit_layer_data.show" />
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
                           @change="getLiveRoomsAndCrowds($event, formValue.advertiser)">
                  <el-option v-for="adv in advertisers" :value="adv.advertiserId" :label="adv.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="直播间" prop="liveRoom">
                <el-select v-model="formValue.liveRoom" filterable  placeholder="Select">
                  <el-option v-for="r in liveRoomToShow" :label="r.awemeName" :key="r.awemeId"
                             :value="r.awemeId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>


            <el-col :span="12">
              <el-form-item label="类别" prop="taskType">
                <el-select v-model="formValue.taskType" clearable placeholder="Select" filterable>
                  <el-option v-for="t in taskTypes" :label="t" :key="t" :value="t"></el-option>
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="放量计划数量" prop="conservativeNum">
                <el-input v-model="formValue.conservativeNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付ROI计划数量" prop="payRoiNum" label-width="150px">
                <el-input v-model="formValue.payRoiNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="直播间成交计划数量" prop="payNum" label-width="150px">
                <el-input v-model="formValue.payNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下单计划数量" prop="createNum">
                <el-input v-model="formValue.createNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付ROI目标" prop="paiRoiTarget">
                <el-input v-model="formValue.paiRoiTarget"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划标题" prop="adTitle">
                <el-input :maxlength="10" v-model="formValue.adTitle"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="选择人群包" prop="includeCrowd">
                <el-select v-model="formValue.includeCrowd" filterable multiple placeholder="Select">
                  <el-option v-for="c in crowdToShow" :label="c.name" :key="c.retargetingTagsId"
                             :value="c.retargetingTagsId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排除人群包" prop="excludeCrowd">
                <el-select v-model="formValue.excludeCrowd" filterable multiple placeholder="Select">
                  <el-option v-for="c in crowdToShow" :label="c.name" :key="c.retargetingTagsId"
                             :value="c.retargetingTagsId">
                  </el-option>

              <el-form-item label="人群包" prop="ifPeoplePack">
                <el-select v-model="formValue.ifPeoplePack" placeholder="Select">
                  <el-option label="使用" :value="1"></el-option>
                  <el-option label="不使用" :value="0"></el-option>
                </el-select>
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
            <el-col :span="12">
            </el-col>
            <el-col :span="12">
              <el-form-item label="排除关键词" prop="excludedWords">
                <el-input v-model="excludedWordsToShow" readonly="true">
                  <template #suffix>
                    <!--                    -->
                    <!--                    <el-button type="primary" :icon="CirclePlus"></el-button>-->

                    <el-icon class="el-input__icon" @click="inputIconClick">
                      <circle-plus/>
                    </el-icon>
                  </template>
                </el-input>
                <!--                <el-select v-model="formValue.campaign" placeholder="Select">-->
                <!--                  <el-option label="广告组1" :value="1"></el-option>-->
                <!--                  <el-option label="广告组2" :value="2"></el-option>-->
                <!--                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="必选关键词" prop="includedWords">
                <el-input v-model="includedWordsToShow" readonly="true">
                  <template #suffix>
                    <!--                    -->
                    <!--                    <el-button type="primary" :icon="CirclePlus"></el-button>-->

                    <el-icon class="el-input__icon" @click="includeInputIconClick">
                      <circle-plus/>
                    </el-icon>
                  </template>
                </el-input>
                <!--                <el-select v-model="formValue.campaign" placeholder="Select">-->
                <!--                  <el-option label="广告组1" :value="1"></el-option>-->
                <!--                  <el-option label="广告组2" :value="2"></el-option>-->
                <!--                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排除城市" prop="excludedCity">
                <el-cascader
                    :options="options"
                    :props="props"
                    collapse-tags
                    v-model="formValue.excludedCity"
                    clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择城市" prop="includedCity">
                <el-cascader
                    :options="options"
                    :props="props"
                    collapse-tags
                    v-model="formValue.includedCity"
                    clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" @click="choose()" :disabled="chooseDisavailability">提交配置
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
        <el-table :data="parsedPlans" style="width: 100%" v-loading="model_task_loading"
               @selection-change="handleSelectionChange" @row-click="clickRow">
          <el-table-column type="selection" width="55"/>
          <!--          <el-table-column prop="advertiser_id" label="广告主" width="180" />-->
          <!--          <el-table-column prop="campaign_id" label="广告组" width="180" />-->


          <el-table-column width="55" label="id" prop="id"/>
          <el-table-column v-for="(item, index) in parsedPlansColumns" :key="index" :label="item" :prop="item"
                           :show-overflow-tooltip='true' width="100" >
            <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
            <template #default="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {postRequest} from "@/api/request";
import Table from "@/components/table/index.vue";
import {ElMessage} from "element-plus";
import modeltaskModeltaskTableEditLayer from "./modelTaskEdit.vue"
import {Plus, Connection, CirclePlus} from "@element-plus/icons";

export default defineComponent({
  components: {Table,modeltaskModeltaskTableEditLayer},
  data() {
    return {
      Plus, Connection, CirclePlus,
      limitBid: null,
      limitBudget: null,
      accessType: null,
      props: {multiple: true, emitPath: false},
      modeltask_table_edit_layer_data :{ "show": false, "showButton": true, "title": "编辑"},
      rules: {
        ratioOfPay: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateRatioOfPay, trigger: 'blur'},
        ],
        liveRoom: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        taskType: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        conservativeNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        payRoiNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        paiRoiTarget: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        payNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        createNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        advertiser: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        // campaign: [
        //   {required: true, message: '必填项，请输入', trigger: 'blur'},
        // ],
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
      model_task_loading: false,
      all_loading: false,
      dialog1Visible: false,
      dialog2Visible: false,
      dialog3Visible: false,
      plansToUpload: [],
      parsedPlans: [],
      parsedPlansColumns: [],
      uploadDisavailability: true,
      chooseDisavailability: false,
      advertisers: [],
      campaigns: {},
      campaignsToShow: [],
      liveRooms: {},
      liveRoomToShow: [],
      crowds: {},
      crowdToShow: [],
      taskTypes: [],

      options: [],
      successful:[],
      failed:[],
      excludedWordsToShow: "",
      excludedWordsForm: {
        excludedWordsFirst: null,
        excludedWordsList: [],
      },

      includedWordsToShow: "",
      includedWordsForm: {
        includedWordsFirst: null,
        includedWordsList: [],
      },
      planType:"模型计划",
      formValue: {
        ratioOfPay: null,
        excludedWords: [],
        includedWords: [],
        maxBid: null,
        minBid: null,
        liveRoom: null,
        taskType: null,
        advertiser: null,
        excludedCity: [],
        includedCity: [],
        includeCrowd: [],
        excludeCrowd: [],

        ifPeoplePack: null,
        conservativeNum: null,//放量计划数量
        payRoiNum: null,//支付ROI计划数量
        paiRoiTarget: null,//支付ROI目标
        payNum: null,//直播间成交计划数量
        createNum: null,
        adTitle: null
      },
      centerParams: []
    }
  },
  mounted() {
    this.getData();
    this.getCityTreeData();
  },
  methods: {
    clickRow(row,event,column){
      this.modeltask_table_edit_layer_data.rowIdKey = row['id'];
      this.modeltask_table_edit_layer_data.liveRooms = this.liveRooms;
      this.modeltask_table_edit_layer_data.advertisers = this.advertisers;
      this.modeltask_table_edit_layer_data.crowds = this.crowds;
      this.modeltask_table_edit_layer_data.planType = this.planType;
      this.modeltask_table_edit_layer_data.rowSqlIdKey = row['sql_id'];
      this.modeltask_table_edit_layer_data.show = true;
    },

    confirmExcludeWord() {
      this.formValue.excludedWords = []
      this.formValue.excludedWords.push(this.excludedWordsForm.excludedWordsFirst)
      for (var key in this.excludedWordsForm.excludedWordsList) {
        this.formValue.excludedWords.push(this.excludedWordsForm.excludedWordsList[key]["word"])
      }
      for (var i in this.formValue.excludedWords) {
        if (i == 0) {
          this.excludedWordsToShow = this.formValue.excludedWords[i]
        } else {
          this.excludedWordsToShow = this.excludedWordsToShow + "," + this.formValue.excludedWords[i]
        }
      }
      this.dialog1Visible = false
    },

    addNewExcludeWord() {
      this.excludedWordsForm.excludedWordsList.push({'word': ''})
    },


    inputIconClick() {
      this.dialog1Visible = true
    },


    confirmIncludeWord() {
      this.formValue.includedWords = []
      this.formValue.includedWords.push(this.includedWordsForm.includedWordsFirst)
      for (var key in this.includedWordsForm.includedWordsList) {
        this.formValue.includedWords.push(this.includedWordsForm.includedWordsList[key]["word"])
      }
      for (var i in this.formValue.includedWords) {
        if (i == 0) {
          this.includedWordsToShow = this.formValue.includedWords[i]
        } else {
          this.includedWordsToShow = this.includedWordsToShow + "," + this.formValue.includedWords[i]
        }
      }
      this.dialog2Visible = false
    },

    addNewIncludeWord() {
      this.includedWordsForm.includedWordsList.push({'word': ''})
    },


    includeInputIconClick() {
      this.dialog2Visible = true
    },
    uploadPlan() {
      if (this.plansToUpload.length != 0) {
        this.chooseDisavailability = true;
        this.uploadDisavailability = true;
        this.all_loading = true;
        postRequest("/api/modeltask/uploadPlan", {postData: JSON.stringify(this.plansToUpload),resultType: this.formValue.taskType,planType:this.planType})
            .then(response => {
              this.getTableData()
              this.dialog3Visible=true;
              this.failed = response.data.result["failedIds"]
              this.successful = response.data.result["successfulIds"]
              this.chooseDisavailability = false;
              this.uploadDisavailability = false;
              this.all_loading = false;
            })
      }
    },

    handleSelectionChange(val) {
      // 获取到选中行的数据
      if (val.length == 0) {
        this.uploadDisavailability = true;
      } else {
        this.uploadDisavailability = false;
        var planArray = [];
        for (var i = 0; i < val.length; i++) {
          planArray.push(val[i].postData);
        }
        this.plansToUpload = planArray;
      }

    },

    choose() {

      this.$refs.formRef.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.model_task_loading = true;
          this.chooseDisavailability = true;
          postRequest("/api/modeltask/choose", {
            awemeId: this.formValue.liveRoom,
            resultType: this.formValue.taskType,
            bidRangeMin: this.formValue.minBid,
            bidRangeMax: this.formValue.maxBid,
            conservativeNum: this.formValue.conservativeNum,
            payRoiNum: this.formValue.payRoiNum,
            paiRoiTarget: this.formValue.paiRoiTarget,
            payNum: this.formValue.payNum,
            createNum:this.formValue.createNum,
            adTitle: this.formValue.adTitle,
            payRate: this.formValue.ratioOfPay,
            // crowd: this.formValue.ifPeoplePack,
            advertiserId: this.formValue.advertiser,
            excludeWords: JSON.stringify(this.formValue.excludedWords),
            includeWords: JSON.stringify(this.formValue.includedWords),
            excludeCity: JSON.stringify(this.formValue.excludedCity),
            includeCity: JSON.stringify(this.formValue.includedCity),
            excludeCrowd: JSON.stringify(this.formValue.excludeCrowd),
            includeCrowd: JSON.stringify(this.formValue.includeCrowd),
            planType:this.planType
            // campaignId: this.formValue.campaign,
          }).then(response => {
            console.log(response)
            if (response.data.parsedPlans.length != parseInt(this.formValue.conservativeNum)+
                parseInt(this.formValue.payRoiNum)+parseInt(this.formValue.payNum)+parseInt(this.formValue.createNum)) {
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
    //获得缓存的数据
    getTableData(){
      postRequest("/api/modeltask/getTableData", {
        planType: this.planType
      }).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
      })
    },
    //获得字段的选项，比如adv id的选项。
    getData() {
      postRequest("/api/modeltask/getData", {}).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
      })
      this.getTableData();
    },

    getCityTreeData() {
      postRequest("/restful/monitor/qcCity/getCityTree", {}).then(response => {
        this.$data.options = response.data;
      })
    },

    getLiveRoomsAndCrowds(val, advId) {
      if (val != null && val != '' && val != undefined) {
        this.liveRoomToShow = this.liveRooms[advId];
        this.formValue.liveRoom = null;
        this.crowdToShow = this.crowds[advId];
        this.formValue.excludeCrowd = null;
        this.formValue.includeCrowd = null;
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
    validateRatioOfPay(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
        return callback(new Error('输入值必须合法数字'));
      }

      const one = Number(value);
      var max = 1
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值超出限制'));
      }
      return callback();
    },

    validateBid(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
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
    validateBudget(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
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