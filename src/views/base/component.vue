<template>
  <div class="box">
    <suspense>
      <ViewBasePage ref="viewBasePageRef" :render-value="renderValue" :model-value="modelValue"
                    :form-value="formValue" :model-refs-value="modelRefsValue" :use-id-key="useIdKey" v-if="reshowPage" @refsReady="refsReady"></ViewBasePage>
    </suspense>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, unref, onMounted, onUpdated, watch, nextTick } from 'vue'
import ViewBasePage from '@/views/base/page.vue';

import * as _Vue from 'vue'
import { useStore } from 'vuex'
import * as _VueRouter from "vue-router";
import eventBus from '@/utils/admin/eventBus';
import { VXETable as _VXETable } from 'vxe-table'
import _XEUtils from 'xe-utils'
import * as _AdminIs from '@/utils/is';
import * as _AdminTool from '@/utils/tools';
import * as _RequestApi from "@/api/request";
import * as _elementPlus from 'element-plus';
import { uploadHttpRequestApi as _uploadHttpRequestApi } from "@/components/upload/index";

export default defineComponent({
  props: {
    renderUrl: {
      type: String,
      default: "",
      require: false
    },
    afterRender: {
      type: Function,
      default: null,
      require: false
    },
    useIdKey: {
      type: Number,
      default: null,
      require: false
    }
  },
  components: {
    ViewBasePage
  },
  setup(props, vm) {
    const _$store = useStore(), _router = _VueRouter.useRouter();
    window.getOpArgs = () => {
      return {Vue: _Vue, VueRouter: _VueRouter, VXETable: _VXETable, XEUtils: _XEUtils,
        AdminIs: _AdminIs, AdminTool: _AdminTool, RequestApi: _RequestApi, elementPlus: _elementPlus,
        uploadHttpRequestApi: _uploadHttpRequestApi, $store: _$store, router: _router};
    };

    // 先判断是否存在props，不存在说明是路由进来的，直接去找
    let jsonPageUrl = props.renderUrl;
    if(!jsonPageUrl) {
      jsonPageUrl = _router.currentRoute.value.meta.component || _router.currentRoute.value.matched[_router.currentRoute.value.matched.length-1].meta.component;
    }

    // 保存对应的ref响应变量
    let modelRefsValue = {};
    // 其他输出值
    const reshowPage = ref(true);
    const modelValue = reactive({});
    const formValue = reactive({});
    const viewBasePageRef = ref(null);

    const renderValue = reactive({
      render: {
        component: "div",
        children: [],
        attrs: {},
        slots: {}
      },
      renderReady: "",
      getDataBefore: "",
      renderDataReady: "",
      components: []
    });

    if(jsonPageUrl) {
      // 做一下内容的重新渲染
      reshowPage.value = false;

      _RequestApi.getRequest(jsonPageUrl).then(data => {
        for (var i in data.data.modelValue) {
          modelRefsValue[i] = ref(data.data.modelValue[i]);
          modelValue[i] = modelRefsValue[i];
        }
        for (i in data.data.formValue) {
          modelRefsValue[i] = ref(data.data.formValue[i]);
          formValue[i] = modelRefsValue[i];
        }
        renderValue.render = data.data.render;
        renderValue.renderReady = data.data.renderReady || "";
        renderValue.getDataBefore = data.data.getDataBefore || "";
        renderValue.renderDataReady = data.data.renderDataReady || "";
        renderValue.components = data.data.components || [];

        // 进行内容if重渲染
        reshowPage.value = true;

        // 执行一下渲染逻辑
        nextTick(() => {
          if(props.afterRender && typeof props.afterRender == "function") {
            props.afterRender({modelRefsValue, modelValue, formValue, renderValue, viewBasePageRef});
          }

          if(renderValue.renderReady) {
            eval(renderValue.renderReady);
          }
        });
      });
    } else {
      throw "界面暂无对应JSON请求地址";
    }

    // 监听afterRender修改
    watch(() => props.afterRender, () => {
      if(props.afterRender && typeof props.afterRender == "function") {
        props.afterRender({modelRefsValue, modelValue, formValue, renderValue, viewBasePageRef});
      }
      if(renderValue.renderReady) {
        eval(renderValue.renderReady);
      }
    });

    // 设置返回参数
    vm.expose({
      findValue() {
        return {
          modelRefsValue,
          modelValue,
          formValue,
          renderValue
        };
      },
      findRefs(fieldName) {
        if(viewBasePageRef.value) {
          return viewBasePageRef.value.$.exposed.findRefs(fieldName);
        }
        return null;
      }
    });

    return {
      reshowPage,
      formValue,
      modelValue,
      renderValue,
      modelRefsValue,
      viewBasePageRef,
      // refs触发
      refsReady: () => {
        vm.emit("refsReady");
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {

  },
})
</script>

<style scoped>
.box {
  padding: 15px;
  height: calc(100% - 30px);
}
</style>