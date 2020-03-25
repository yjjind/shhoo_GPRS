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
        <view class="p-t-page-router" @click="saveAddEquipment()">保存</view>
      </view>
    </view>

    <view class="page_background_16181C">
      <view class="title_style">IMEI：{{ imei_code }}</view>
      <view class="font-ccc-12px" style="padding-bottom: 10px;">输入设备名称</view>

      <view class="input_box" style="background: #3B3D41;">
        <input type="text" maxlength="10" placeholder="输入设备名称" v-model="masterName" />
      </view>

      <view class="way_box">
        <view class="way_box_title clearBox">
          <view class="float-left way_box_name">
            <span class="font-fff-16px">路数</span>
          </view>
          <view class="float-left way_box_other_name">
            <span class="font-fff-16px" style="margin-right: 20px;">别名</span>
            <span class="font-ccc-12px">* 不输入默认为路数名称</span>
          </view>
        </view>

        <view class="input_box clearBox" v-for="(item, index) in channelNameArray" :key="index">
          <view class="float-left font-ccc-12px way_input_name">{{ index + 1 }}路</view>
          <view class="float-left way_input">
            <input type="text" maxlength="10" placeholder="输入别名" />
          </view>
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
  </view>
</template>

<script>
  export default {
    data() {
      return {
        imei_code: '',
        channelNameArray: [],
        masterName: '',
        messageDaialog: false,
        messageContent: ''
      }
    },

    onLoad: function (option) {
      //option为object类型，会序列化上个页面传递的参数
      // console.log(option.id); //打印出上个页面传递的参数。
      this.imei_code = JSON.parse(decodeURIComponent(option.IMEIcode))
      // this.masterName = option.masterName;
      let channel = JSON.parse(decodeURIComponent(option.channel))
      for (let i = 0; i < Number(channel); i++) {
        this.channelNameArray.push('')
      }
      console.log('----->取到的数据: ', option)
    },

    created() {
      if (this.mqttConnStat === 0) {
        //表明没有连接，进行连接
        this.$store.dispatch('connectMqttClient')
      }
    },

    computed: {
      mqttConnStat() {
        return this.$store.getters.mqttConnStat
      },
      mqttMessage() {
        return this.$store.state.mqttMessage
      },
      userTel() {
        return this.$store.state.userTel
      }
    },

    watch: {
      mqttMessage() {
        console.log('what')
        let _this = this
        let data = JSON.parse(this.mqttMessage)
        if (
          data.confTyp === 'DEVICE' &&
          data.method === 'BIND' &&
          data.status === 'success' &&
          data.qryId === _this.userTel + _this.userTel
        ) {
          console.log('next data: ', data)
          uni.redirectTo({
            url: `../home/MainPage`
          })
        }

        if (
          data.confTyp === 'DEVICE' &&
          data.method === 'BIND' &&
          data.status !== 'success' &&
          data.qryId === _this.userTel + _this.userTel
        ) {
          this.messageDaialog = true
          this.messageContent = '绑定设备失败' + data.msg
          console.log("------绑定设备失败: ", data);
        }
      }
    },

    methods: {
      returnAgo() {
        uni.redirectTo({
          url: `../home/Equipment`
        })
      },

      saveAddEquipment() {
        let _this = this
        this.channelNameArray.forEach((item, index) => {
          if (item === '') {
            _this.channelNameArray[index] = index + 1 + '路'
          }
        })
        if (this.masterName.trim() === '') {
          this.messageDaialog = true
          this.messageContent = '请填写设备名称'
          console.log('----->:', this.masterName)
          return
        }

        let data = JSON.stringify({
          confTyp: 'DEVICE',
          method: 'BIND',
          qryId: _this.userTel + _this.userTel,
          para: {
            tel: _this.userTel,
            deviceTyp: 'GPRS_CTRL',
            IMEI: _this.imei_code,
            masterName: _this.masterName,
            channelNameArray: _this.channelNameArray,
            local: '测试local',
            bindCode: 'shhoo2020'
          }
        })
        console.log('------- next -------', data)
        this.$store.commit('PUBLISH', data)
      }
    }
  }
</script>

<style>
  @import '../../public/css/basic.css';

  .input_box {
    height: 40px;
    background: #424242;
    border-radius: 8px;
    border: 1px solid #424242;
    font-size: 12px;
    color: #ffffff;
    padding: 10px 16px;
    margin-bottom: 10px;
    height: 22px;
    line-height: 22px;
  }

  .title_style {
    height: 50px;
    line-height: 60px;
    font-size: 14px;
    font-weight: bold;
    color: #54beb6;
  }

  .way_box {
    border: 1px solid #16181c;
    padding-top: 60px;
  }

  .way_box_title {
    margin-bottom: 20px;
  }

  .way_box_name {
    width: 30%;
  }

  .way_box_other_name {
    width: 70%;
  }

  .way_input_name {
    width: 20%;
    border-right: 1px solid #cfcfcf;
  }

  .way_input {
    width: 60%;
    padding: 0px 5%;
  }
</style>