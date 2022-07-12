<template>
  <StepLayer :layer="layer">
    <div class="layout-container">
      <div class="layout-container-form flex space-between">
        <div class="layout-container-form-handle">
          <el-button icon="Plus" type="info" @click="addNewStep">新增步骤</el-button>
          <el-button icon="Finished" type="success" @click="submitStep" :disabled="saveDisability">步骤保存</el-button>
        </div>
      </div>
      <div class="layout-container-table" style="padding: 0">
        <div class="layout-container" style="width: 100%;height: 100%;margin: 0"
             v-for="(table_data, index) in steps_table_data" :key="index">
          <div class="layout-container-form flex space-between">
            <div class="layout-container-form-handle">
              <div class="lineHeight30" style="margin-right: 10px">第{{index+1}}步:</div>
              <el-button icon="Plus" type="primary" @click="addNewStepRule(index)">新增规则</el-button>
              <el-popconfirm title="是否确定删除该条数据?"  @confirm="delStep(index)" >
                <template #reference>
                  <el-button icon="Plus" type="danger">删除该步</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <div class="layout-container-table" style="min-height: 100px">
            <el-table ref="xlsx_table" :data="table_data"
                      :stripe="true" :defaultExpandAll="true"
                      pageLayout="total,sizes,prev,pager,next,jumper"
                      :pageSizes="[100,500,1000]" :highlightCurrentRow="true"
                      :showSelection="true" rowKey="_thinker_index">
              <el-table-column label="使用参数" prop="field">
                <template #default="scope">
                  <el-select v-model="scope.row.field">
                    <el-option :value="opt.value" :label="opt.label" v-for="(opt, optIndex) in use_fields" key="optIndex"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="参数类型" prop="fieldType">
                <template #default="scope">
                  <el-select v-model="scope.row.fieldType">
                    <el-option :value="1" :label="'区间(输入值1<所选值<=输入值2)'"></el-option>
                    <el-option :value="2" :label="'输入框(自定义内容)'"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="并且规则" prop="andOr">
                <template #default="scope">
                  <el-select v-model="scope.row.andOr">
                    <el-option :value="1" :label="'且(AND)判断'"></el-option>
                    <el-option :value="2" :label="'或(OR)判断'"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="判断数值" prop="params">
                <template #default="scope">
                  <div v-if="scope.row.fieldType>1">
                    <el-input v-model="scope.row.params[0]" placeholder="请输入值" oninput="value=value.replace(/[^0-9+.]/g,'')" @change="validateNum"></el-input>
                  </div>
                  <div v-else>
                    <el-row>
                      <el-col :span="11">
                        <el-input v-model="scope.row.params[0]" placeholder="请输入值" oninput="value=value.replace(/[^0-9+.]/g,'')" @change="validateNum"></el-input>
                      </el-col>
                      <el-col :span="2">
                        <div class="text-center">-</div>
                      </el-col>
                      <el-col :span="11">
                        <el-input v-model="scope.row.params[1]" placeholder="请输入值" oninput="value=value.replace(/[^0-9+.]/g,'')" @change="validateNum"></el-input>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="op" width="80px"  >
                <template #default="scope">
                  <el-popconfirm title="是否确定删除该条数据?"  @confirm="delNewStepRule(index, scope)" >
                    <template #reference>
                      <el-button  label="删除" type="danger" prop="delete" size="small">删除</el-button>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
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
          rowIdKey: 0,
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
      use_fields: [],
      steps_table_data: [],
      error_data: {},
      saveDisability:false
    }
  },
  mounted() {
    postRequest("/restful/monitor/config/stoprules/getCanUseParams", {}).then(response => {
      this.use_fields = response.data;
    });
  },
  watch: {
    "layer.rowIdKey"(newValue, oldValue) {
      if(newValue) {
        this.steps_table_data = [];
        postRequest("/restful/monitor/config/stoprules/stepsData", {
          id: newValue
        }).then(response => {
          this.steps_table_data = response.data;
        });
      }
    }
  },
  methods: {
    // 新增一步
    addNewStep() {
      this.steps_table_data.push([]);
    },
    /**
     * 删除规则
     * @param index
     */
    delStep(index) {
      this.steps_table_data.splice(index, 1);
    },
    // 新增一步里面的规则
    addNewStepRule(index) {
      this.steps_table_data[index].push({
        field: "",
        fieldType: 1,
        params: [],
        andOr: 1
      });
    },
    delNewStepRule(index, scope) {
      this.steps_table_data[index].splice(scope.$index, 1);
    },
    submitStep() {
      postRequest("/restful/monitor/config/stoprules/stepsSave", {
        data: JSON.stringify(this.steps_table_data),
        id: this.layer.rowIdKey
      }).then(response => {
        ElMessage.success("提交成功");
      });
    },
    validateNum(value){
      if (value.toString().indexOf(".") == 0) {
        ElMessage.error("输入值必须合法数字");
        this.saveDisability = true;
        return
      }
      if (value.toString().split(".").length > 2) {
        ElMessage.error('输入值必须合法数字');
        this.saveDisability = true;
        return
      }
      if (this.saveDisability){
        this.saveDisability = false;
      }
    }
  }
}
</script>