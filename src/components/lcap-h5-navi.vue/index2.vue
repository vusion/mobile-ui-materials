<template>
  <div class="h5template-navi" vusion-slot-name="default">
    <van-row
      class="navi-head"
      type="flex"
      justify="space-between"
      align="center"
    >
      <van-col>
        <van-image
          src="//static-vusion.nos-eastchina1.126.net/h5-template/top-con-icon.png"
          class="nvai-top-image"
          @click="changenavLeftPop"
        ></van-image>
      </van-col>
      <!-- <van-col>
        <van-text text="轻舟低代码"></van-text>
      </van-col> -->
      <van-col
        ><van-image
          src="//static-vusion.nos-eastchina1.126.net/h5-template/human-icon.png"
          class="nvai-top-image"
          @click="clickHuman"
        ></van-image
      ></van-col>
    </van-row>
    <van-popup
      position="left"
      ref="demoNvaiPop"
      @click-overlay="changenavLeftPop"
    >
      <div class="diy-content">
        <van-cell title="导航一" center border>
          <template v-slot:icon>
            <van-image
              src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
              class="navi-item-icon"
              @click="noop"
            >
            </van-image>
          </template>
        </van-cell>
        <van-cell title="导航二" center border>
          <template v-slot:icon>
            <van-image
              src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
              class="navi-item-icon"
              @click="noop"
            >
            </van-image>
          </template>
        </van-cell>
        <van-cell title="导航三" center border>
          <template v-slot:icon>
            <van-image
              src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
              class="navi-item-icon"
              @click="noop"
            ></van-image>
          </template>
        </van-cell>
        <van-cell title="导航四" center border>
          <template v-slot:icon>
            <van-image
              src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
              class="navi-item-icon"
              @click="noop"
            ></van-image>
          </template>
        </van-cell>
        <van-cell title="导航五" center border>
          <template v-slot:icon>
            <van-image
              src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
              class="navi-item-icon"
              @click="noop"
            ></van-image>
          </template>
        </van-cell>
        <van-cell title="导航六" center border>
          <template v-slot:icon>
            <van-image
              src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
              class="navi-item-icon"
              @click="noop"
            ></van-image>
          </template>
        </van-cell>
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
      console.log(this);
      this.$refs.demoNvaiPop.value = !this.$refs.demoNvaiPop.value;
    },
    clickHuman() {
      console.log("click human");
    },
    noop() {},
  },
};
</script>

<style lang="less">
.h5template-navi {
  height: 100%;
  padding: 4.26667vw;
  .navi-head {
    height: 11.73333vw;
    .nvai-top-image {
      width: 6.4vw;
      display: block;
    }
  }
  .navi-item-icon {
    display: block;
    width: 6.4vw;
    margin-right: 4.26667vw;
  }
  .diy-content {
    height: 100vh;
    width: 86.13333vw;
    overflow: auto;
    padding-top: 11.73333vw;
  }
}
</style>
