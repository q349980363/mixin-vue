<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div @click="$router.go(-1)" class="navbar-brand">
        <i class="bi bi-backspace"></i>
        查找群
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
            @click="search"
          >
            搜索
          </button>
        </div>
      </li>
      <li
        class="list-group-item btn-right"
        v-for="item in list"
        v-bind:key="item"
      >
        {{ item }}
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click="add(item)"
        >
          加群
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import store from "../store.js";
export default {
  name: "SearchGroup",
  data() {
    return {
      target: "",
      list: [],
    };
  },
  methods: {
    search() {
      // console.log(this.target);
      store.http
        .get("/api/search_group", { params: { target: this.target } })
        .then((response) => {
          console.log(response.data);
          if (!response.data.state) {
            alert(response.data.message);
            return;
          }
          if (response.data.message) {
            this.list = response.data.list;
          }
        });
    },
    add(username) {
      console.log(1111, username);
      store.http.post("/api/add_group/" + username).then((response) => {
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