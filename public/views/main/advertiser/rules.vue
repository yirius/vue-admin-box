<template>
  <div class="box">
    <el-row :gutter="10">
      <el-col :span="12">
        <Table :data="advertisers" :pageLayout="''">
          <el-table-column prop="name" label="广告主名称" min-width="180" >
            <template #default="scope">
              <div>{{scope.row.name}}</div>
              <div>{{scope.row.id}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="industry" label="归属品类" width="140" >
            <template #default="scope">
              <div>{{scope.row.first_industry_name}}/{{scope.row.second_industry_name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button type="success" size="small" v-if="selectedAdvertisers.indexOf(scope.row.id)<0" @click="selectedAdvertisers.push(scope.row.id)">选中</el-button>
              <el-button type="danger" size="small" v-if="selectedAdvertisers.indexOf(scope.row.id)>=0" @click="removeAdvertisers(scope.row.id)">取消</el-button>
            </template>
          </el-table-column>
        </Table>
      </el-col>
      <el-col :span="12">
        <Table :data="campaigns" :pageLayout="''">
          <el-table-column prop="name" label="广告组名称" min-width="150" >
            <template #default="scope">
              <div>{{scope.row.name}}</div>
              <div>{{scope.row.id}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="状态及目标" min-width="160" >
            <template #default="scope">
              <div>状态: {{scope.row.status}}</div>
              <div>目标: {{scope.row.marketing_goal}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="create_date" label="创建日期" width="100" />
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button type="success" size="small" v-if="selectedCampaigns.indexOf(scope.row.id)<0" @click="selectedCampaigns.push(scope.row.id)">选中</el-button>
              <el-button type="danger" size="small" v-if="selectedCampaigns.indexOf(scope.row.id)>=0" @click="removeCampaigns(scope.row.id)">取消</el-button>
            </template>
          </el-table-column>
        </Table>
      </el-col>

    </el-row>
    <el-row :gutter="10">
      <el-col :span="10" style="padding-top: 15px">
        <el-form ref="formRef" :model="formValue" label-width="120px">
          <el-form-item label="追溯时间">
            <el-input v-model="formValue.readPrevTime"></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="24">
              <div style="margin-bottom: 15px">第一阶段规则</div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规则类型">
                <el-select v-model="formValue.firstType" placeholder="Select">
                  <el-option label="ROI计算" :value="1"></el-option>
                  <el-option label="STAT_COST消耗计算" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最小消耗值">
                <el-input v-model="formValue.firstMinStatCost" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最小ROI">
                <el-input v-model="formValue.firstMinRoi" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成交金额">
                <el-input v-model="formValue.firstPayedAmount" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div style="margin-bottom: 15px">最终阶段规则</div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否追溯消耗">
                <el-select v-model="formValue.endType" placeholder="Select">
                  <el-option label="不追溯" :value="1"></el-option>
                  <el-option label="追溯前序消耗" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大消耗">
                <el-input v-model="formValue.endMaxValue" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最小ROI">
                <el-input v-model="formValue.endMinRoi" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大ROI">
                <el-input v-model="formValue.endMaxRoi" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="连续消耗">
                <el-input v-model="formValue.endContinuityValue" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点击率">
                <el-input v-model="formValue.endCtr" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" >保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14">
        <div class="layout-container-form flex space-between" style="padding-left: 0">
          <div class="layout-container-form-handle">
            <el-button type="success" :icon="Plus" @click="addCenterParam">新增中间规则</el-button>
            <el-button type="primary" :icon="Connection" @click="submitCenterParam">提交中间规则</el-button>
          </div>
        </div>
        <div style="padding-top: 15px">
          <Table :data="centerParams" :pageLayout="''">
            <el-table-column prop="minStatCost" label="序号" min-width="60" >
              <template #default="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="minStatCost" label="最小消耗" min-width="100" >
              <template #default="scope">
                <div v-if="scope.row.isEdit===0">{{scope.row.minStatCost}}</div>
                <div v-else><el-input v-model="scope.row.minStatCost" type="number"></el-input></div>
              </template>
            </el-table-column>
            <el-table-column prop="maxStatCost" label="最大消耗" min-width="100" >
              <template #default="scope">
                <div v-if="scope.row.isEdit===0">{{scope.row.maxStatCost}}</div>
                <div v-else><el-input v-model="scope.row.maxStatCost" type="number"></el-input></div>
              </template>
            </el-table-column>
            <el-table-column prop="minRoi" label="最小ROI" min-width="100" >
              <template #default="scope">
                <div v-if="scope.row.isEdit===0">{{scope.row.minRoi}}</div>
                <div v-else><el-input v-model="scope.row.minRoi" type="number"></el-input></div>
              </template>
            </el-table-column>
            <el-table-column prop="maxRoi" label="最大ROI" min-width="100" >
              <template #default="scope">
                <div v-if="scope.row.isEdit===0">{{scope.row.maxRoi}}</div>
                <div v-else><el-input v-model="scope.row.maxRoi" type="number"></el-input></div>
              </template>
            </el-table-column>
            <el-table-column prop="ctr" label="点击率" min-width="100" >
              <template #default="scope">
                <div v-if="scope.row.isEdit===0">{{scope.row.ctr}}</div>
                <div v-else><el-input v-model="scope.row.ctr" type="number"></el-input></div>
              </template>
            </el-table-column>
            <el-table-column prop="isCheckPay" label="是否检查支付" min-width="100" >
              <template #default="scope">
                <div v-if="scope.row.isEdit===0">{{scope.row.isCheckPay}}</div>
                <div v-else><el-input v-model="scope.row.isCheckPay" type="number"></el-input></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="scope">
                <el-button type="success" size="small" @click="scope.row.isEdit=1" v-if="scope.row.isEdit===0">编辑</el-button>
                <el-button type="info" size="small" @click="scope.row.isEdit=0" v-if="scope.row.isEdit===1">保存</el-button>
                <el-button type="danger" size="small" @click="deleteCenterParam(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </Table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { postRequest } from "@/api/request";
import Table from "@/components/table/index.vue";
import { Plus, Connection } from "@element-plus/icons";

export default defineComponent({
  components: { Table },
  data() {
    return {
      Plus, Connection,
      selectedAdvertisers: [],
      advertisers: [],
      selectedCampaigns: [],
      campaigns: [],
      detail: {},
      formValue: {
        readPrevTime: 4,
        firstType: 1,
        firstMinStatCost: 50,
        firstMinRoi: 0,
        firstPayedAmount: 0,
        endType: 1,
        endMaxValue: 400,
        endMinRoi: 1.9,
        endMaxRoi: 2.5,
        endContinuityValue: 200,
        endCtr: 1
      },
      centerParams: []
    }
  },
  mounted() {
    this.getAdvertiserRules();
  },
  methods: {
    getAdvertiserRules() {
      if(this.$route.params.advertiserId) {
        postRequest("/api/admin/rulesConfig", {
          advertiserId: this.$route.params.advertiserId
        }).then(response => {
          for(var i in response.data) {
            this[i] = response.data[i];
          }
        })
      }
    },
    addCenterParam() {
      this.centerParams.push({
        minStatCost: 60,
        maxStatCost: 100,
        minRoi: 0.7,
        maxRoi: 1.2,
        ctr: 1,
        isCheckPay: 0,
        isEdit: 0
      });
    },
    deleteCenterParam(index) {
      this.centerParams.splice(index, 1);
    },
    removeCampaigns(id) {
      if(this.selectedCampaigns.indexOf(id) >= 0) {
        this.selectedCampaigns.splice(this.selectedCampaigns.indexOf(id), 1);
      }
    },
    removeAdvertisers(id) {
      if(this.selectedAdvertisers.indexOf(id) >= 0) {
        this.selectedAdvertisers.splice(this.selectedAdvertisers.indexOf(id), 1);
      }
    }
  }
})
</script>

<style scoped>
  .box {
    padding: 15px;
  }
</style>