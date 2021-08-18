<template>
  <div class="login-wrap">
    <div class="login-con">
      <van-tabs v-model="active" color="#337eff">
        <van-tab
          title="普通登陆"
          v-for="item in tabsLoginTypes"
          :key="item.value"
        >
          <div class="pwd-wrap" v-if="item.value === 'Normal'">
            <van-form validate-first @submit="onSubmit" @failed="onFailed">
              <van-field
                v-model="account.AccountId"
                name="account"
                label="账号"
                placeholder="请输入账号"
                :rules="[{ required: true, message: '请输入正确的账号' }]"
              />
              <van-field
                v-model="account.AccountPassword"
                type="password"
                name="password"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入正确的密码' }]"
              />
              <div class="button">
                <van-button
                  round
                  block
                  type="info"
                  native-type="submit"
                  :disabled="canSubmit"
                  >提交</van-button
                >
              </div>
            </van-form>
          </div>
        </van-tab>
        <van-tab title="" disabled></van-tab>
        <van-tab title="" disabled></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Tabs, Tab, Form, Field, Button, Notify } from "vant";
import queryString from "query-string";
import { getObj, getArr, getTenant } from "@/global/utils/utils";
import {
  TAB_MAP,
  AUTH_MAP,
  NUIMS_DOMAIN_NAME,
  LOGIN_TYPES_MAP,
  CLOGIN_KEY,
} from "@/global/constant";
import localStorage from "@/global/utils/storage/localStorage";
import token from "@/global/utils/storage/token";
import service from "./service";

// const rmLastSlash = (str) => {
//   const cStr = String(str);
//   return cStr[cStr.length - 1] === "/"
//     ? cStr.substring(0, cStr.length - 1)
//     : cStr;
// };
// const commonType = "clogin";

