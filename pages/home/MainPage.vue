<template>
  <view class="main">
    <view class="clearBox title-box">
      <view class="title-box-title">尚禾基地</view>
      <view class="title-box-btn" @click="addEquipment()">
        <span class="iconfont icon-zengjiatianjiajiahao"></span>
      </view>
    </view>
    <!--    #54BEB -->
    <view class="clearBox">
      <view v-bind:class="{ sred: true, checked_border: pageTiele === true }" @click="selectAllUserGPRS()">设备</view>
      <view v-bind:class="{ sred: true, checked_border: pageTiele === false }" @click="strategy()">策略</view>
    </view>

    <view v-if="!groupState" class="clearBox">
      <view :class="{
          menu_title: true,
          checked_group_style: checkedGroup === 'all'
        }" @click="selectThisGroupDevice('all')">全部</view>
      <view :class="{
          menu_title: true,
          checked_group_style:
            JSON.stringify(checkedGroup) === JSON.stringify(item)
        }" v-for="(item, index) in groupPartArr" :key="index" @click="selectThisGroupDevice(item)">{{ item.groupName }}
      </view>
      <view class="menu_title float-right" @click="allGroupLayout()">...</view>
    </view>

    <view v-if="groupState">
      <view class="clearBox all-group">
        <view class="clearBox" style="width: 100%; float: left">
          <view class="group-item" @click="selectThisGroupDevice('all')">
            <view :class="{
                'group-item-content': true,
                'group-item-content-click': checkedGroup === 'all'
              }">
              全部
            </view>
          </view>
        </view>

        <view class="group-item" v-for="(item, index) in groupArr" :key="index" @click="selectThisGroupDevice(item)">
          <view :class="{
              'group-item-content': true,
              'group-item-content-click':
                JSON.stringify(checkedGroup) === JSON.stringify(item)
            }">
            {{ item.groupName }}
          </view>
        </view>
        <view class="group-button" @click="groupAdmin()">
          分组管理 >
        </view>
      </view>
    </view>

    <view>
      <view class="clearBox" style="height: 28px; margin: 30px 0px 30px 10px;">
        <view class="float-left icon-style">
          <span class="icon iconfont icon-shujukongzhitai"></span>
        </view>
        <view class="float-left">
          <span style="color: #999999; font-size: 14px;">速控（ 3个设备 ）</span>
        </view>
      </view>
      <view class="content-box">
        <view class="font-fff-14px">灯光控制1</view>

        <view style="margin: 30px 0px 20px;">
          <van-radio-group :value="checked" @change="onChange">
            <van-row gutter="20">
              <van-col span="10">
                <van-radio name="1" checked-color="#54BEB6" icon-size="12px" shape="square" @click="onClick">
                  <span class="font-fff-12px">开启状态</span>
                </van-radio>
              </van-col>
              <van-col span="10">
                <van-radio name="0" checked-color="#54BEB6" icon-size="12px" shape="square" @click="onClick">
                  <span class="font-fff-12px">未开启状态</span>
                </van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </view>
        <!-- v-for="(item, index) in deviceGPRSArray" deviceAllGPRSArray  -->
        <view class="clearBox equipment-box">
          <view class="equipment-item" v-for="(item, index) in lineStateGPRSArray" :key="index">
            <view class="equipment-item-content"> {{ item.name }} </view>
          </view>
        </view>
      </view>
    </view>

    <view>
      <van-cell title="正在加载，请等待" is-link />
      <van-popup :show="loginShow">
        <van-loading type="spinner" color="#1989fa" />
      </van-popup>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        pageTiele: true,
        openState: true,
        groupState: false,
        checkedGroup: 'all',
        checked: '1',
        loginShow: false,
        deviceAllGPRSArray: [],
        lineStateGPRSArray: [],
        onLineGPRSArray: [],
        offLineGPRSArray: [],
        groupArr: [],
        groupPartArr: []
      };
    },

    created() {
      if (this.mqttConnStat === 1) {
        this.selectAllUserGPRS();
        this.selectAllGroup();
        // this.$store.commit('PUBLISH_WATCH');
      } else if (this.mqttConnStat === 2) {
        //表明正在连接，显示loading
      } else if (this.mqttConnStat === 0) {
        //表明没有连接，进行连接
        this.$store.dispatch('connectMqttClient');
        // this.$store.dispatch('connectMqtt')
      } else {
        //不可能的状态
      }
      // this.$store.dispatch("connectMqttClient");
      // this.selectAllUserGPRS()
    },

    onLoad() {
      this.loginShow = true;
    },

    updated() {
      this.loginShow = false;
    },

    computed: {
      mqttConnStat() {
        return this.$store.getters.mqttConnStat;
      },
      mqttClient() {
        return this.$store.state.mqttClient;
      },
      mqttMessage() {
        return this.$store.state.mqttMessage;
      },
      mqttBaseTopic() {
        return this.$store.state.mqttBaseTopic;
      },
      userTel() {
        return this.$store.state.userTel;
      },

      deviceGPRSArray() {
        let data = [];
        if (Number(this.checked) === 1) {
          data = this.deviceAllGPRSArray.filter(item => {
            return item.status === '设备在线';
          });
        }
        if (Number(this.checked) === 0) {
          data = this.deviceAllGPRSArray.filter(item => {
            return item.status !== '设备在线';
          });
        }
        return data;
      }
    },

    watch: {
      mqttConnStat(newVal, oldVal) {
        if (newVal === 1 || oldVal === 2) {
          this.selectAllUserGPRS();
          this.selectAllGroup();
        }
      },

      mqttMessage: {
        handler: function () {
          let _this = this;
          let data = JSON.parse(this.mqttMessage);
          if (
            data.confTyp === 'DEVICE' &&
            data.method === 'QUERY' &&
            data.status === 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.deviceAllGPRSArray = data.para;
            console.log("--------------what: ", this.deviceAllGPRSArray);
            if (this.deviceAllGPRSArray.length > 0 && this.onLineGPRSArray.length === 0) {
              this.lineStateGPRSArray = this.deviceAllGPRSArray
            }
            this.loginShow = false;
          }

          if (
            data.confTyp === 'GROUP' &&
            data.method === 'QUERY_GROUP' &&
            data.status === 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.loginShow = false;
            this.groupArr = Array.isArray(data.para) ? data.para : [];
            if (this.groupArr.length > 3) {
              for (let i = 0; i < 3; i++) {
                this.groupPartArr.push(this.groupArr[i]);
              }
            } else {
              this.groupPartArr = this.groupArr;
            }
          }

          if (
            data.confTyp === 'GROUP' &&
            data.method === 'QUERY_GROUP' &&
            data.status !== 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.loginShow = false;
          }

          if (
            data.confTyp === 'GROUP' &&
            data.method === 'QUERY_DEVICE' &&
            data.status === 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.loginShow = false;
            this.deviceAllGPRSArray = Array.isArray(data.para) ? data.para : [];
          }

          if (
            data.confTyp === 'GROUP' &&
            data.method === 'QUERY_DEVICE' &&
            data.status !== 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.loginShow = false;
            this.messageDaialog = true;
            this.messageContent = '查询当前分组设备失败';
          }

          if (
            data.confTyp === 'GPRS_CTRL' &&
            data.method === 'QUERY_STATUS' &&
            data.status === 'success'
          ) {
            // console.log('========>监听: ', data);
            if (data.para.isOnline === 1) {
              this.deviceAllGPRSArray.forEach(item => {
                // console.log("-------------------------w: ", _this.onLineGPRSArray);
                // console.log("-------------------------w: ", _this.onLineGPRSArray.indexOf(item) === -1);
                if (data.para.IMEI === item.IMEI && _this.onLineGPRSArray.indexOf(item) === -1) {
                  _this.onLineGPRSArray.push(item);
                }
              });
            } else {
              this.deviceAllGPRSArray.filter(item => {
                if (data.para.IMEI === item.IMEI && _this.offLineGPRSArray.indexOf(item) === -1) {
                  _this.offLineGPRSArray.push(item);
                }
              });
            }

            if (this.checked === "1") {
              this.lineStateGPRSArray = this.onLineGPRSArray
            }
            if (this.checked === "0") {
              this.lineStateGPRSArray = this.offLineGPRSArray
            }
            this.loginShow = false;
          }
          if (
            data.confTyp === 'GPRS_CTRL' &&
            data.method === 'QUERY_STATUS' &&
            data.status !== 'success'
          ) {
            console.log('========>监听: ', data);
          }
        },
        deep: true
      }
    },

    methods: {
      onChange(event) {
        console.log('------onChange: ', event.detail);
        this.checked = event.detail;
        if (this.checked === "1") {
          this.lineStateGPRSArray = this.onLineGPRSArray
        }
        if (this.checked === "0") {
          this.lineStateGPRSArray = this.offLineGPRSArray
        }
      },

      onClick(event) {
        this.checked = event.currentTarget.dataset;
      },

      equipment() {
        // console.log('start -----');
        // wx.navigateTo({
        //   url: `../home/Equipment`,
        // });
      },

      strategy() {},

      allGroupLayout() {
        console.log('ssssss');
        this.groupState = true;
      },

      addEquipment() {
        uni.redirectTo({
          url: `../home/Equipment`
        });
      },

      groupAdmin() {
        uni.redirectTo({
          url: `../home/GroupAdmin`
        });
      },

      selectAllUserGPRS() {
        let _this = this;
        console.log('=====>quryID: ', _this.userTel + _this.userTel);
        let data = JSON.stringify({
          confTyp: 'DEVICE',
          method: 'QUERY',
          qryId: _this.userTel + _this.userTel,
          para: {
            tel: _this.userTel,
            deviceTyp: 'GPRS_CTRL'
          }
        });
        this.$store.commit('PUBLISH', data);
      },

      selectAllGroup() {
        let _this = this;
        let data = JSON.stringify({
          confTyp: 'GROUP',
          method: 'QUERY_GROUP',
          qryId: _this.userTel + _this.userTel,
          para: {
            tel: _this.userTel
          }
        });
        this.loginShow = true;
        console.log('s:  ', data);
        this.$store.commit('PUBLISH', data);
      },

      selectThisGroupDevice(item) {
        this.checkedGroup = item;
        if (item === 'all') {
          this.selectAllUserGPRS();
        } else {
          let _this = this;
          let data = JSON.stringify({
            confTyp: 'GROUP',
            method: 'QUERY_DEVICE',
            qryId: _this.userTel + _this.userTel,
            para: {
              tel: _this.userTel,
              deviceTyp: item.deviceType,
              groupId: item.groupId
            }
          });
          this.loginShow = true;
          this.$store.commit('PUBLISH', data);
        }
      }
    }
  };
