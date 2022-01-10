<template>
  <div class="login container">
    <form @submit.prevent="postData">
      <h1 class="headline">登录 <small>0.1.0</small></h1>
      <div class="form-group">
        <label>账号</label>
        <input type="text" v-model="username" class="form-control" />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">密码</label>
        <input type="password" v-model="password" class="form-control" />
        <small class="form-text text-muted">请记住您的密码</small>
      </div>

      <div class="row">
        <div class="col-4">
          <router-link to="/Register" class="btn btn-link btn-back">
            注册新用户
          </router-link>
        </div>
        <div class="col-8">
          <button type="submit" class="btn btn-dark btn-block">登录</button>
        </div>
      </div>
    </form>

    <div class="login-about">作者 QQ759323585 承接软件定制</div>
  </div>
</template>

<script>
import store from "../store.js";

//TODO 应该在登录与注册页面检查登录状态
//TODO 如果登录则直接跳转至home 页面
export default {
  name: "Login",
  data() {
    return {
      username: store.state.userName,
      password: "",
    };
  },
  methods: {
    postData() {
      store.login(this.username, this.password).then((data) => {
        console.log("login", data);
        if (!data.state) {
          alert(data.message);
        }
      });
    },
  },
};
</script>
