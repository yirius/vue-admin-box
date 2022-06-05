<template>
</template>

<script>
import { defineComponent, reactive, ref, onActivated, onMounted, h, resolveDynamicComponent } from 'vue';
import * as AdminIs from "@/utils/is";

export default defineComponent({
  name: "inputRange",
  props: {
    name: {
      type: String,
      require: true
    },
    rangeKey: {
      type: String,
      default: "-",
      require: false
    },
    startRender: {
      type: Object,
      default: () => {
        return {
          component: "ElInput",
          attrs: {}
        }
      },
      require: false
    },
    endRender: {
      type: Object,
      default: () => {
        return {
          component: "ElInput",
          attrs: {}
        }
      },
      require: false
    },
    propsData: {
      type: Object,
      require: true
    }
  },
  setup(props, vm) {
    if(props.propsData) {
      if(typeof props.propsData.modelRefsValue[props.name] != "undefined") {
        delete props.propsData.modelRefsValue[props.name];
        delete props.propsData.formValue[props.name];
      }
      if(typeof props.propsData.modelRefsValue[props.name+"_start"] == "undefined") {
        props.propsData.modelRefsValue[props.name+"_start"] = ref("");
        props.propsData.formValue[props.name+"_start"] = props.propsData.modelRefsValue[props.name+"_start"];
      }
      if(typeof props.propsData.modelRefsValue[props.name+"_end"] == "undefined") {
        props.propsData.modelRefsValue[props.name+"_end"] = ref("");
        props.propsData.formValue[props.name+"_end"] = props.propsData.modelRefsValue[props.name+"_end"];
      }
    }

    // 判断一下是否存在参数
    let startComponent = "ElInput", endComponent = "ElInput", startAttrs = {}, endAttrs = {};
    startComponent = props.startRender.component||"ElInput";
    startAttrs = props.startRender.attrs||{};
    endComponent = props.endRender.component||"ElInput";
    endAttrs = props.endRender.attrs||{};

    startAttrs.modelValue = props.propsData.modelRefsValue[props.name+"_start"];
    startAttrs["onUpdate:modelValue"] = (value) => { props.propsData.modelRefsValue[props.name+"_start"].value = value; };
    delete startAttrs.id;

    endAttrs.modelValue = props.propsData.modelRefsValue[props.name+"_end"];
    endAttrs["onUpdate:modelValue"] = (value) => { props.propsData.modelRefsValue[props.name+"_end"].value = value; };
    delete endAttrs.id;

    return () => {
      return h(resolveDynamicComponent("ElRow"), {style: "width: 100%", align: "middle", justify: "center"}, {
        default: (slotData) => [
          h(resolveDynamicComponent("ElCol"), {span: 11}, {
            default: (slotData) => h(resolveDynamicComponent(startComponent), startAttrs, null)
          }),
          h(resolveDynamicComponent("ElCol"), {span: 2, align: "middle", justify: "center"}, {
            default: (slotData) => [props.rangeKey||"-"]
          }),
          h(resolveDynamicComponent("ElCol"), {span: 11}, {
            default: (slotData) => h(resolveDynamicComponent(endComponent), endAttrs, null)
          })
        ]
      })
    };
  },
})
</script>

<style scoped>

</style>