</script>

<style>
  @import "../../public/css/basic.css";

  .main {
    background: #16181c;
    min-height: 1200upx;
    padding-bottom: 50px;
  }

  .title-box,
  .title-box-btn,
  .title-box-title {
    background: #2e2e2e;
    height: 38px;
  }

  .title-box {
    position: relative;
  }

  .title-box-btn,
  .title-box-title {
    /* float: left; */
    line-height: 38px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    position: absolute;
  }

  .title-box-title {
    left: 41%;
  }

  .title-box-btn {
    width: 15%;
    right: 0px;
  }

  .checked_border {
    border-bottom: 3px solid #54beb6;
  }

  .all-group {
    padding-top: 8px;
    border-radius: 8px;
    margin: 16px 10px 30px;
    background: #2d2f33;
  }

  .group-item {
    float: left;
    width: 33%;
  }

  .group-item-content {
    margin: 8px;
    color: #ffffff;
    font-size: 14px;
    border-radius: 19px;
    background: #424242;
    border: 1px solid #424242;
    height: 35px;
    line-height: 35px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .group-item-content:hover,
  .group-item-content-click {
    color: #54beb6;
    border: 1px solid #54beb6;
  }

  .group-button {
    float: left;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
    color: #cccccc;
    border-top: 1px solid #424242;
    margin-top: 9px;
  }

  .menu_title {
    width: 20%;
    float: left;
    color: #ccc;
    font-size: 12px;
    padding: 10px 0px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .checked_group_style {
    color: #54beb6;
  }

  .icon-style {
    background: #ffffff;
    color: #2e2e2e;
    font-size: 29px;
    height: 25px;
    width: 25px;
    line-height: 15px;
    font-weight: bold;
    margin-right: 15px;
    text-align: center;
    border-radius: 5px;
  }

  .content-box {
    background: #2e2e2e;
    padding: 15px 10px 50px;
    margin: 10px;
    border-radius: 10px;
  }

  .equipment-box {
    /* margin-right: -30px; */
    margin: 0px -10px;
  }

  .equipment-item {
    float: left;
    width: 33%;
    height: 50px;
    margin: 5px 0px;
    color: #999999;
  }

  .equipment-item-content {
    margin: 12px 5px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #424242;
    font-size: 12px;
    border-radius: 8px;
    color: #999999;
  }
</style>