<template>
</template>

<script type="ts">
import * as Vue from 'vue';
import * as PageRender from '@/utils/admin/pageRender';
import Tinymce from "@/components/tinymce/index.vue";
import vxeTableBox from "@/components/vxeTable/index.vue";

export default Vue.defineComponent({
  name: "page",
  props: {
    modelValue: {
      type: Object,
      require: true,
      default: {}
    },
    renderValue: {
      type: Object,
      require: true,
      default: {}
    }
  },
  components: { Tinymce, vxeTableBox },
  /**
   * props渲染一下参数
   * @param props
   */
  setup(props) {
    // 分析属性参数, 如
    let attrFunctions = {}, childrenCount = 1;
    const parserAttrs = (attrs) => {
      if(attrs) {
        // 保存一下参数
        if(attrs['childrenCount'] == null) {
          attrs['childrenCount'] = childrenCount;
          childrenCount++;
        }
        // 开始计算
        var useIndex = attrs['childrenCount'];
        for(const attrName in attrs) {
          const isCalcFunction = attrName.indexOf(":") == 0, trueAttrName = attrName.replace(":", "");
          if(isCalcFunction) {
            if(!attrFunctions[useIndex]) { attrFunctions[useIndex] = {}; }
            if(!attrFunctions[useIndex][trueAttrName]) {
              // 说明存在需要进行计算的东西，进行直接存储计算
              ((attrFunction) => {
                attrFunctions[useIndex][trueAttrName] = () => {
                  return eval("(function() { "+attrFunction+" })()");
                };
              })(attrs[attrName]);
            }
            // 删除需要计算的attr
            delete attrs[attrName];
          }
          // 如果本次或者下一次有对应的参数，直接运算
          if(attrFunctions[useIndex] && attrFunctions[useIndex][trueAttrName]) {
            // 存进去正式的参数
            attrs[trueAttrName] = attrFunctions[useIndex][trueAttrName]();
          }
        }
        return attrs;
      }
      return {};
    }

    // 计算所有的子组件
    const calcChildren = (children) => {
      var childrenArray = [];
      children.forEach(data => {
        if(typeof data != "object") {
          childrenArray = [...childrenArray, ...PageRender.regexpMatchAndReplace("\`\\$\{.*?\}\`", data, props.modelValue)];
        } else {
          if(data.attrs.label=="男") {
            console.log(Vue.h(Vue.resolveDynamicComponent(data.component), parserAttrs(data.attrs), {
              default: () => calcChildren(data.children||[])
            }));
          }
          childrenArray.push(
              Vue.h(Vue.resolveDynamicComponent(data.component), parserAttrs(data.attrs), data.children&&data.children.length>0?{
                default: () => calcChildren(data.children||[])
              }:null)
          );
        }
      });
      return childrenArray;
    }

    setTimeout(() => {
      console.log(props.renderValue);
    }, 1000)

    // 直接渲染
    return () => Vue.h(
        Vue.resolveDynamicComponent(props.renderValue.render.component),
        parserAttrs(props.renderValue.render.attrs),
        {
          default: () => calcChildren(props.renderValue.render.children)
        }
    )
    // return () => Vue.h(Vue.resolveDynamicComponent("ElCheckboxGroup"), {}, {
    //   default: () => [
    //     Vue.h(Vue.resolveDynamicComponent("ElCheckbox"), {label: '男'})
    //   ]
    // })
  },
});
</script>

<style scoped>

</style>