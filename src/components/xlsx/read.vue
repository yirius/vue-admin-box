<!--<template>-->
<!--  <XlsxLayer :layer="layer">-->
<!--    <div class="layout-container">-->
<!--      <div class="layout-container-form flex space-between">-->
<!--        <div class="layout-container-form-handle">-->
<!--          <input type="file" style="display: none" ref="hidden_input_file" @change="on_selected_xlsx"/>-->
<!--          <el-button icon="Upload" type="primary" @click="select_xlsx_file">选择EXCEL</el-button>-->
<!--          <el-button icon="Finished" type="success" @click="submit_list">提交列表</el-button>-->
<!--          <el-button icon="Download" type="info" @click="download_template">下载模板</el-button>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="layout-container-table">-->
<!--        <el-table ref="xlsx_table" :data="xlsx_table_data"-->
<!--                  :stripe="true" :defaultExpandAll="true"-->
<!--                  pageLayout="total,sizes,prev,pager,next,jumper"-->
<!--                  :pageSizes="[100,500,1000]" :highlightCurrentRow="true"-->
<!--                  :showSelection="true" rowKey="_thinker_index"-->
<!--                  @selection-change="xlsx_table_selectedChange"-->
<!--                  @cell-dblclick="cellDbClick">-->
<!--          <el-table-column :label="item.label" :prop="item.prop" :min-width="item.minWidth||''" :width="item.width||''"-->
<!--                           v-for="(item, index) in layer.columns||[]" :key="index">-->
<!--            <template #default="scope">-->
<!--              <span style="cursor: pointer" v-if="!scope.row._showInput">{{scope.row[scope.column.property]||''}}</span>-->
<!--              <el-input v-else v-model="scope.row[scope.column.property]">-->
<!--                <template #append>-->
<!--                  <el-button icon="Check" type="success" @click="scope.row._showInput=false"></el-button>-->
<!--                </template>-->
<!--              </el-input>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="异常提示" prop="_errmsg" v-if="layer.isShowErr"></el-table-column>-->
<!--        </el-table>-->
<!--      </div>-->
<!--    </div>-->
<!--  </XlsxLayer>-->
<!--</template>-->
<!--<script>-->
<!--import xlsx, { jsonToSheetXlsx } from './index';-->
<!--import XlsxLayer from "@/components/layer/index.vue"-->
<!--import { uploadHttpRequestApi } from "../upload/index";-->
<!--import { postRequest } from "@/api/request";-->
<!--import { deepClone } from "@/utils/tools/objects";-->
<!--import { ElMessage } from "element-plus";-->

