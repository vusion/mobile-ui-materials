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
      changeConfig: {},
      change: false,
    };
  },
  mounted() {
    var search = window.location.search;
    var query = this.$auth.parse(search) || {};
    var code = query.code,
      userName = query.userName,
      redirect = query.redirect,
      userId = query.userId,
      token = query.token;
    if (token) {
      cookieUtil.set({
        authorization: token,
      });
      location.href = "/";
    } else {
      this.getConfig();
    }
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
    getConfig() {
      try {
        this.$auth.getConfig().then((res) => {
          console.info("res", res);
          const obj = JSON.parse(res.userCenter);
          // updata config
          this.changeConfig = obj;
          this.change = obj.change;

          if (this.change) {
            // 定位到第三方登录
            if (!window.location.href.includes("token=")) {
              // redirect back with token
              var _this$changeConfig$h, _this$changeConfig$h2;

              window.location.href = ""
                .concat(
                  (_this$changeConfig$h = this.changeConfig.h5) === null ||
                    _this$changeConfig$h === void 0
                    ? void 0
                    : _this$changeConfig$h.url,
                  "?"
                )
                .concat(
                  this.$auth.stringify(
                    Object.assign(
                      ((_this$changeConfig$h2 = this.changeConfig.h5) ===
                        null || _this$changeConfig$h2 === void 0
                        ? void 0
                        : _this$changeConfig$h2.params) || {},
                      {
                        redirect_uri: window.location.href,
                      }
                    )
                  )
                );
            }
          }
        });
      } catch (error) {
        console.info("no config");
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
        window.vant.VanNotify({
          type: "danger",
          message: "请输入正确的账号或密码",
        });
      }
    },
  },
};
</script>
