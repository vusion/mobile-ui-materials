<template>
  <div class="h5template-navi" vusion-slot-name="default">
    <van-row
      class="navi-head"
      type="flex"
      justify="space-between"
      align="center"
    >
      <van-col>
        <van-iconv class="nvai-top-image" name="展开" notext />
      </van-col>
      <van-col>
        <van-text text="轻舟低代码" class="lcp-title-navi"></van-text>
      </van-col>
      <van-col>
        <van-iconv
          class="nvai-top-image"
          name="我的"
          notext
          @click="clickHuman"
        />
      </van-col>
    </van-row>
    <van-popup position="left" ref="demoNvaiPop" close-on-click-overlay>
      <div class="diy-content">
        <van-cell title="导航一" center border icon="程序"></van-cell>
        <van-cell title="导航二" center border icon="程序"></van-cell>
        <van-cell title="导航三" center border icon="程序"></van-cell>
        <van-cell title="导航四" center border icon="程序"></van-cell>
        <van-cell title="导航五" center border icon="程序"></van-cell>
        <van-cell title="导航六" center border icon="程序"></van-cell>
      </div>
    </van-popup>
    <van-router-view></van-router-view>
  </div>
</template>

<script>
export default {
  name: "lcap-h5-navi",
  data() {
    return {};
  },
  methods: {
    changenavLeftPop() {
      this.$refs.demoNvaiPop.realValue = true;
    },
    clickHuman() {
      console.log("click human");
    },
    noop() {
      return null;
    },
  },
};
</script>

<style lang="less">
// .h5template-navi {
//   height: 100%;
//   padding: 4.26667vw;
//   .navi-head {
//     height: 11.73333vw;
//     .nvai-top-image {
//       width: 6.4vw;
//       display: block;
//     }
//   }
//   .navi-item-icon {
//     display: block;
//     width: 6.4vw;
//     margin-right: 4.26667vw;
//   }
//   .diy-content {
//     height: 100vh;
//     width: 86.13333vw;
//     overflow: auto;
//     padding-top: 11.73333vw;
//   }
// }
</style>
