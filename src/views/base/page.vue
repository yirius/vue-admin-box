<template>
</template>

<script type="ts">
import * as Vue from 'vue';
import { useStore } from 'vuex';
import * as AdminIs from '@/utils/is';
import * as VueRouter from "vue-router";
import * as AdminTool from '@/utils/tools';
import * as RequestApi from '@/api/request';
import * as elementPlus from 'element-plus';
import Tinymce from "@/components/tinymce/index.vue";
import * as PageRender from '@/utils/admin/pageRender';
import { uploadHttpRequestApi } from "@/components/upload/index";

export default Vue.defineComponent({
  name: "page",
  props: {
    modelRefsValue: {
      type: Object,
      require: true,
      default: {}
    },
    modelValue: {
      type: Object,
      require: true,
      default: {}
    },
    formValue: {
      type: Object,
      require: true,
      default: {}
    },
    renderValue: {
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
  components: { Tinymce },
  /**
   * props渲染一下参数
   * @param props
   */
  setup(props, vm) {
    const $store = useStore();
    const router = VueRouter.useRouter();

    // 保存一下渲染完成的参数，方便找到相关内容
    let $refs = null;

    const fieldIdOperate = {
      fieldIdToIndex: {},
      findFieldUseId: function(id) {
        if(this.fieldIdToIndex[id]) {
          return this.fieldIdToIndex[id];
        } else {
          for(var i in this.fieldIdToIndex) {
            if(i.endsWith(id)) {
              return this.fieldIdToIndex[i];
            }
          }
        }
        return null;
      },
      findPropRenderUseIndex: (index, renderChildren) => {
        if(!index) return null;
        let indexArray = typeof index == "string" ? index.split("-") : index;
        if(!renderChildren) {
          renderChildren = props.renderValue.render.children;
          indexArray.splice(0, 1);
        }
        if(indexArray.length == 1) {
          return renderChildren[indexArray[0]];
        } else {
          const curIndex = indexArray[0];
          indexArray.splice(0, 1);
          return fieldIdOperate.findPropRenderUseIndex(indexArray, renderChildren[curIndex].children);
        }
      },
      find(id) {
        return this.findPropRenderUseIndex(this.findFieldUseId(id));
      }
    };

    const renderTemplate = (slotData, childrens, prevIndex) => {
      var childrenArray = [];
      if(childrens&&AdminIs.isArray(childrens)) {
        childrens.forEach((item, index) => {
          // 记录一下路径，方便查找
          if(item.attrs.id) {
            fieldIdOperate.fieldIdToIndex[item.attrs.id] = prevIndex + "-" + index;
            item.attrs.ref = item.attrs.id;
          }
          // 开始循环template
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
                    data[dataKey] = (() => {
                      return (slotData) => renderTemplate(slotData, useChildren, prevIndex + "-" + index)
                    })();
                  })(slotRender[slotRenderKey], slotRender, slotRenderKey)
                }
              }
              // 组装children
              for (let attrsKey in item.attrs) {
                if(AdminIs.isString(item.attrs[attrsKey]) && item.attrs[attrsKey].startsWith("[`eval`]")) {
                  item.attrs[attrsKey] = eval(item.attrs[attrsKey].replace("[`eval`]", ""));
                }
              }
              childrenArray.push(Vue.h(Vue.resolveDynamicComponent(item.component), item.attrs, {
                default: (slotData) => renderTemplate(slotData, item.children, prevIndex + "-" + index),
                ...slotRender,
              }));
            }
          }
        });
      }
      return childrenArray;
    }

    // 设置返回参数
    vm.expose({
      findValue() {
        return props;
      },
      findRender(id) {
        return fieldIdOperate.find(id);
      },
      findRefs(fieldName) {
        if(fieldName) {
          let findRefsKey = [];
          for (let $refsKey in $refs) {
            if($refsKey.endsWith(fieldName)) {
              findRefsKey.push($refs[$refsKey]);
            }
          }
          if(findRefsKey.length > 0) {
            return findRefsKey;
          }
        }
        return $refs;
      }
    });

    // 直接渲染
    return () => {
      for (let attrsKey in props.renderValue.render.attrs) {
        if(AdminIs.isString(props.renderValue.render.attrs[attrsKey]) && props.renderValue.render.attrs[attrsKey].startsWith("[`eval`]")) {
          props.renderValue.render.attrs[attrsKey] = eval(props.renderValue.render.attrs[attrsKey].replace("[`eval`]", ""));
        }
      }
      if(props.renderValue.render.attrs.id) {
        props.renderValue.render.attrs.ref = props.renderValue.render.attrs.id;
      }

      let slots = props.renderValue.render.slots || {};
      for (let slotRenderKey in slots) {
        if(typeof slots[slotRenderKey] != "function") {
          ((useChildren, data, dataKey) => {
            data[dataKey] = (slotData) => renderTemplate(slotData, useChildren, dataKey+"0");
          })(slots[slotRenderKey], slots, slotRenderKey)
        }
      }

      const renderedTemplate = Vue.h(
          Vue.resolveDynamicComponent(props.renderValue.render.component),
          props.renderValue.render.attrs,
          {
            default: (slotData) => renderTemplate(slotData, props.renderValue.render.children, "0"),
            ...slots,
          }
      );
      // 循环一下，变相找到refs参数，方便后续获取
      if(renderedTemplate.ref) {
        for (let refKey in renderedTemplate.ref) {
          if(AdminIs.isObject(renderedTemplate.ref[refKey]) && renderedTemplate.ref[refKey].uid) {
            $refs = renderedTemplate.ref[refKey].refs;
          }
        }
      }
      return renderedTemplate;
    }
  },
});
</script>

<style scoped>

</style>