export default {
  name: "lcap-h5-login",
  props: {
    type: {
      type: String,
      default: "clogin",
    },
    src: {
      type: String,
      default: "http://nuims.vusion.top/clogin",
    },
    exdays: {
      type: Number,
      default: 1,
    },
    // 登录应用信息
    domainName: {
      type: String,
      default: undefined,
    },
    // 开启普通登录，默认开启
    useNormal: {
      type: Boolean,
      default: true,
    },
    // 开启轻舟登录
    useQZ: {
      type: Boolean,
      default: false,
    },
    // 开启 LDAP 登录
    useLdap: {
      type: Boolean,
      default: false,
    },
    // 开启 OpenID 登录
    useNetease: {
      type: Boolean,
      default: false,
    },
    // 开启 Github 登录
    useGithub: {
      type: Boolean,
      default: false,
    },
    // 开启微信登录
    useWechat: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: 0,
      account: {
        LoginType: "Normal",
        AccountId: "",
        AccountPassword: "",
      },
      // 租户级别基础登录配置
      tenantLoginTypesLoading: true,
      tenantLoginTypes: [],
      AppKeyMap: {},
      // 组件登录配置
      configLoading: true,
      configLoginTypes: ["Normal"],
      from: location.href,
    };
  },
  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
  },
  async mounted() {
    const query = queryString.parse(location.href.replace(/(\S*)\?/, ""));
    const { code, userName, userId } = query;
    if (userName && userId && code) {
      this.setCookie({
        authorization: code,
        userName,
        userId,
      });
      this.$emit("success", {
        Authorization: code,
        UserName: userName,
        UserId: userId,
      });
    } else {
      this.loginPre();
    }
  },
  computed: {
    canSubmit() {
      return !(
        this.account.AccountId.length > 0 &&
        this.account.AccountPassword.length > 0
      );
    },
    domainUrl() {
      const { origin /* , protocol, host */ } = location;
      return `${origin}/fenuims`;
    },
    tabsLoginTypes() {
      const tabsLoginTypes = [];
      Object.keys(TAB_MAP).forEach((key) => {
        if (
          this.configLoginTypes.includes(key) &&
          this.tenantLoginTypes.includes(key)
        ) {
          tabsLoginTypes.push({
            title: TAB_MAP[key],
            value: key,
          });
        }
      });
      return tabsLoginTypes;
    },
    authLoginTypes() {
      const authLoginTypes = [];
      Object.keys(AUTH_MAP).forEach((key) => {
        if (
          this.configLoginTypes.includes(key) &&
          this.tenantLoginTypes.includes(key)
        ) {
          authLoginTypes.push({
            title: AUTH_MAP[key],
            value: key,
          });
        }
      });
      return authLoginTypes;
    },
    hasTabLoginTypes() {
      return this.tabsLoginTypes && this.tabsLoginTypes.length > 0;
    },
    hasAuthLoginTypes() {
      return this.authLoginTypes && this.authLoginTypes.length > 0;
    },
    showTips() {
      return !this.errMsg && !this.hasAuthLoginTypes;
    },
    showNoneTips() {
      return !this.hasTabLoginTypes && !this.hasAuthLoginTypes;
    },
    loading() {
      return this.configLoading || this.tenantLoginTypesLoading;
    },
  },
  watch: {
    tabsLoginTypes(value) {
      if ([...value].length) {
        this.account.LoginType = value[0].value;
      }
    },
    loading(value) {
      if (!value) {
        this.callOnlyAuth();
      }
    },
  },
  methods: {
    async loginPre() {
      const configLoginTypes = [];
      let tenantLoginTypes = [];
      if (this.type === CLOGIN_KEY) {
        const { useNormal, useQZ, useLdap, useNetease, useGithub, useWechat } =
          this;
        const useData = {
          useNormal,
          useQZ,
          useLdap,
          useNetease,
          useGithub,
          useWechat,
        };
        Object.keys(LOGIN_TYPES_MAP).forEach((key) => {
          // eslint-disable-next-line no-extra-boolean-cast
          if (!!getObj(useData)[`use${key}`]) {
            configLoginTypes.push(key);
          }
        });
        this.configLoginTypes = configLoginTypes;
        this.configLoading = false;
      }

      try {
        const AppKeyMap = {};
        const res = await service.GetTenantLoginTypes({
          TenantName: getTenant(),
        });
        const AUTH_KEYS = Object.keys(AUTH_MAP);
        getArr(getObj(res).Data).forEach((d) => {
          const { LoginType, AppKey } = getObj(d);
          tenantLoginTypes.push(LoginType);
          if (AUTH_KEYS.includes(LoginType)) {
            AppKeyMap[LoginType] = AppKey;
          }
        });
        this.AppKeyMap = AppKeyMap;
      } catch (error) {
        tenantLoginTypes = ["Normal"];
        console.warn(error);
      }
      this.tenantLoginTypes = tenantLoginTypes;
      this.tenantLoginTypesLoading = false;
    },
    onFailed(errorInfo) {
      console.log("failed", errorInfo);
    },
    onSubmit(values) {
      console.log("submit", values);
      this.login();
    },
    setCookie(data = {}) {
      const d = new Date();
      d.setTime(d.getTime() + this.exdays * 24 * 60 * 60 * 1000);
      const expires = d.toGMTString();
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (key && value) {
          document.cookie = `${key}=${value}; expires=${expires}; path=/`;
        }
      });
    },
    async login() {
      let data = {};
      let success = false;
      try {
        const { AccountId, AccountPassword, LoginType } = this.account;
        const res = await service.Login({
          body: {
            UserName: AccountId,
            Password: AccountPassword,
            LoginType,
            TenantName: getTenant(),
            DomainName: NUIMS_DOMAIN_NAME,
          },
          config: {
            noAlert: true,
          },
        });
        const { Data } = getObj(res);
        const { UserName, UserId } = getObj(Data);
        data = {
          Authorization: token.get(),
          UserName,
          UserId,
        };
        success = true;
        localStorage.set("LoginType", LoginType);
        localStorage.set("DomainName", this.domainName);
      } catch (error) {
        success = false;
        data = {
          Message: (error && error.message) || "login error",
        };
        Notify({
          type: "danger",
          message: "请输入正确的账号或密码",
        });
      }
      if (this.type === CLOGIN_KEY) {
        if (success) {
          const { Authorization, UserName, UserId } = data;
          {
            this.setCookie({
              authorization: Authorization,
              userName: UserName,
              userId: UserId,
            });
            this.$emit("success", data);
          }
        } else {
          this.$emit("error", data);
        }
      }
    },
    // Auth 登录
    callAuth(authKey) {
      const { origin } = location;
      // eslint-disable-next-line camelcase
      const redirect_uri = `${origin}/cb?redirect=${this.from}`;
      localStorage.set("RedirectUri", redirect_uri);
      localStorage.set("DomainName", this.domainName);
      const LoginType = `C${authKey}`;
      localStorage.set("LoginType", LoginType);
      let To;
      switch (authKey) {
        case "Netease":
          To = `https://login.netease.com/connect/authorize?${queryString.stringify(
            {
              response_type: "code",
              scope: "openid nickname",
              client_id: this.AppKeyMap.Netease,
              redirect_uri,
            }
          )}`;
          break;
        case "Github":
          To = `https://github.com/login/oauth/authorize?${queryString.stringify(
            {
              response_type: "code",
              scope: "user:email",
              client_id: this.AppKeyMap.Github,
              redirect_uri,
            }
          )}`;
          break;
        case "Wechat":
          To = `https://open.weixin.qq.com/connect/qrconnect?${queryString.stringify(
            {
              response_type: "code",
              scope: "snsapi_login",
              appid: this.AppKeyMap.Wechat,
              redirect_uri,
            }
          )}`;
          break;
      }
      if (["CNetease", "CGithub", "CWechat"].includes(LoginType)) {
        location.href = To;
      }
    },
    callOnlyAuth() {
      if (!this.hasTabLoginTypes && this.authLoginTypes.length === 1) {
        this.callAuth(this.authLoginTypes[0].value);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-wrap {
  background-color: #fff;
  .pwd-wrap {
    padding-top: 4px;
    padding-left: 10px;
    padding-right: 10px;

    .button {
      margin: 16px;
    }
  }
}
</style>
