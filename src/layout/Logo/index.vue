<template>
  <div class="logo-container">
    <img v-if="logoData.logoShow" :src="calcLogoSrc" alt="" style="height: 40px">
    <h1 v-if="logoData.logoTextShow&&!isCollapse">{{ $t(systemTitle) }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { systemTitle } from '@/config'
import logoData from '@/config'
import Block from "../../../dist/views/main/pages/work/block.vue";
import logoSrc from "@/assets/logo.png";


export default defineComponent({
  components: {Block},
  setup() {
    const store = useStore()
    const isCollapse = computed(() => store.state.app.isCollapse)
    const calcLogoSrc = computed(() => {
      if(isCollapse.value && logoData.logoSmUrl) {
        return logoData.logoSmUrl;
      }
      return logoData.logoUrl || logoSrc;
    });

    return {
      isCollapse,
      systemTitle,
      logoData,
      logoSrc,
      calcLogoSrc
    }
  }
})
</script>

<style lang="scss" scoped>
  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: var(--system-logo-background);
    h1 {
      font-size: 18px;
      white-space: nowrap;
      color: var(--system-logo-color);
    }
  }
</style>