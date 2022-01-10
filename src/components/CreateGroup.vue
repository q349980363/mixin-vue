<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div @click="$router.go(-1)" class="navbar-brand">
        <i class="bi bi-backspace"></i>
        创建新的群聊
      </div>
    </nav>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <div class="search">
          <input
            type="text"
            class="form-control"
            v-model="target"
            placeholder="请输入群名称"
            v-on:keyup.enter="search"
          />
          <button
            type="button"
            class="btn btn-outline-primary btn-sm"
            @click="create"
          >
            创建
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import store from "../store.js";
export default {
  name: "CreateGroup",
  data() {
    return {
      target: "",
      list: [],
    };
  },
  methods: {
    create() {
      // console.log(this.target);
      store.http
        .get("/api/create_group", { params: { target: this.target } })
        .then((response) => {
          console.log(response.data);

          alert(response.data.message);
        });
    },
  },
};
</script>

<style scoped>
.search {
  display: flex;
}
.search input {
  margin-right: 10px;
  flex: 1;
}
.btn-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>