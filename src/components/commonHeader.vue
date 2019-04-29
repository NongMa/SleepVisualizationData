<template>
  <div class="header">
    <el-menu
      :default-active="$route.path ==''? '1' : $route.path"
      :router="true"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="rgb(9,23,29)"
      active-background-color="rgb(9,23,29)"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-menu-item class="el-menu-item" index="/">
        <i class="el-icon-view"></i>
        <span slot="title">Overview Data</span>
      </el-menu-item>
      <el-menu-item class="el-menu-item" index="/sleepDiary">
        <i class="el-icon-alishuju"></i>
        <span slot="title">Sleep Diary</span>
      </el-menu-item>
      <el-menu-item class="el-menu-item" index="/insights">
        <i class="el-icon-aliaddatrend"></i>
        <span slot="title">Insights</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "common-header",
  data() {
    return {
      activeIndex: "0"
    };
  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  .el-menu--horizontal > .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .el-menu--horizontal > .el-menu-item:hover {
    background-color: rgb(30, 43, 74)!important;
  }
}
</style>
