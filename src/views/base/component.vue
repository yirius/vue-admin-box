<template>
  <div class="box">
    <ViewBasePage ref="viewBasePageRef" :render-value="renderValue" :model-value="modelValue"
                  :form-value="formValue" :model-refs-value="modelRefsValue" :use-id-key="useIdKey"></ViewBasePage>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, unref, onMounted, onUpdated, watch, nextTick } from 'vue'
import { postRequest, getRequest } from "@/api/request";
import ViewBasePage from '@/views/base/page.vue';
import * as VueRouter from "vue-router";
import { useStore } from 'vuex';

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
    const $store = useStore();
    const router = VueRouter.useRouter();
    // 先判断是否存在props，不存在说明是路由进来的，直接去找
    let jsonPageUrl = props.renderUrl;
    if(!jsonPageUrl) {
      jsonPageUrl = router.currentRoute.value.meta.component || router.currentRoute.value.matched[router.currentRoute.value.matched.length-1].meta.component;
    }

    // 保存对应的ref响应变量
    let modelRefsValue = {};
    // 其他输出值
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
      renderDataReady: ""
    });

    if(jsonPageUrl) {
      getRequest(jsonPageUrl).then(data => {
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
        renderValue.renderDataReady = data.data.renderDataReady || "";

        if(props.afterRender && typeof props.afterRender == "function") {
          props.afterRender({modelRefsValue, modelValue, formValue, renderValue, viewBasePageRef});
        }

        // 执行一下渲染逻辑
        nextTick(() => {
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
        return viewBasePageRef.value.findRefs(fieldName);
      }
    });

    return {
      formValue,
      modelValue,
      renderValue,
      modelRefsValue,
      viewBasePageRef
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
}
</style>