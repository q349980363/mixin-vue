<template>
  <div class="login container">
    <form @submit.prevent="postData">
      <h1 class="headline">注册</h1>
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
          <router-link to="/Login" class="btn btn-link btn-back">
            返回登陆</router-link
          >
        </div>
        <div class="col-8">
          <button type="submit" class="btn btn-success btn-block">注册</button>
        </div>
      </div>
    </form>

    <div class="login-about">作者 QQ759323585 承接软件定制</div>
  </div>
</template>

<script>
import store from "../store.js";
export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    postData() {
      store.register(this.username, this.password).then((data) => {
        console.log("register", data);
        if (!data.state) {
          alert(data.message);
        }
      });
    },
  },
};
</script>

<style scoped>
.login h1 {
  color: #007bff;
}
</style>