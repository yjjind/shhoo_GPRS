import Vue from 'vue';
import Vuex from 'vuex';

const mqtt = require('mqtt');

Vue.use(Vuex);

const mqttTopic =
  '391a88e39e872f1c811d19a3c89c8715183530203b0a80041ff99d1fcaf6c8fe';
export default new Vuex.Store({
  state: {
    mqttClient: null,
    mqttMessage: null,
    mqttBaseTopic: null,
    // mqttBaseTopic: wx.getStorageSync('mqttBaseTopic'),
    mqttConnectionStatus: 0, // mqtt连接状态状态机
    userTel: null
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
    },
    userTel: function (state) {
      return state.userTel;
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
      state.mqttClient = event;
    },
    PUBLISH(state, event) {
      // console.log('store PUBLISH: ', state.mqttClient);
      state.mqttClient.publish(`${mqttTopic}/cloudserver/actuator/conf`, event);
      if (state.mqttClient !== null) {}
    },
    SUBSCRIPTION(state) {
      state.mqttClient.subscribe(`${mqttTopic}/cloudserver/actuator/confack`);
    },
    SUBSCRIPTION_WATCH(state) {
      state.mqttClient.subscribe(
        `391a88e39e872f1c811d19a3c89c8715183530203b0a80041ff99d1fcaf6c8fe/cloudserver/actuator/cmdack`
      );
    },
    SUBMESSAGE(state, event) {
      // console.log('store SUBMESSAGE: ', event);
      state.mqttMessage = null;
      state.mqttMessage = event.message;
      state.mqttBaseTopic = event.topic;
    },
    SAVE_USER_TEL(state, event) {
      state.userTel = event;
    }
  },
  actions: {
    connectMqttClient: function ({
      commit
    }) {
      try {
        const mqttClient = mqtt.connect('wxs://yigrow.cn/mqtt/', {
          username: 'shhooserver001',
          password: 'shhoo2018',
          keepalive: 15,
          reconnect: true, // Enable automatic reconnect
          reconnectInterval: 10 // Reconnect attempt interval : 10 seconds
        });
        mqttClient.on('connect', function () {
          commit('CHANGE_MQTT_CONN_STAT', 1); //状态为1
          commit('CONNECTMQTT', mqttClient);
          commit('SUBSCRIPTION');
          commit('SUBSCRIPTION_WATCH');
        });

        // mqttClient.on('error', function (err) {
        //   console.log('===>connect error: ', err)
        //   mqttClient.end()
        // })

        mqttClient.on('reconnect', function () {
          console.log('正在重连: ', mqttClient);
        });
        mqttClient.on('message', (topic, message) => {
          commit('SUBMESSAGE', {
            message: message.toString(),
            topic: topic
          });
          // console.log("---- 接受信息后 ---");
        });
      } catch (error) {
        console.log('连接异常', error);
      }
    }
  }
});