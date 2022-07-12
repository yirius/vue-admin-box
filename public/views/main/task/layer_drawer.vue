<template>
  <div>
    <el-drawer
        v-model="layer.show"
        :title="layer.title"
        size="70%"
        :lock-scroll=false
    >
      <slot></slot>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref} from 'vue'
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