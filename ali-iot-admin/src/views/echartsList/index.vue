<template>
  <div class="echartsList">
    <echart v-for="(value,item) in shouldShow" :id="item" :key="item"></echart>
  </div>
</template>

<script>
import echart from './echart'
export default {
  computed: {
    shouldShow() {
      return this.$store.state.shouldShow;
    },
  },
  components: {
    'echart': echart
  }
};
</script>

<style scoped>
.echartsList {
  box-sizing: border-box;
  width: 330px;
  background: rgb(238, 241, 246);
  top: 0;
  overflow: auto;
}
</style>