<!--export default {-->
<!--  components: { XlsxLayer },-->
<!--  props: {-->
<!--    layer: {-->
<!--      type: Object,-->
<!--      default: () => {-->
<!--        return {-->
<!--          show: false,-->
<!--          title: '',-->
<!--          showButton: false,-->
<!--          // 列表内容-->
<!--          columns: [{label: "", prop: ""}],-->
<!--          // 最终结果提交地址-->
<!--          postUrl: "",-->
<!--          // 本地数据的渲染-->
<!--          eachData: (data) => {},-->
<!--          // 是否服务端解析-->
<!--          isServer: false,-->
<!--          // 是否上传内容-->
<!--          isUpload: false,-->
<!--          uploadUrl: null,-->
<!--          // 是否存在异常提示列-->
<!--          isShowErr: false-->
<!--        }-->
<!--      },-->
<!--      required: true-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      xlsx_table_data: [],-->
<!--      error_data: {}-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    xlsx_table_selectedChange() {-->

<!--    },-->
<!--    // 下载模板-->
<!--    download_template() {-->
<!--      var columns = this.layer.columns || [], labelKeyList = {};-->
<!--      columns.forEach(item => {-->
<!--        if(item.prop != "id") {-->
<!--          labelKeyList[item.prop] = item.label;-->
<!--        }-->
<!--      })-->

<!--      jsonToSheetXlsx({-->
<!--        data: [],-->
<!--        header: labelKeyList,-->
<!--        filename: "导入模板.xlsx"-->
<!--      });-->
<!--    },-->
<!--    // 触发input=file的选择-->
<!--    select_xlsx_file() {-->
<!--      this.$refs.hidden_input_file.click()-->
<!--    },-->
<!--    // 选择文件之后，需要读取内容-->
<!--    on_selected_xlsx() {-->
<!--      if(this.$refs.hidden_input_file.files.length > 0) {-->
<!--        this.error_data = {};-->
<!--        // 如果是服务端进行数据解析且数据量过大需要上传-->
<!--        if(this.layer.isServer && this.layer.isUpload) {-->
<!--          uploadHttpRequestApi({-->
<!--            action: this.layer.uploadUrl,-->
<!--            filename: "file",-->
<!--            file: this.$refs.hidden_input_file.files[0],-->
<!--            data: {},-->
<!--            method: "POST",-->
<!--            headers: {}-->
<!--          }).then(response => {-->
<!--            this.xlsx_table_data = response.data;-->
<!--            this.xlsx_table_data.forEach(item => {-->
<!--              item._showInput = false;-->
<!--            });-->
<!--          });-->
<!--        } else {-->
<!--          var reader = new FileReader();-->
<!--          reader.readAsBinaryString(this.$refs.hidden_input_file.files[0]);-->
<!--          reader.onload = (evt) => {-->
<!--            var workbook = xlsx.read(evt.target.result, {type: 'binary', cellDates: true});-->
<!--            var sheetKeyForTables = {};-->
<!--            workbook.SheetNames.forEach(item => {-->
<!--              sheetKeyForTables[item] = xlsx.utils.sheet_to_json(workbook.Sheets[item]);-->
<!--            });-->
<!--            // 否则直接文字后台解析-->
<!--            if(this.layer.isServer) {-->
<!--              postRequest(this.layer.uploadUrl, {-->
<!--                data: JSON.stringify(sheetKeyForTables)-->
<!--              }).then(response => {-->
<!--                this.xlsx_table_data = response.data;-->
<!--                this.xlsx_table_data.forEach(item => {-->
<!--                  item._showInput = false;-->
<!--                });-->
<!--              });-->
<!--            } else {-->
<!--              // 正常流程-->
<!--              var columns = this.layer.columns || [], labelKeyAndPropValue = {};-->
<!--              columns.forEach(item => {-->
<!--                labelKeyAndPropValue[item.label] = item.prop;-->
<!--              })-->

<!--              var resultData = this.layer.eachData(sheetKeyForTables, workbook);-->
<!--              // 如果没写填充模式，那就是用文字对应-->
<!--              if(!resultData) {-->
<!--                resultData = sheetKeyForTables[workbook.SheetNames[0]];-->
<!--                // 将列内容填充-->
<!--                var newDataList = [];-->
<!--                resultData.forEach(item => {-->
<!--                  var newData = {};-->
<!--                  for(var i in labelKeyAndPropValue) {-->
<!--                    newData[labelKeyAndPropValue[i]] = item[i] || "";-->
<!--                  }-->
<!--                  newDataList.push(newData);-->
<!--                });-->
<!--                resultData = newDataList;-->
<!--              }-->

<!--              if(resultData) {-->
<!--                var count = 1;-->
<!--                resultData.forEach(item => {-->
<!--                  item.id = count;-->
<!--                  item._showInput = false;-->
<!--                });-->
<!--                this.xlsx_table_data = resultData;-->
<!--              }-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--        this.$refs.hidden_input_file.value = null;-->
<!--      }-->
<!--    },-->
<!--    // 列表提交-->
<!--    submit_list() {-->
<!--      if(this.xlsx_table_data.length > 0) {-->
<!--        postRequest(this.layer.postUrl, {-->
<!--          data: JSON.stringify(this.xlsx_table_data)-->
<!--        }).then(response => {-->
<!--          this.layer.show = false;-->
<!--        }).catch(response => {-->
<!--          if(response.data.data) {-->
<!--            this.error_data = response.data.data;-->
<!--            for(var indexName in this.error_data) {-->
<!--              var errIndex = parseInt(indexName.replace("index", ""))-1;-->
<!--              if(this.xlsx_table_data[errIndex]) {-->
<!--                this.xlsx_table_data[errIndex]._errmsg = this.error_data[indexName];-->
<!--              }-->
<!--            }-->
<!--          }-->
<!--        });-->
<!--      } else {-->
<!--        ElMessage.info("暂无可提交内容")-->
<!--      }-->
<!--    },-->
<!--    // 双击事件绑定-->
<!--    cellDbClick(row, column, cell, event) {-->
<!--      row._showInput = true;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->