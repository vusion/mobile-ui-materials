<template>
  <div class="h5template-401" vusion-slot-name="default">
    <div class="m401-image-wrap">
      <van-image
        class="m401-image"
        src="//static-vusion.nos-eastchina1.126.net/h5-template/401_h5.png"
      >
      </van-image>
      <div class="m401-image-text">你没有访问该页面的权限</div>
      <div class="m401-image-btn" @click="toLogin">重新登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "lcap-h5-401",
  data() {
    return {};
  },
  methods: {
    toLogin() {
      window.location.href = "/login";
    },
  },
};
</script>

<style lang="less">
// .h5template-401 {
//   height: 100vh;
//   background-color: #fff;

//   .m401-image-wrap {
//     margin-top: 37.33333vw;

//     .m401-image {
//       display: block;
//       width: 42.66667vw;
//       margin-left: auto;
//       margin-right: auto;
//     }

//     .m401-image-text {
//       margin-top: 4.26667vw;
//       text-align: center;
//       font-family: PingFang SC;
//       font-style: normal;
//       font-weight: normal;
//       font-size: 14px;
//       color: #999;
//     }

//     .m401-image-btn {
//       width: 25.6vw;
//       height: 8.53333vw;
//       line-height: 8.53333vw;
//       background: #337eff;
//       border-radius: 4px;
//       font-family: PingFang SC;
//       font-style: normal;
//       font-weight: normal;
//       font-size: 14px;
//       color: #fff;
//       text-align: center;
//       margin-left: auto;
//       margin-right: auto;
//       margin-top: 40px;
//     }
//   }
// }
</style>
