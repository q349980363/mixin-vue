import axios from "axios";
import router from "./router";
import EventEmitter from "events";

var host = location.host;
router.beforeEach((to, from, next) => {
  // console.log("0000000", to);
  if (!localStorage.userName && to.name !== "login")
    next({
      name: "login",
    });
  // // 如果用户未能验证身份，则 `next` 会被调用两次
  next();
});
if (process.env.NODE_ENV == "development") {
  host = "192.168.31.213:8080";
}
axios.defaults.baseURL = "http://" + host + "";
axios.defaults.headers["token"] = "asd";
axios.interceptors.request.use(
  (req) => {
    // 在发送请求前要做的事儿
    req.headers["token"] = localStorage.toKen;
    return req;
  },
  (err) => {
    // 在请求错误时要做的事儿

    // 该返回的数据则是axios.catch(err)中接收的数据
    return Promise.reject(err);
  }
);
var http = axios;
export const store = {
  router: router,
  http: http,
  e: new EventEmitter(),
  state: {
    wsConnectionStatus: false,
    loginStatus: false,
    loading: false,
    userName: "",
    toKen: "",
    chatList: [],
  },
  login(userName, passWord) {
    this.state.loading = true;
    return new Promise((resolve, reject) => {
      http
        .post("/login", {
          userName: userName,
          passWord: passWord,
        })
        .then((response) => {
          this.state.loading = false;
          console.log(this.state.loginStatus);
          if (response.data.state) {
            var userInfo = response.data.data;
            console.log(userInfo);
            this.state.loginStatus = true;
            localStorage.userName = this.state.userName = userInfo.UserName;
            localStorage.toKen = this.state.toKen = userInfo.ToKen;

            this.router.replace("/");
            this.connectServer();
          }
          resolve(response.data);
        });
    });
  },
  register(userName, passWord) {
    this.state.loading = true;
    return new Promise((resolve, reject) => {
      http
        .post("/register", {
          userName: userName,
          passWord: passWord,
        })
        .then((response) => {
          this.state.loading = false;
          console.log(this.state.loginStatus);
          if (response.data.state) {
            var userInfo = response.data.data;
            this.state.loginStatus = true;
            localStorage.userName = this.state.userName = userInfo.UserName;
            localStorage.toKen = this.state.toKen = userInfo.ToKen;

            this.router.replace("/");
            this.connectServer();
          }
          resolve(response.data);
        });
    });
  },
  empty() {
    http.post("/empty").then((response) => {});
  },
  ws: null,
  connectServer() {
    this.emptyChatList();
    this.state.loading = true;
    this.ws = new WebSocket("ws://" + host + "/ws?toKen=" + this.state.toKen);
    this.ws.onmessage = (e) => {
      // console.log(e)
      switch (e.data) {
        case "empty":
          this.emptyChatList();
          return;
        case "close":
          this.ws.onclose = null;
          return;
        default:
          break;
      }
      var json = JSON.parse(e.data);
      this.onMessage(json);
    };
    this.ws.onclose = (error) => {
      this.state.loading = true;
      console.log("与服务器连接断开", error);
      setTimeout(() => {
        console.log("重连中.");
        this.connectServer();
      }, 1000);
    };
    this.ws.onopen = () => {
      this.state.loading = false;
      console.log("连接服务器成功");
    };
  },
  emptyChatList() {
    console.log("emptyChatList");
    var length = this.state.chatList.length;
    for (let i = 0; i < length; i++) {
      this.state.chatList.pop();
    }
  },
  onMessage(data) {
    console.log("###收到服务器消息###", data, data.data);
    if (data.type === "globals") {
      for (let i = 0; i < data.data.length; i++) {
        const element = data.data[i];
        this.state.chatList.push(element);
      }
    } else if (data.type === "global") {
        console.log("#######")
      this.state.chatList.push(data.data);
    }

    this.e.emit("onMessage", data);
    this.e.emit(data.type, data.data);

    try {
      let audioPlay = document.getElementById("audioPlay");
      audioPlay.play();
    } catch (error) {}
  },
  init() {
    if (localStorage.userName) {
      document.title = this.state.userName = localStorage.userName;
      this.state.toKen = localStorage.toKen;
      this.connectServer();
    } else {
    }
  },

  send(data) {
    if (typeof data === "string" || typeof data === "number") {
      this.ws.send(data);
    } else {
      this.ws.send(JSON.stringify(data));
    }
  },
};

// store.init();
export default store;
