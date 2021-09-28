<template>
  <div class="h5template-login-wrap" vusion-slot-name="default">
    <van-row class="login-title">登录</van-row>
    <van-form class="login-form">
      <van-field
        :value="AccountId"
        name="accountId"
        placeholder="请输入账号"
        class="login-cell"
        rules="required"
        @input="updateVAcc"
      >
        <template v-slot:left-icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/account-icon.png"
            class="account-left-icon"
          />
        </template>
      </van-field>
      <van-field
        :value="AccountPassword"
        :type="passwordortext"
        name="accountPwd"
        placeholder="请输入密码"
        class="login-cell"
        rules="required"
        eye="yes"
        @input="updateVPwd"
        @click-right-icon="clickRightIcon"
      >
        <template v-slot:left-icon>
          <img
            src="//static-vusion.nos-eastchina1.126.net/h5-template/pwd-icon.png"
            class="account-left-icon"
          />
        </template>
      </van-field>
      <div style="margin-top: 8.53333vw">
        <van-button
          block
          type="info"
          native-type="submit"
          class="cus-login-button"
          @click="onSubmit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
function noop() {
  return "";
}
const noSupport = {
  set: noop,
  get: noop,
  remove: noop,
  clear: noop,
};

const isLocalStorageAvailable = () => {
  try {
    const key = "testlocastorage";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);

    return true;
  } catch (error) {
    return false;
  }
};

const storage = isLocalStorageAvailable() ? window.localStorage : null;
const storageUtil = !storage
  ? noSupport
  : {
      set(key, value) {
        storage.setItem(key, value);
      },
      get(key) {
        return storage.getItem(key);
      },
      remove(key) {
        return storage.removeItem(key);
      },
      clear() {
        storage.clear();
      },
    };

function getDomain() {
  const { hostname } = location;
  const hostArr = hostname.split(".");
  if (hostArr.length < 3) return hostname;
  const len = hostArr.length;
  return `${hostArr[len - 3]}.${hostArr[len - 2]}.${hostArr[len - 1]}`;
}
let token;
const cookieUtil = {
  set(data = {}, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = d.toGMTString();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (key && value) {
        document.cookie = `${key}=${encodeURIComponent(
          value
        )}; expires=${expires}; path=/`;
      }
    });
  },
  get(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  },
  erase(name) {
    const d = new Date();
    d.setTime(d.getTime() - 1 * 24 * 60 * 60 * 1000);
    const expires = d.toGMTString();
    document.cookie = `${name}=; expires=${expires}; path=/`;
    const domain = getDomain();
    document.cookie = `${name}=; expires=${expires}; path=/; domain=${domain}`;
  },
  eraseAll() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      this.erase(name);
    }
  },
};
// eslint-disable-next-line no-unused-vars
const tokenUtil = {
  set(Authorization) {
    token = Authorization;
    cookieUtil.set({ authorization: Authorization });
    storageUtil.set("Authorization", Authorization);
  },
  get() {
    return (
      token ||
      cookieUtil.get("authorization") ||
      storageUtil.get("Authorization")
    );
  },
  erase() {
    this.set("");
    cookieUtil.eraseAll();
  },
};

export default {
  name: "lcap-h5-login",
  data() {
    return {
      eye: false,
      passwordortext: "password",
      LoginType: "Normal",
      AccountId: "",
      AccountPassword: "",
      // 租户级别基础登录配置
      tenantLoginTypesLoading: true,
      tenantLoginTypes: [],
      AppKeyMap: {},
      // 组件登录配置
      configLoading: true,
      configLoginTypes: ["Normal"],
    };
  },
  computed: {},
  methods: {
    eyeCom() {
      if (!this.eye) {
        return "//static-vusion.nos-eastchina1.126.net/h5-template/eye-close-icon.png";
      }
      return "//static-vusion.nos-eastchina1.126.net/h5-template/eye-open-icon.png";
    },
    updateVAcc(v) {
      this.AccountId = v;
    },
    updateVPwd(v) {
      this.AccountPassword = v;
    },
    clickRightIcon() {
      const now = this.passwordortext;
      if (now === "password") {
        this.passwordortext = "text";
      } else {
        this.passwordortext = "password";
      }
    },
    onSubmit() {
      console.log("submit");
      this.login();
    },
    login() {
      const LoginType = "Normal";
      const { AccountId, AccountPassword } = this;
      if (!(AccountId.length > 0 && AccountPassword.length > 0)) {
        return;
      }
      const {
        tenant,
        domainName,
        // eslint-disable-next-line no-unused-vars
        nuimsDomain = "user.lcap.163yun.com",
      } = window.appInfo;
      try {
        this.$auth
          .loginH5({
            body: {
              UserName: AccountId,
              Password: AccountPassword,
              LoginType,
              TenantName: tenant,
              DomainName: domainName,
            },
            config: {
              noAlert: true,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.Code === "Success") {
              cookieUtil.set({
                authorization: res.authorization,
                userName: res.Data.UserName,
                userId: res.Data.UserId,
              });
              location.href = "/";
            }
          });
      } catch (error) {
        window.vant.Notify({
          type: "danger",
          message: "请输入正确的账号或密码",
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
// .h5template-login-wrap {
//   height: 100vh;
//   padding: 4.26667vw;
//   background-color: #ffffff;
//   .login-title {
//     font-family: PingFang SC;
//     font-style: normal;
//     font-weight: 500;
//     font-size: 7.46667vw;
//     line-height: 10.4vw;
//     color: #333333;
//     margin-bottom: 14.93333vw;
//   }
//   .login-form {
//   }
//   .login-cell {
//     padding: 0;
//     line-height: 10.4vw;
//     background: #f6f6f6;
//     border-radius: 1.06667vw;
//     margin-bottom: 4.26667vw;
//   }
//   .login-cell /deep/ .van-field__left-icon {
//     margin-right: 3.2vw;
//     margin-left: 3.2vw;
//     display: flex;
//     align-items: center;
//   }
//   .login-cell /deep/ .van-field__right-icon {
//     margin-right: 4.26667vw;
//     margin-left: 0;
//     display: flex;
//     align-items: center;
//     padding: 0;

//     img {
//       display: block;
//       width: 6.4vw;
//       height: 6.4vw;
//     }
//   }
//   .login-cell /deep/ .van-field__control {
//     color: #aaa;
//   }
//   .account-left-icon {
//     width: 6.4vw;
//     height: 6.4vw;
//   }
//   .cus-login-button {
//     background: #4c88ff;
//     font-family: PingFang SC;
//     font-style: normal;
//     font-weight: 500;
//     font-size: 4.8vw;
//     letter-spacing: 4.8vw;
//     line-height: 12.8vw;
//     color: #ffffff;
//     border-radius: 1.06667vw;
//   }
// }
</style>
