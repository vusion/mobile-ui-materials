<template>
  <div class="h5template-navi">
    <van-row
      class="navi-head"
      type="flex"
      justify="space-between"
      align="center"
    >
      <van-col>
        <img
          :src="topConIcon"
          class="nvai-top-image"
          @click="changenavLeftPop"
        />
      </van-col>
      <van-col><van-image :src="human" class="nvai-top-image" @click="clickHuman"></van-image></van-col>
    </van-row>
    <van-popup><div style="height: 30vh; width: 30vw">内容</div></van-popup>
    <van-popup
      :value="navLeftPop"
      position="left"
      class="diy-content"
      @click-overlay="changenavLeftPop"
    >
      <van-cell title="导航一" center border>
        <template v-slot:icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
            class="navi-item-icon"
          />
        </template>
      </van-cell>
      <van-cell title="导航二" center border>
        <template v-slot:icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
            class="navi-item-icon"
          />
        </template>
      </van-cell>
      <van-cell title="导航三" center border>
        <template v-slot:icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
            class="navi-item-icon"
          />
        </template>
      </van-cell>
      <van-cell title="导航四" center border>
        <template v-slot:icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
            class="navi-item-icon"
          />
        </template>
      </van-cell>
      <van-cell title="导航五" center border>
        <template v-slot:icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
            class="navi-item-icon"
          />
        </template>
      </van-cell>
      <van-cell title="导航六" center border>
        <template v-slot:icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/item-icon.png"
            class="navi-item-icon"
          />
        </template>
      </van-cell>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "lcap-h5-navi",
  data() {
    return {
      topConIcon:
        "//static-vusion.nos-eastchina1.126.net/h5-template/top-con-icon.png",
      human:
        "//static-vusion.nos-eastchina1.126.net/h5-template/human-icon.png",
      navLeftPop: false,
    };
  },
  methods: {
    changenavLeftPop() {
      this.navLeftPop = !this.navLeftPop;
    },
    clickHuman() {
      console.log("click human");
    },
  },
};
</script>

<style lang="less">
.h5template-navi {
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
  .diy-content{
    height: 100%;
    width: 86.13333vw;
    overflow: auto;
    padding-top: 11.73333vw;
  }
}
</style>
