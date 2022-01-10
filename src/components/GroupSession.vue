<template>
  <div class="chat-page">
    <audio id="audioPlay" src="/prompt.mp3"></audio>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div @click="$router.go(-1)" class="navbar-brand">
        <i class="bi bi-backspace"></i>
        {{ $route.params.name }}
        <i class="bi bi-people-fill"></i>
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
            <div class="nav-link" @click="del">退出群</div>
          </li>
          <li class="nav-item">
            <div class="nav-link" @click="empty">清空聊天记录</div>
          </li>
        </ul>
      </div>
    </nav>
    <div class="chat-list container">
      <div
        class="chat"
        v-for="item in chatList"
        :key="item.id"
        v-bind:class="{ 'chat-my': store.state.userName == item.UserName }"
      >
        <div class="chat-userName">{{ item.UserName }}</div>
        <div
          class="chat-content alert alert-primary"
          data-container="body"
          data-toggle="popover"
          data-placement="top"
          data-content="Top popover"
          @click.capture="chatClick"
          v-bind:class="{
            'alert-success': store.state.userName == item.UserName,
          }"
        >
          <div class="chat-text">
            {{ item.Data }}
          </div>
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
    <div class="chat-send">
      <input
        type="text"
        v-model="text"
        class="chat-input"
        v-on:keyup.enter="send"
      />

      <button type="button" class="btn btn-dark" @click="send">send</button>
    </div>
  </div>
</template>

<script>
import store from "../store.js";
import moment from "moment";
export default {
  name: "GroupSession",
  data() {
    return {
      store: store,
      target: this.$route.params["name"],
      chatList: [],
      text: "",
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

    let _this = this;
    this.timer = setInterval(() => {
      _this.nowtime = new Date();
    }, 10000);
    this.store.e.on("group", (item) => {
      this.chatList.push(item);
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
    clearInterval(this.timer);
  },
  methods: {
    loadData(callBack) {
      store.http.get("/api/get_groupchat/" + this.target).then((response) => {
        this.chatList = response.data.list;
        // console.log("chatList: ", this.chatList);
        if (callBack) {
          callBack();
        }
      });
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
      store.http
        .post("/api/del_groupchat/" + this.target)
        .then((response) => {
          this.loadData();
        });
    },
    del() {
      store.http.post("/api/del_group/" + this.target).then((response) => {
        this.$router.go(-1);
      });
    },
  },
};
</script>

<style scoped>
</style>
