import Vue from "vue";
import Vuex from "vuex";

const mqtt = require('mqtt');

Vue.use(Vuex);

const mqttTopic =
  "391a88e39e872f1c811d19a3c89c8715183530203b0a80041ff99d1fcaf6c8fe";
export default new Vuex.Store({
  state: {
    mqttClient: null,
    mqttMessage: null,
    mqttBaseTopic: null,
    // mqttBaseTopic: wx.getStorageSync('mqttBaseTopic'),
    mqttConnectionStatus: 0 // mqtt连接状态状态机
  },
  getters: {
    mqttMessage: function (state) {
      return state.mqttMessage;
    },
    mqttBaseTopic: function (state) {
      return state.mqttBaseTopic;
    },
    mqttClient: function (state) {
      return state.mqttClient;
    },
    mqttConnStat: function (state) {
      return state.mqttConnectionStatus;
    }
  },
  mutations: {
    /**
     * 判断mqtt是否连接
     */
    CHANGE_MQTT_CONN_STAT: function (state, newStatus) {
      if (newStatus === 0 || newStatus === 1 || newStatus === 2) {
        state.mqttConnectionStatus = newStatus;
      } else {
        state.mqttConnectionStatus = newStatus;
      }
    },
    CONNECTMQTT: function (state, event) {
      // console.log("------->basic error: ", event);
      // if(event === null) {
      //   state.mqttClient = mqtt.connect("wxs://yigrow.cn/mqtt/", {
      //     username: "shhooserver001",
      //     password: "shhoo2018",
      //     keepalive: 15
      //   });
      // } else {
      //   state.mqttClient = event;
      // }
      state.mqttClient = event;
      // console.log("CONNECTMQTT: ", state.mqttClient)
    },
    PUBLISH(state, event) {
      if(state.mqttClient === null) {
        state.mqttClient = mqtt.connect("wxs://yigrow.cn/mqtt/", {
          username: "shhooserver001",
          password: "shhoo2018",
          keepalive: 15
        });
      }
      // console.log("=========>erro: ", state.mqttClient);
      state.mqttClient.publish(`${mqttTopic}/cloudserver/actuator/conf`, event);
      console.log("=========>PUBLISH data: ", event);
    },
    SUBSCRIPTION(state) {
      state.mqttClient.subscribe(`${mqttTopic}/cloudserver/actuator/confack`);
      // console.log("=========>subscribe erro: ", state.mqttClient);
      // state.mqttClient.on("message", function (topic, message){
      //   console.log("--------------------------------------");
      //   console.log("=====>message: ", message)
      // });
    },
    SUBMESSAGE(state, event) {
      console.log("---->SUBMESSAGE: ", event);
      state.mqttMessage = null;
      state.mqttMessage = event.message;
      state.mqttBaseTopic = event.topic;
    }
  },
  actions: {
    connectMqttClient: function ({
      commit
    }) {
      const mqttClient = mqtt.connect("wxs://yigrow.cn/mqtt/", {
        username: "shhooserver001",
        password: "shhoo2018",
        keepalive: 15
      });
      // console.log("===================1==================", mqttClient);
      mqttClient.on("connect", function () {
        commit("CHANGE_MQTT_CONN_STAT", 1); //状态为1
        console.log("--- CHANGE_MQTT_CONN_STAT ---");
        commit("CONNECTMQTT", mqttClient);
        console.log("--- CONNECTMQTT ---");
        commit("SUBSCRIPTION");
        console.log("--- SUBSCRIPTION ---");
      });
      
      mqttClient.on('error', function(err) {
      	console.log(err);
      	mqttClient.end();
      });
      
      // mqttClient.on('reconnect', function() {
      // 	// console.log('正在重连');
      //   // commit("CHANGE_MQTT_CONN_STAT", 1); //状态为1
      //   // commit("CONNECTMQTT", mqttClient);
      //   // commit("SUBSCRIPTION");
      // });
      
      mqttClient.on("message", (topic, message) => {
        commit("SUBMESSAGE", {
          message: message.toString(),
          topic: topic
        });
      });
    }
  }
});