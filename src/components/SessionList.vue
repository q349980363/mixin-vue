<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="navbar-brand">{{ store.state.userName }}</div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/create_group"
              >创建群</router-link
            >
          </li>
          <div class="dropdown-divider"></div>
          <li class="nav-item">
            <router-link class="nav-link" to="/search_group"
              >搜索群</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/search_user"
              >搜索好友</router-link
            >
          </li>

          <div class="dropdown-divider"></div>
          <li class="nav-item">
            <div class="nav-link" @click="logout">退出登录</div>
          </li>
        </ul>
      </div>
    </nav>
    <div class="list-group list-group-flush">
      <div
        class="list-group-item list-group-item-action"
        v-for="item in list"
        v-bind:key="item.ID"
        @click="clickUser(item)"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            {{ item.Name }}
            <small v-if="item.type == 'friend' && item.Path == ''">
              <i class="bi bi-person-fill"></i>
            </small>
            <small v-if="item.type == 'group'">
              <i class="bi bi-people-fill"></i>
            </small>
          </h5>
          <span
            class="badge badge-secondary badge-right"
            v-if="item.Unread !== 0"
            >{{ item.Unread }}</span
          >
        </div>
        <div class="d-flex w-100 justify-content-between">
          <p class="mb-1">{{ item.LastChat }}</p>
          <small class="text-muted">{{ moment(item.LastChatAt) }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store.js";
import moment from "moment";
var defaultSession = [
  {
    Name: "世界频道",
    click: () => {
      store.router.push("session_global");
    },
  },
];
export default {
  name: "SessionList",
  data() {
    return {
      store: store,
      list: defaultSession.concat([]),
    };
  },
  created() {
    this.loadData(() => {
      this.$nextTick(function () {
        //  仅在整个视图都被重新渲染之后才会运行的代码
        this.chatListToEnd();
      });
    });
    store.e.on("friends", (item) => {
      this.loadData();
    });
    store.e.on("group", (item) => {
      this.loadData();
    });
    store.e.on("system", (item) => {
      this.loadData();
    });
  },
  methods: {
    loadData(callBack) {
      store.http.get("/api/get_session").then((response) => {
        var data = response.data.data;
        var list = [];
        for (const key in data.friends) {
          if (Object.hasOwnProperty.call(data.friends, key)) {
            const element = data.friends[key];
            element.Name = element.Target;
            element.type = "friend";
            list.push(element);
          }
        }
        for (const key in data.group) {
          if (Object.hasOwnProperty.call(data.group, key)) {
            const element = data.group[key];
            element.Name = element.Target;
            element.type = "group";
            list.push(element);
          }
        }
        this.list = defaultSession.concat(list);
        if (callBack) {
          callBack();
        }
      });
    },
    chatListToEnd() {
      var dom = this.$el.querySelector(".list-group");
      dom.scrollTop = dom.scrollHeight;
    },
    chatListIsEnd() {
      var dom = this.$el.querySelector(".list-group");
      var top = dom.clientHeight + dom.scrollTop;
      return top == dom.scrollHeight;
    },
    clickUser(item) {
      if (item.click) {
        item.click();
      } else if (item.Path) {
        this.$router.push(item.Path);
      } else {
        if ((item.type == "friend")) {
          this.$router.push({
            name: "user_session",
            params: { username: item.Target },
          }); // -> /user/123
        } else if ((item.type == "group")) {
            this.$router.push({
            name: "group_session",
            params: { name: item.Target },
          }); // -> /user/123
        }
      }
    },
    moment(timeStr) {
      if (!timeStr) {
        return;
      }
      return moment(timeStr).calendar(); //.format("MM/DD HH:mm:ss");
    },
    add(username) {
      console.log(1111, username);
      store.http.post("/api/add_friends/" + username).then((response) => {
        console.log(response.data);
        alert(response.data.message);
      });
    },
    logout() {
      localStorage.userName = localStorage.toKen = "";
      store.router.replace("/");
      location.reload();
    },
  },
};
</script>

<style scoped>
.badge-right {
  margin-bottom: auto;
}
.list-group.list-group-flush {
  border-width: 0 0 1px;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
</style>

