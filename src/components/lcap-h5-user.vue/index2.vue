<template>
  <div class="h5template-user" vusion-slot-name="default">
    <van-row class="user-head-wrap" type="flex" align="center">
      <van-image
        src="//static-vusion.nos-eastchina1.126.net/h5-template/head-icon.png"
        class="user-avatar"
      ></van-image>
      <div class="user-name">{{ username }}</div>
    </van-row>
    <van-row class="user-middle" style="margin-top: 2.13333vw">
      <van-cell title="内容一" center border is-link icon="program"></van-cell>
      <van-cell title="内容二" center border is-link icon="program"></van-cell>
      <van-cell title="内容三" center border is-link icon="program"></van-cell>
      <van-cell title="内容四" center border is-link icon="program"></van-cell>
    </van-row>
    <van-row class="user-logout" style="margin-top: 2.13333vw" @click="logout">
      退出登录
    </van-row>
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
  name: "lcap-h5-user",
  data() {
    return {
      logoutUrl: '',
      username: cookieUtil.get("userName") || "默认名字",
    };
  },
  created() {
      this.$auth.getNuims({
        Action: 'GetTenantLoginTypes',
        Version: '2020-06-01',
        TenantName: getTenant(),
      }).then(res => {

        const KeycloakConfig = res.Data.find(item => (item.LoginType === 'Keycloak'));
        if (KeycloakConfig) {
            this.logoutUrl = `${KeycloakConfig?.extendProperties?.logout_url}?redirect_uri=${window.location.protocol}//${window.location.host}/login`;
        }     
      });
  },
  methods: {
    logout() {
      window.vant.VanDialog.confirm({
        title: "提示",
        message: "确定退出登录吗",
      })
        .then(async () => {
          try {
            if (this.logoutUrl) {
                window.location.href = this.logoutUrl;
            } else {
               await this.$auth.logout();
            }
           
          } catch (error) {
            console.warn(error);
          }
          tokenUtil.erase();
          window.location.href = "/login";
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less">
// .h5template-user {
//   width: 100vw;
//   height: 100vh;
//   background-color: #f6f6f6;
//   .user-head-wrap {
//     height: 42.66667vw;
//     background-color: #fff;
//     padding-left: 6.4vw;

//     .user-avatar {
//       width: 17.06667vw;
//       height: 17.06667vw;
//       margin-right: 4.26667vw;
//     }
//     .user-name {
//       font-family: PingFang SC;
//       font-style: normal;
//       font-weight: 500;
//       font-size: 5.33333vw;
//       line-height: 5.33333vw;
//       color: #333333;
//     }
//   }
//   .navi-item-icon {
//     display: block;
//     width: 6.4vw;
//     margin-right: 4.26667vw;
//   }
//   .user-logout {
//     line-height: 14.93333vw;
//     background: #ffffff;
//     text-align: center;
//     font-family: PingFang SC;
//     font-style: normal;
//     font-weight: normal;
//     font-size: 4.26667vw;
//     color: #f55a4c;
//   }
// }
</style>
