<template>
  <view>
    <view class="clearBox page-title-box">
      <view class="p-title-box clearBox">
        <view class="p-title-box-return" @click="returnAgo()">
          <span class="iconfont icon-zuozhankai" style="color: #ffffff; font-size: 32px"></span>
        </view>
      </view>
      <view class="p-title-box font-fff-16px" style="text-align: center;">分组管理</view>
      <view class="p-title-box clearBox">
        <view class="p-t-page-router" @click="routerEditEquipment()">添加分组</view>
      </view>
    </view>

    <view class="page_background_16181C">
      <view class="clearBox title_box">
        <view class="title_box_name">{{ groupAllList.length }}个分组</view>
        <view class="clearBox title_box_btn " v-if="groupAllList.length > 0">
          <view class="title_box float-right font-color-54BEB" @click="editGroupEquipment()">
            {{ editState ? "完成" : "编辑" }}
          </view>
        </view>
      </view>

      <view :class="{
          group_equipment: true,
          group_equipment_border_top: index === 0,
          group_equipment_border_bottom: index === 2
        }" v-for="(item, index) in groupAllList" :key="index">
        <view class="float-left btn_box" v-if="editState" @click="removeEquipment(item)">
          <span class="iconfont icon-shanchu"></span>
        </view>
        <view class="float-left">{{ item.groupName }}</view>
        <view class="float-right" @click="editGroup(item)">有 {{ JSON.parse(item.deviceIdArray).length }} 个设备 ></view>
      </view>
    </view>

    <view class="dialog-box" v-show="showDaialog">
      <view class="dialog-box-title">提示</view>
      <view class="dialog-box-content">
        您要删除 {{ deleteItem.groupName }}
        吗？删除后此分组的设备将会被移除，您可以在全部分组种查看
      </view>
      <view class="dialog-btn-box clearBox">
        <view class="dialog-btn">
          <view class="d-btn" @click="showDaialog = false">取消</view>
        </view>
        <view class="dialog-btn">
          <view class="d-btn" @click="confirmDelete()">删除</view>
        </view>
      </view>
    </view>

    <view class="dialog-box" v-show="messageDaialog">
      <view class="dialog-box-title">提示</view>
      <view class="font-fff-14px" style="padding: 0px 15px">
        {{ messageContent }}
      </view>
      <view class="dialog-btn-box clearBox">
        <view class="d-btn" @click="messageDaialog = false">关闭</view>
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
        editState: false,
        showDaialog: false,
        groupAllList: [],
        messageDaialog: false,
        messageContent: '删除成功',
        groupId: '',
        deleteItem: {},
        loginShow: false
      };
    },

    created() {
      console.log('start created: ', this.mqttConnStat);
      if (this.mqttConnStat === 1) {
        this.loginShow = false;
        // this.$store.dispatch('connectMqttClient');
        this.selectAllGroup();
      } else if (this.mqttConnStat === 2) {
        //表明正在连接，显示loading
      } else if (this.mqttConnStat === 0) {
        //表明没有连接，进行连接
        this.$store.dispatch('connectMqttClient');
        // this.$store.dispatch('connectMqtt')
      } else {
        //不可能的状态
      }
      // this.selectAllGroup();
    },

    // updated() {
    //   this.loginShow = false;
    // },

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
      }
    },

    watch: {
      mqttConnStat: {
        handler: function (newVal, oldVal) {
          console.log("wcccccc newVal, oldVal:", newVal, oldVal);
          let _this = this;
          if (newVal === 1) {
            this.selectAllGroup();
          }
        },
        deep: true
      },

      mqttMessage: {
        handler: function () {
          let _this = this;
          let data = JSON.parse(this.mqttMessage);
          if (
            data.confTyp === 'GROUP' &&
            data.method === 'QUERY_GROUP' &&
            data.status === 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            console.log('QUERY_GROUP data: ', data);
            this.groupAllList = Array.isArray(data.para) ? data.para : [];
            this.loginShow = false;
          }
          if (
            data.confTyp === 'GROUP' &&
            data.method === 'QUERY_GROUP' &&
            data.status !== 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.groupAllList = [];
            this.loginShow = false;
          }

          if (
            data.confTyp === 'GROUP' &&
            data.method === 'DELETE_GROUP' &&
            data.status === 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.showDaialog = false;
            this.messageDaialog = true;
            this.messageContent = '删除成功';
            this.loginShow = false;
            console.log('=======>删除: ', data);
            this.selectAllGroup();
          }
          if (
            data.confTyp === 'GROUP' &&
            data.method === 'DELETE_GROUP' &&
            data.status !== 'success' &&
            data.qryId === _this.userTel + _this.userTel
          ) {
            this.showDaialog = false;
            this.messageDaialog = true;
            this.messageContent = '删除失败';
            this.loginShow = false;
          }
        },
        deep: true
      }
    },

    methods: {
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

      editGroupEquipment() {
        this.editState = !this.editState;
      },

      editGroup(item) {
        console.log("====>点击分组: ", item);
        wx.redirectTo({
          url: `../home/EditEquipment?group=${JSON.stringify(item)}`
        });
      },

      removeEquipment(item) {
        this.showDaialog = true;
        this.deleteItem = item;
      },
      confirmDelete() {
        let _this = this;
        let data = JSON.stringify({
          confTyp: 'GROUP',
          method: 'DELETE_GROUP',
          qryId: _this.userTel + _this.userTel,
          para: {
            tel: _this.userTel,
            deviceTyp: _this.deleteItem.deviceType,
            groupId: _this.deleteItem.groupId
          }
        });
        this.loginShow = true;
        console.log('-----删除传的数据', data);
        this.$store.commit('PUBLISH', data);
      },

      returnAgo() {
        this.loginShow = false;
        uni.redirectTo({
          url: `../home/MainPage`
        });
      },

      routerEditEquipment() {
        uni.redirectTo({
          // url: `../home/EditEquipment?groupId=${''}&group=${null}`
          url: `../home/EditEquipment?group=${null}`
        });
      }
    }
  };
</script>

<style>
  @import '../../public/css/basic.css';

  .title_box {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }

  .title_box_name,
  .title_box_btn {
    float: left;
    width: 50%;
    height: 50px;
    color: #999999;
  }

  .title_box_btn {
    text-align: right;
    color: #54beb6;
  }

  .group_equipment {
    background: #2e2e2e;
    color: #ffffff;
    font-size: 12px;
    height: 50px;
    line-height: 50px;
    padding: 0px 15px;
    margin: 2px 0px;
  }

  .btn_box {
    height: 50px;
    line-height: 50px;
    margin-right: 12px;
    font-size: 18px;
    font-weight: bold;
    color: red;
  }

  .group_equipment_border_top {
    border-radius: 8px 8px 0px 0px;
  }

  .group_equipment_border_bottom {
    border-radius: 0px 0px 8px 8px;
  }

  /* .dialog-box-title {
	height: 50px;
	line-height: 50px;
	text-align: center;
	font-size: 18px;
	font-weight: bold;
	color: #ffffff;
} */

  .dialog-box-content {
    line-height: 18px;
    padding: 13px 20px 30px;
    text-align: center;
    color: #ffffff;
    font-size: 12px;
  }
</style>