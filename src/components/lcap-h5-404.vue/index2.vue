<template>
  <div class="h5template-404" vusion-slot-name="default">
    <div class="m404-image-wrap">
      <van-image
        class="m404-image"
        src="//static-vusion.nos-eastchina1.126.net/h5-template/404_h5.png"
      >
      </van-image>
      <div class="m404-image-text">抱歉，你访问的页面不存在</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "lcap-h5-404",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less">
// .h5template-404 {
//   height: 100vh;
//   background-color: #fff;

//   .m404-image-wrap {
//     margin-top: 37.33333vw;

//     .m404-image {
//       display: block;
//       width: 42.66667vw;
//       margin-left: auto;
//       margin-right: auto;
//     }

//     .m404-image-text {
//       margin-top: 4.26667vw;
//       text-align: center;
//       font-family: PingFang SC;
//       font-style: normal;
//       font-weight: normal;
//       font-size: 14px;
//       color: #999;
//     }
//   }
// }
</style>
