<template>
  <div v-if="render">
    <el-drawer
        v-model="layer.show"
        :title="layer.title"
        ref="drawer"
        size="90%"
        :lock-scroll=false
    >
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus"

export default defineComponent({
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: false
        }
      },
      required: true
    }
  },
  data(){
    return{
      render:true
    }
  },
  methods:{
    handleClose(done) {
      this.$confirm('如果关闭，您的修改将被清空，确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    close(){
      console.log("close")
      this.$refs.drawer.handleClose()
    }
  }
})
</script>
<style>
.el-drawer__body {
  overflow: auto;
}
/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar{
  display: none;
}
</style>