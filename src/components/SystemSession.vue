<template>
  <div class="chat-page">
    <audio id="audioPlay" src="/prompt.mp3"></audio>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <!-- <div class="navbar-brand"></div> -->
      <div @click="$router.go(-1)" class="navbar-brand">
        <i class="bi bi-backspace"></i>
        系统消息
      </div>
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
            <div class="nav-link" @click="empty">清空聊天记录</div>
          </li>

          <li class="nav-item">
            <div class="nav-link" @click="logout">退出登录</div>
          </li>
        </ul>
      </div>
    </nav>
    <div class="chat-list container">
      <div class="chat" v-for="item in list" :key="item.id">
        <div class="chat-userName">
          系统消息
          <small>[{{ item.Type }}]</small>
        </div>
        <div
          class="chat-content alert alert-primary"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-content="Top popover"
          @click.capture="chatClick"
        >
          <div class="chat-text">{{ item.Txt }}</div>
          <div
            v-if="!item.Result && item.Operation == 'ok_no'"
            class="btn-group chat-buttonGroup btn-group-sm btn-block"
            role="group"
          >
            <button type="button" class="btn btn-danger" @click="no(item)">
              拒绝
            </button>
            <button type="button" class="btn btn-success" @click="ok(item)">
              接受
            </button>
          </div>
          <div v-else class="chat-text">{{ ResultToStr(item.Result) }}</div>
          <div>
            <small to>{{ moment(item.CreatedAt, nowtime) }}</small>
          </div>
        </div>
        <div>
          <small>{{ item.Ip }}</small>
          <small> {{ item.IpAddr }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store.js";
import moment from "moment";
export default {
  name: "SystemSession",
  data() {
    return {
      store: store,
      list: [],
      nowtime: new Date(),
    };
  },
  created() {
    this.loadData(() => {
      this.$nextTick(function () {
        //  仅在整个视图都被重新渲染之后才会运行的代码
        this.chatListToEnd();
      });
    });
    store.e.on("system", (item) => {
      console.log(this);
      this.list.push(item);
      if (this.chatListIsEnd()) {
        this.$nextTick(function () {
          //  仅在整个视图都被重新渲染之后才会运行的代码
          this.chatListToEnd();
        });
      }
    });
  },
  beforeDestroy() {
    console.log("销毁");
  },
  methods: {
    loadData(callBack) {
      store.http.get("/api/get_systemchat").then((response) => {
        this.list = response.data.list;
        if (callBack) {
          callBack();
        }
      });
    },
    send() {
      store.send(this.text);
      this.text = "";
    },
    ResultToStr(str) {
      switch (str) {
        case "ok":
          return "您已同意该请求";
        case "no":
          return "您已拒绝该请求";
      }
    },
    chatClick(e, a, b, c) {
      console.log(e, this);
    },
    moment(timeStr, e) {
      return moment(timeStr).fromNow();
    },
    chatListToEnd() {
      var dom = this.$el.querySelector(".chat-list");
      dom.scrollTop = dom.scrollHeight;
    },
    chatListIsEnd() {
      var dom = this.$el.querySelector(".chat-list");
      var top = dom.clientHeight + dom.scrollTop;
      return top >= dom.scrollHeight;
    },
    logout() {
      localStorage.userName = localStorage.toKen = "";
      store.router.replace("/");
      location.reload();
    },
    empty() {
      store.empty();
    },
    ok(data) {
      store.http
        .post("/api/operation_systemchat/" + data.ID, {
          result: "ok",
          exint: data.ExInt,
        })
        .then((response) => {
          this.loadData(() => {});
          if (!response.data.state) alert(response.data.message);
        });
    },
    no(data) {
      store.http
        .post("/api/operation_systemchat/" + data.ID, {
          result: "no",
          exint: data.ExInt,
        })
        .then((response) => {
          this.loadData(() => {});
          if (!response.data.state) alert(response.data.message);
        });
    },
  },
};
</script>

<style scoped>
</style>
