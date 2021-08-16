<template>
  <div class="login-wrap">
    <div class="login-con">
        <van-tabs v-model="active" color="#337eff">
            <van-tab title="普通登陆">
              <div class="pwd-wrap">
                <van-form @submit="onSubmit">
                  <van-field
                    v-model="username"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                  />
                  <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                  />
                  <div class="button">
                    <van-button round block type="info" native-type="submit">提交</van-button>
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
import { Tabs, Tab, Form, Field, Button } from 'vant';

export default {
    data() {
        return {
            active: 0,
            username: '',
            password: '',
        }
    },
    components: {
      [Tabs.name]: Tabs,
      [Tab.name]: Tab,
      [Form.name]: Form,
      [Field.name]: Field,
      [Button.name]: Button,
    },
    methods: {
      onSubmit(values) {
        console.log('submit', values);
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
