<template>
  <div class="box">
    <ViewBasePage :render-value="renderValue" :model-value="modelValue"></ViewBasePage>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, unref } from 'vue'
import ViewBasePage from '@/views/base/page.vue'

export default defineComponent({
  components: {
    ViewBasePage
  },
  setup(props, vm) {
    // 保存对应的ref响应变量
    let modelRefsValue = {};
    // 其他输出值
    const modelValue = reactive({});

    const renderValue = reactive({
      render: {
        component: "div",
        children: []
      }
    });

    const response = async () => {
      return await new Promise(resolve => {
        setTimeout(() => {
          var responseData = {
            rightName: "123",
            testName: "aaa",
            selectValue: 1,
            selectValueOther: "",
            cascaderValue: 3,
            cascaderOptions: [
                {value: 1, label: 'TEST1', children: [{value: 2, label: 'TEST2', children: [{value: 3, label: 'TEST3'}]}]},
                {value: 4, label: 'TEST4', children: [{value: 5, label: 'TEST5', children: [{value: 6, label: 'TEST6'}]}]}
            ],
            checkboxValue: [],
            datePickerValue: "",
            transferValue: [],
            transferData: [{label: "测试", key: 1}, {label: "测试2", key: 2}],
            uploadValue: [],
            tinymceValue: ""
          }
          for (var i in responseData) {
            modelRefsValue[i] = ref(responseData[i]);
            modelValue[i] = modelRefsValue[i];
          }

          renderValue.render = {
            component: "ElRow",
            children: [{
              component: "ElCol",
              attrs: {
                span: 12,
                onClick: () => {
                  if (modelValue.rightName === "123") {
                    modelValue.rightName = "456";
                  } else {
                    modelValue.rightName = "123";
                  }
                }
              },
              children: [{
                component: "ElForm",
                attrs: {
                  modelValue: modelValue
                },
                children: [{
                  component: "ElFormItem",
                  attrs: {
                    label: "测试输入"
                  },
                  children: [{
                    component: "ElInput",
                    attrs: {
                      modelValue: modelRefsValue['testName'],
                      'onUpdate:modelValue': value => {
                        modelRefsValue['testName'].value = value;
                        vm.emit('update:modelValue', value);
                      }
                    },
                  }]
                }, {
                  component: "ElFormItem",
                  attrs: {
                    label: "测试下拉"
                  },
                  children: [{
                    component: "ElSelect",
                    attrs: {
                      modelValue: modelRefsValue['selectValue'],
                      'onUpdate:modelValue': value => {
                        vm.emit('update:modelValue', value);
                        modelRefsValue['selectValue'].value = value;
                      },
                      onChange: (value, vm) => {
                        modelRefsValue['selectValueOther'].value = "";
                        if(value == 2) {
                          renderValue.render.children[0].children[0].children[2].children[0].children = [{
                            component: "ElOption",
                            attrs: {
                              label: "A测试",
                              value: "a"
                            }
                          }, {
                            component: "ElOption",
                            attrs: {
                              label: "A测试2",
                              value: "b"
                            }
                          }];
                        } else {
                          renderValue.render.children[0].children[0].children[2].children[0].children = [];
                        }
                      }
                    },
                    children: [{
                      component: "ElOption",
                      attrs: {
                        label: "测试",
                        value: 1
                      }
                    }, {
                      component: "ElOption",
                      attrs: {
                        label: "测试2",
                        value: 2
                      }
                    }]
                  }]
                }, {
                  component: "ElFormItem",
                  attrs: {
                    label: "测试下拉2"
                  },
                  children: [{
                    component: "ElSelect",
                    attrs: {
                      modelValue: modelRefsValue['selectValueOther'],
                      'onUpdate:modelValue': value => {
                        vm.emit('update:modelValue', value);
                        modelRefsValue['selectValueOther'].value = value;
                      },
                      onChange(value) {
                        console.log(value)
                      }
                    }
                  }]
                }, {
                  component: "ElFormItem",
                  attrs: {
                    label: "测试连接菜单"
                  },
                  children: [{
                    component: "ElCascader",
                    attrs: {
                      ":options": "return props.modelValue.cascaderOptions;",
                      modelValue: modelRefsValue['cascaderValue'],
                      'onUpdate:modelValue': value => {
                        vm.emit('update:modelValue', value);
                        modelRefsValue['cascaderValue'].value = value;
                      },
                      onChange(value) {
                        console.log(value)
                      }
                    }
                  }]
                }, {
                  component: "ElFormItem",
                  attrs: {
                    label: "测试CheckBox"
                  },
                  children: [{
                    component: "ElCheckboxGroup",
                    attrs: {
                      modelValue: modelRefsValue['checkboxValue'],
                      'onUpdate:modelValue': value => {
                        vm.emit('update:modelValue', value);
                        modelRefsValue['checkboxValue'].value = value;
                      },
                      onChange(value) {
                        console.log(value)
                      }
                    },
                    children: [{
                      component: "ElCheckbox",
                      attrs: {
                        label: "男"
                      }
                    }, {
                      component: "ElCheckbox",
                      attrs: {
                        label: "女",
                        "true-label": 2
                      }
                    }]
                  }]
                }, {
                  component: "ElFormItem",
                  attrs: {
                    label: "测试Date"
                  },
                  children: [{
                    component: "ElDatePicker",
                    attrs: {
                      modelValue: modelRefsValue['datePickerValue'],
                      type: "daterange",
                      "value-format": "YYYY-MM-DD HH:mm:ss",
                      'onUpdate:modelValue': value => {
                        vm.emit('update:modelValue', value);
                        modelRefsValue['datePickerValue'].value = value;
                      },
                      onChange(value) {
                        console.log(value)
                      }
                    }
                  }]
                }]
              }]
            }, {
              component: "ElCol",
              attrs: {
                span: 12,
                ":class": "return props.modelValue.testName == \"bbb\"?\"bg-red\":\"\";",
                onClick: () => {
                  console.log(JSON.stringify(modelValue));
                }
              },
              children: ["`${rightName}`"]
            }, {
              component: "ElCol",
              attrs: {
                span: 24
              },
              children: [{
                component: "ElFormItem",
                attrs: {
                  label: "测试Transfer"
                },
                children: [{
                  component: "ElTransfer",
                  attrs: {
                    ":data": "return props.modelValue.transferData;",
                    modelValue: modelRefsValue['transferValue'],
                    'onUpdate:modelValue': value => {
                      vm.emit('update:modelValue', value);
                      modelRefsValue['transferValue'].value = value;
                    },
                    onChange(value) {
                      console.log(value)
                    }
                  }
                }]
              }, {
                component: "ElFormItem",
                attrs: {
                  label: "测试Upload"
                },
                children: [{
                  component: "ElUpload",
                  attrs: {
                    "list-type": "picture-card",
                    modelValue: modelRefsValue['uploadValue'],
                    'onUpdate:modelValue': value => {
                      vm.emit('update:modelValue', value);
                      modelRefsValue['uploadValue'].value = value;
                    },
                    onChange(value) {
                      console.log(value)
                    }
                  },
                  children: [{
                    component: "ElIcon",
                    attrs: {},
                    children: [{
                      component: "Plus",
                      attrs: {},
                    }]
                  }]
                }]
              }, {
                component: "ElFormItem",
                attrs: {
                  label: "测试Tinymce"
                },
                children: [{
                  component: "Tinymce",
                  attrs: {
                    modelValue: modelRefsValue['tinymceValue'],
                    'onUpdate:modelValue': value => {
                      vm.emit('update:modelValue', value);
                      modelRefsValue['tinymceValue'].value = value;
                    },
                    onChange(value) {
                      console.log(value)
                    }
                  }
                }]
              }, {
                component: "vxeTableBox",
                attrs: {},
              }]
            }]
          };
          resolve({code: 1, data: {}, msg: "success"})
        }, 300);
      })
    };

    console.log(response());

    const optiona = reactive("Option1");
    const optionb = ref("Option1");

    return {
      optiona, optionb,
      modelValue,
      renderValue
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