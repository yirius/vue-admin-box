<template>
  <div class="system-table-box bg-white">
    <vxe-grid ref='vxeGrid' v-bind="gridOptions" v-on="gridEvents"></vxe-grid>
  </div>
</template>

<script>

import { defineComponent, onMounted, reactive, ref, computed } from 'vue'

import LayerComponent from '@/components/layer/index.vue';
import * as PageRender from '@/utils/admin/pageRender';

import * as _Vue from 'vue'
import { useStore } from 'vuex'
import * as _VueRouter from "vue-router";
import { VXETable as _VXETable } from 'vxe-table'
import _XEUtils from 'xe-utils'
import * as _AdminIs from '@/utils/is';
import * as _AdminTool from '@/utils/tools';
import * as _RequestApi from "@/api/request";
import * as _elementPlus from 'element-plus';
import { uploadHttpRequestApi as _uploadHttpRequestApi } from "@/components/upload/index";

export default _Vue.defineComponent({
  props: {
    events: {
      type: Object,
      require: true
    },
    tableConfig: {
      type: Object,
      require: true
    },
    columns: {
      type: Array,
      require: true
    },
    modelRefsValue: {
      type: Object,
      require: true,
      default: {}
    },
    useIdKey: {
      type: Number,
      default: null,
      require: false
    }
  },
  setup (props, vm) {
    if(!_VXETable.renderer.get("ThinkerInputRange")) {
      _VXETable.renderer.add("ThinkerInputRange", {
        renderItemContent(renderOpts, params) {
          delete params.data[params.property];
          if(typeof params.data[params.property+"_start"] == "undefined") {
            params.data[params.property+"_start"] = null;
          }
          if(typeof params.data[params.property+"_end"] == "undefined") {
            params.data[params.property + "_end"] = null;
          }
          // 判断一下是否存在参数
          let startComponent = "ElInput", endComponent = "ElInput", startAttrs = {}, endAttrs = {};
          if(renderOpts.props&&renderOpts.props.startRender) {
            startComponent = renderOpts.props.startRender.component||"ElInput";
            startAttrs = renderOpts.props.startRender.attrs||{};
          }
          if(renderOpts.props&&renderOpts.props.endRender) {
            endComponent = renderOpts.props.endRender.component||"ElInput";
            endAttrs = renderOpts.props.endRender.attrs||{};
          }
          startAttrs.modelValue = params.data[params.property+"_start"];
          startAttrs["onUpdate:modelValue"] = (value) => { params.data[params.property+"_start"] = value; };
          delete startAttrs.id;
          endAttrs.modelValue = params.data[params.property+"_end"];
          endAttrs["onUpdate:modelValue"] = (value) => { params.data[params.property+"_end"] = value; };
          delete endAttrs.id;

          return _Vue.h(_Vue.resolveDynamicComponent("ElRow"), {style: "width: 100%", align: "middle", justify: "center"}, {
            default: (slotData) => [
              _Vue.h(_Vue.resolveDynamicComponent("ElCol"), {span: 11}, {
                default: (slotData) => _Vue.h(_Vue.resolveDynamicComponent(startComponent), startAttrs, null)
              }),
              _Vue.h(_Vue.resolveDynamicComponent("ElCol"), {span: 2, align: "middle", justify: "center"}, {
                default: (slotData) => [renderOpts.props.rangeKey||"-"]
              }),
              _Vue.h(_Vue.resolveDynamicComponent("ElCol"), {span: 11}, {
                default: (slotData) => _Vue.h(_Vue.resolveDynamicComponent(endComponent), endAttrs, null)
              })
            ]
          });
        }
      });
    }

    const _$store = useStore(), _router = _VueRouter.useRouter();
    const varArgs = {Vue: _Vue, VueRouter: _VueRouter, VXETable: _VXETable, XEUtils: _XEUtils,
      AdminIs: _AdminIs, AdminTool: _AdminTool, RequestApi: _RequestApi, elementPlus: _elementPlus,
      uploadHttpRequestApi: _uploadHttpRequestApi, $store: _$store, router: _router};

    const renderTemplate = (slotData, childrens) => {
      var childrenArray = [];
      if(childrens&&_AdminIs.isArray(childrens)) {
        childrens.forEach(item => {
          if(typeof item != "object") {
            childrenArray = [...childrenArray, ...PageRender.regexpMatchAndReplace("\`\\$\{.*?\}\`", item, {})];
          } else {
            if (item.component === "html") {
              childrenArray = [...childrenArray, ...PageRender.regexpMatchAndReplace("\`\\$\{.*?\}\`", item.extInfo.html || "", {})];
            } else {
              let slotRender = item.slots || {};
              for (let slotRenderKey in slotRender) {
                if(typeof slotRender[slotRenderKey] != "function") {
                  ((useChildren, data, dataKey) => {
                    data[dataKey] = (slotData) => renderTemplate(slotData, useChildren);
                  })(slotRender[slotRenderKey], slotRender, slotRenderKey)
                }
              }
              if(!slotRender.default && item.children.length) {
                ((useChildren, data) => {
                  data.default = (slotData) => renderTemplate(slotData, useChildren);
                })(item.children, slotRender)
              }

              let attrValues = _AdminTool.objects.deepClone(item.attrs);
              // 组装children
              for (let attrsKey in attrValues) {
                if(_AdminIs.isString(attrValues[attrsKey]) && attrValues[attrsKey].startsWith("[`eval`]")) {
                  attrValues[attrsKey] = eval(attrValues[attrsKey].replace("[`eval`]", ""));
                }
              }
              childrenArray.push(_Vue.h(_Vue.resolveDynamicComponent(item.component), attrValues, slotRender));
            }
          }
        });
      }
      return childrenArray;
    }

    const evalStringFunction = (obj) => {
      if(_AdminIs.isArray(obj)) {
        obj.forEach(item => evalStringFunction(item));
      } else if(_AdminIs.isObject(obj)) {
        for (const objKey in obj) {
          if(objKey.startsWith("#")) {
            // 如果是tpl类型，说明是参数要求
            ((childrens, data, dataKey) => {
              data[dataKey.replace("#", "")] = (slotData) => renderTemplate(slotData, _Vue.toRaw(childrens));
            })(obj[objKey], obj, objKey);
            delete obj[objKey];
          } else {
            // 否则按正常流程
            if(_AdminIs.isString(obj[objKey]) && obj[objKey].startsWith("[`eval`]")) {
              obj[objKey] = eval(obj[objKey].replace("[`eval`]", ""));
            } else if(_AdminIs.isArray(obj[objKey])) {
              obj[objKey].forEach((item) => evalStringFunction(item));
            } else if(_AdminIs.isObject(obj[objKey])) {
              evalStringFunction(obj[objKey]);
            }
          }
        }
      }
    }
    evalStringFunction(props);

    const vxeGrid = ref({});
    const gridEvents = reactive(props.events);
    const gridOptions = ref({
      ...props.tableConfig,
      columns: props.columns || []
    });

    if(window.innerWidth && window.innerWidth <= 768) {
      // 表单设置
      if(gridOptions.value.formConfig && gridOptions.value.formConfig.items) {
        gridOptions.value.formConfig.items.forEach((item, index) => {
          if(index > 1) {
            // 头两个依旧保留
            if(!item.collapseNode) {
              if(!item.folding) item.folding = true;
            }
          }
        });
      }
    }

    return {
      vxeGrid,
      gridOptions,
      gridEvents
    }
  }
})
</script>

<style scoped>
  .system-table-box {
    height: 100%;
  }
</style>